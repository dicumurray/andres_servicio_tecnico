-- Evita que dos solicitudes confirmen el mismo horario activo.
-- Los turnos cancelados no bloquean nuevamente el horario.
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_active_scheduled_at
  ON public.appointments (scheduled_at)
  WHERE status IN ('requested', 'pending_confirmation', 'confirmed');
