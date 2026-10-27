ALTER TABLE public.appointments
  ALTER COLUMN appointment_number
  SET DEFAULT public.generate_appointment_number();
