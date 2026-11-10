BEGIN;

REVOKE ALL PRIVILEGES ON TABLE public.number_sequences
  FROM PUBLIC, anon, authenticated, service_role;

ALTER TABLE public.number_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.number_sequences NO FORCE ROW LEVEL SECURITY;

COMMIT;
