import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase-server'
import type { Appointment, Profile } from '@/types/database'

type AdminAppointmentDatabase = {
  public: {
    Tables: {
      profiles: {
        Row: Record<string, unknown> & Pick<Profile, 'role' | 'status'>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: []
      }
      appointments: {
        Row: Record<string, unknown> & Pick<Appointment, 'id' | 'status' | 'appointment_number'>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      profile_role: Profile['role']
      profile_status: Profile['status']
      appointment_status: Appointment['status']
    }
    CompositeTypes: Record<string, never>
  }
}

const updateAppointmentSchema = z.object({
  action: z.enum(['confirm', 'reject', 'cancel']),
})

const actionStatus = {
  confirm: 'confirmed',
  reject: 'cancelled_by_technician',
  cancel: 'cancelled_by_technician',
} as const

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  if (!z.uuid().safeParse(id).success) {
    return NextResponse.json({ error: 'El turno indicado no es válido.' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'La acción enviada no es válida.' }, { status: 400 })
  }

  const parsed = updateAppointmentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'La acción solicitada no es válida.' }, { status: 400 })
  }

  const supabase = await createClient<AdminAppointmentDatabase>()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: 'Se requiere autenticación.' }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .maybeSingle()

  if (
    profileError ||
    !profile ||
    profile.status !== 'active' ||
    (profile.role !== 'admin' && profile.role !== 'technician')
  ) {
    return NextResponse.json({ error: 'No tenés permisos para modificar turnos.' }, { status: 403 })
  }

  const nextStatus = actionStatus[parsed.data.action]
  const { data: appointment, error } = await supabase
    .from('appointments')
    .update({ status: nextStatus })
    .eq('id', id)
    .in('status', ['requested', 'pending_confirmation', 'confirmed'])
    .select('id, status, appointment_number')
    .maybeSingle()

  if (error) {
    console.error('Error actualizando turno administrativo:', error)
    return NextResponse.json({ error: 'No se pudo actualizar el turno.' }, { status: 500 })
  }

  if (!appointment) {
    return NextResponse.json(
      { error: 'El turno no existe o ya fue procesado.' },
      { status: 409 },
    )
  }

  return NextResponse.json(appointment)
}
