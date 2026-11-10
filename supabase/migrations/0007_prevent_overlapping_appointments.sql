-- Impide solapamientos entre turnos activos incluso cuando llegan solicitudes
-- concurrentes o con horarios de inicio diferentes.

BEGIN;

CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.appointments'::regclass
      AND conname = 'appointments_active_schedule_no_overlap'
  ) THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_active_schedule_no_overlap
      EXCLUDE USING gist (
        tstzrange(
          scheduled_at,
          scheduled_at + make_interval(mins => COALESCE(duration_minutes, 30)),
          '[)'
        ) WITH &&
      )
      WHERE (status IN ('requested', 'pending_confirmation', 'confirmed'));
  END IF;
END
$$;

COMMIT;

-- Diagnóstico previo recomendado (solo lectura):
--
-- SELECT a.id, a.appointment_number, a.scheduled_at,
--        COALESCE(a.duration_minutes, 30) AS duration_minutes, a.status
-- FROM public.appointments AS a
-- WHERE a.status IN ('requested', 'pending_confirmation', 'confirmed')
--   AND (a.duration_minutes IS NOT NULL AND a.duration_minutes <= 0);
--
-- SELECT a.id AS first_id, b.id AS second_id,
--        a.appointment_number AS first_number,
--        b.appointment_number AS second_number
-- FROM public.appointments AS a
-- JOIN public.appointments AS b
--   ON a.id < b.id
--  AND a.status IN ('requested', 'pending_confirmation', 'confirmed')
--  AND b.status IN ('requested', 'pending_confirmation', 'confirmed')
--  AND tstzrange(
--        a.scheduled_at,
--        a.scheduled_at + make_interval(mins => COALESCE(a.duration_minutes, 30)),
--        '[)'
--      ) &&
--      tstzrange(
--        b.scheduled_at,
--        b.scheduled_at + make_interval(mins => COALESCE(b.duration_minutes, 30)),
--        '[)'
--      );
