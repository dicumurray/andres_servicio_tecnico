'use client'

import { useState, useTransition } from 'react'
import type { Appointment } from '@/types/database'

type Action = 'confirm' | 'reject' | 'cancel'

const labels: Record<Action, string> = {
  confirm: 'Confirmar',
  reject: 'Rechazar',
  cancel: 'Cancelar',
}

export function AdminAppointments({ appointments }: { appointments: Appointment[] }) {
  const [items, setItems] = useState(appointments)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const updateAppointment = (id: string, action: Action) => {
    setError(null)
    setPendingId(id)
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/appointments/${id}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action }),
        })
        const result = await response.json() as { id?: string; status?: Appointment['status']; error?: string }
        if (!response.ok || !result.id || !result.status) {
          setError(result.error ?? 'No se pudo actualizar el turno.')
          return
        }
        setItems((current) => current.filter((item) => item.id !== id))
      } catch {
        setError('No se pudo actualizar el turno.')
      } finally {
        setPendingId(null)
      }
    })
  }

  if (items.length === 0) {
    return <p className="rounded-lg border border-default bg-elevated p-6 text-muted">No hay turnos pendientes.</p>
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-danger">{error}</p>}
      <div className="overflow-x-auto rounded-lg border border-default bg-elevated">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-default text-muted">
            <tr>
              <th className="px-4 py-3">Turno</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((appointment) => (
              <tr key={appointment.id} className="border-b border-default last:border-0">
                <td className="px-4 py-3 font-medium text-body">{appointment.appointment_number}</td>
                <td className="px-4 py-3 text-body">
                  {appointment.customer_name} {appointment.customer_surname}
                  <span className="block text-xs text-muted">{appointment.customer_phone}</span>
                </td>
                <td className="px-4 py-3 text-body">{new Date(appointment.scheduled_at).toLocaleString('es-AR')}</td>
                <td className="px-4 py-3 text-muted">{appointment.status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {(['confirm', 'reject', 'cancel'] as Action[]).map((action) => (
                      <button
                        key={action}
                        type="button"
                        disabled={pendingId === appointment.id}
                        onClick={() => updateAppointment(appointment.id, action)}
                        className="rounded-md border border-default px-3 py-1.5 text-xs font-medium text-body hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {labels[action]}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
