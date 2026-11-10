-- Cierra el acceso directo a los contadores y deja los generadores disponibles
-- únicamente para el cliente server-side que inserta registros.

BEGIN;

REVOKE ALL PRIVILEGES ON TABLE public.number_sequences
  FROM PUBLIC, anon, authenticated, service_role;

ALTER TABLE public.number_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.number_sequences NO FORCE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public._generate_number(p_prefix text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
  v_year integer;
  v_seq bigint;
BEGIN
  v_year := extract(year FROM now())::integer;

  INSERT INTO public.number_sequences (year, prefix, seq)
  VALUES (v_year, p_prefix, 0)
  ON CONFLICT (year, prefix) DO NOTHING;

  UPDATE public.number_sequences
  SET seq = seq + 1
  WHERE year = v_year AND prefix = p_prefix
  RETURNING seq INTO v_seq;

  IF v_seq IS NULL THEN
    SELECT seq + 1 INTO v_seq
    FROM public.number_sequences
    WHERE year = v_year AND prefix = p_prefix
    FOR UPDATE;

    IF v_seq IS NULL THEN
      RAISE EXCEPTION 'No se pudo reservar el contador %/%', v_year, p_prefix;
    END IF;

    UPDATE public.number_sequences
    SET seq = v_seq
    WHERE year = v_year AND prefix = p_prefix;
  END IF;

  RETURN p_prefix || '-' || v_year || '-' || lpad(v_seq::text, 6, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_appointment_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN public._generate_number('TUR');
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_repair_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN public._generate_number('REP');
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_customer_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN public._generate_number('CUS');
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
BEGIN
  RETURN public._generate_number('PRE');
END;
$$;

REVOKE ALL PRIVILEGES ON FUNCTION public._generate_number(text)
  FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL PRIVILEGES ON FUNCTION public.generate_appointment_number()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON FUNCTION public.generate_repair_number()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON FUNCTION public.generate_customer_number()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON FUNCTION public.generate_quote_number()
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public._generate_number(text) TO postgres;
GRANT EXECUTE ON FUNCTION public.generate_appointment_number() TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_repair_number() TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_customer_number() TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_quote_number() TO service_role;

COMMIT;
