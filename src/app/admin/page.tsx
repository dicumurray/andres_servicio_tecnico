import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import type { Database, Profile } from '@/types/database'
import { AdminAppointments } from '@/components/admin/admin-appointments'

export default async function AdminPage() {
  const supabase = await createClient<Database>()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .maybeSingle()
  const profile = profileData as Pick<Profile, 'role' | 'status'> | null

  if (
    !profile ||
    profile.status !== 'active' ||
    (profile.role !== 'admin' && profile.role !== 'technician')
  ) {
    redirect('/admin/login?unauthorized=1')
  }

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*')
    .in('status', ['requested', 'pending_confirmation', 'confirmed'])
    .order('scheduled_at', { ascending: true })
    .limit(100)

  return (
    <main className="min-h-screen bg-body px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm text-muted">Panel administrativo</p>
          <h1 className="text-3xl font-bold text-body">Solicitudes de turnos</h1>
        </div>
        {error ? (
          <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-danger">
            No se pudieron cargar los turnos.
          </div>
        ) : (
          <AdminAppointments appointments={appointments ?? []} />
        )}
      </div>
    </main>
  )
}
