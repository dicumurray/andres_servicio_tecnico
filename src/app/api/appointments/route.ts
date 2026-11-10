import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient, createPublicClient } from '@/lib/supabase-server'
import {
  isWithinAvailability,
  overlapsExistingAppointment,
  type AvailabilityExceptionWindow,
  type AvailabilityWindow,
  type ExistingAppointmentWindow,
} from '@/lib/appointment-availability'
import type { Appointment, Service } from '@/types/database'

type LooseTable = {
  Row: Record<string, unknown>
  Insert: Record<string, unknown>
  Update: Record<string, unknown>
  Relationships: []
}
type AppointmentApiDatabase = {
  public: {
    Tables: {
      services: LooseTable
      availability: LooseTable
      availability_exceptions: LooseTable
      appointments: LooseTable
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      service_status: Service['status']
      appointment_status: Appointment['status']
    }
    CompositeTypes: Record<string, never>
  }
}

const appointmentRequestSchema = z.object({
  service_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  name: z.string().trim().min(2).max(100),
  surname: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(32),
  email: z.union([z.email(), z.literal('')]),
  device_brand: z.string().trim().min(1).max(100),
  device_model: z.string().trim().min(1).max(100),
  failure_description: z.string().trim().min(10).max(2000),
  notes: z.string().max(2000),
})

export const PUBLIC_APPOINTMENT_STATUS = 'requested' as const

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  const allowedOrigins = new Set([
    new URL(request.url).origin,
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter((value): value is string => Boolean(value)))
  if (origin && !allowedOrigins.has(origin)) {
    return NextResponse.json({ error: 'Solicitud no válida.' }, { status: 403 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 16_384) {
    return NextResponse.json({ error: 'El formulario enviado es demasiado grande.' }, { status: 413 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'El formulario enviado no es válido.' }, { status: 400 })
  }

  const parsed = appointmentRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Revisá los datos del formulario e intentá nuevamente.' }, { status: 400 })
  }

  const input = parsed.data
  const [year, month, day] = input.date.split('-').map(Number)
  const validDate = new Date(Date.UTC(year, month - 1, day))
  if (
    validDate.getUTCFullYear() !== year ||
    validDate.getUTCMonth() !== month - 1 ||
    validDate.getUTCDate() !== day
  ) {
    return NextResponse.json({ error: 'La fecha seleccionada no es válida.' }, { status: 400 })
  }

  const scheduledAt = new Date(`${input.date}T${input.time}:00-03:00`)
  if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
    return NextResponse.json({ error: 'La fecha y el horario deben ser válidos y futuros.' }, { status: 400 })
  }

  try {
    const publicClient = createPublicClient<AppointmentApiDatabase>()
    const { data: serviceData, error: serviceError } = await publicClient
      .from('services')
      .select('id, estimated_duration')
      .eq('id', input.service_id)
      .eq('status', 'active')
      .maybeSingle()
    const service = serviceData as Pick<Service, 'id' | 'estimated_duration'> | null

    if (serviceError) {
      console.error('Error verificando servicio de turno:', serviceError)
      return NextResponse.json({ error: 'No se pudo verificar el servicio. Intentá nuevamente.' }, { status: 500 })
    }
    if (!service) {
      return NextResponse.json({ error: 'El servicio seleccionado ya no está disponible.' }, { status: 400 })
    }

    const adminClient = createAdminClient<AppointmentApiDatabase>()
    const durationMinutes = service.estimated_duration ?? 30
    const { data: availability, error: availabilityError } = await adminClient
      .from('availability')
      .select('day_of_week, start_time, end_time')
      .eq('day_of_week', validDate.getUTCDay())

    if (availabilityError) {
      console.error('Error verificando disponibilidad semanal:', availabilityError)
      return NextResponse.json({ error: 'No se pudo verificar la disponibilidad. Intentá nuevamente.' }, { status: 500 })
    }

    const { data: exceptions, error: exceptionsError } = await adminClient
      .from('availability_exceptions')
      .select('start_date, end_date, start_time, end_time')
      .lte('start_date', input.date)
      .gte('end_date', input.date)

    if (exceptionsError) {
      console.error('Error verificando excepciones de disponibilidad:', exceptionsError)
      return NextResponse.json({ error: 'No se pudo verificar la disponibilidad. Intentá nuevamente.' }, { status: 500 })
    }

    if (!isWithinAvailability(
      input.date,
      input.time,
      durationMinutes,
      (availability ?? []) as AvailabilityWindow[],
      (exceptions ?? []) as AvailabilityExceptionWindow[],
    )) {
      return NextResponse.json({ error: 'El horario seleccionado no está disponible.' }, { status: 409 })
    }

    const requestedEnd = new Date(scheduledAt.getTime() + durationMinutes * 60_000)
    const { data: existingAppointments, error: existingAppointmentError } = await adminClient
      .from('appointments')
      .select('scheduled_at, duration_minutes')
      .in('status', ['requested', 'pending_confirmation', 'confirmed'])
      .lt('scheduled_at', requestedEnd.toISOString())
      .gte('scheduled_at', new Date(scheduledAt.getTime() - 24 * 60 * 60_000).toISOString())

    if (existingAppointmentError) {
      console.error('Error verificando disponibilidad del turno:', existingAppointmentError)
      return NextResponse.json({ error: 'No se pudo verificar la disponibilidad. Intentá nuevamente.' }, { status: 500 })
    }

    if (overlapsExistingAppointment(
      scheduledAt,
      durationMinutes,
      (existingAppointments ?? []) as ExistingAppointmentWindow[],
    )) {
      return NextResponse.json({ error: 'Ese horario se superpone con otro turno. Elegí otro e intentá nuevamente.' }, { status: 409 })
    }

    const { data: appointmentData, error } = await adminClient
      .from('appointments')
      .insert({
        service_id: service.id,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: durationMinutes,
        status: PUBLIC_APPOINTMENT_STATUS,
        customer_name: input.name,
        customer_surname: input.surname,
        customer_phone: input.phone,
        customer_email: input.email || null,
        device_brand: input.device_brand,
        device_model: input.device_model,
        failure_description: input.failure_description,
        notes: input.notes || null,
      })
      .select('appointment_number')
      .single()
    const appointment = appointmentData as Pick<Appointment, 'appointment_number'> | null

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Ese horario ya no está disponible. Elegí otro e intentá nuevamente.' }, { status: 409 })
      }
      console.error('Error creando appointment:', error)
      return NextResponse.json({ error: 'No se pudo crear el turno. Intentá nuevamente.' }, { status: 500 })
    }

    if (!appointment) {
      console.error('La creación del turno no devolvió su número.')
      return NextResponse.json({ error: 'No se pudo confirmar la creación del turno.' }, { status: 500 })
    }

    return NextResponse.json({ appointment_number: appointment.appointment_number })
  } catch (error) {
    console.error('Error procesando solicitud de turno:', error)
    return NextResponse.json({ error: 'No se pudo procesar el turno. Intentá nuevamente.' }, { status: 500 })
  }
}
