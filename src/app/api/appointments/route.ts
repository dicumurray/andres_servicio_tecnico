import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase-server'
import type { Appointment, AppointmentInsert, Service } from '@/types/database'

type AppointmentApiDatabase = {
  public: {
    Tables: {
      services: {
        Row: Record<string, unknown> & Pick<Service, 'id' | 'estimated_duration' | 'status'>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: []
      }
      appointments: {
        Row: Record<string, unknown> & Pick<Appointment, 'appointment_number'>
        Insert: Record<string, unknown> & AppointmentInsert
        Update: Record<string, unknown>
        Relationships: []
      }
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

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin || origin !== new URL(request.url).origin) {
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
    const supabase = await createAdminClient<AppointmentApiDatabase>()
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, estimated_duration')
      .eq('id', input.service_id)
      .eq('status', 'active')
      .maybeSingle()

    if (serviceError) {
      console.error('Error verificando servicio de turno:', serviceError)
      return NextResponse.json({ error: 'No se pudo verificar el servicio. Intentá nuevamente.' }, { status: 500 })
    }
    if (!service) {
      return NextResponse.json({ error: 'El servicio seleccionado ya no está disponible.' }, { status: 400 })
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        service_id: service.id,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: service.estimated_duration,
        status: 'requested',
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

    if (error) {
      console.error('Error creando appointment:', error)
      return NextResponse.json({ error: 'No se pudo crear el turno. Intentá nuevamente.' }, { status: 500 })
    }

    return NextResponse.json({ appointment_number: appointment.appointment_number })
  } catch (error) {
    console.error('Error procesando solicitud de turno:', error)
    return NextResponse.json({ error: 'No se pudo procesar el turno. Intentá nuevamente.' }, { status: 500 })
  }
}
