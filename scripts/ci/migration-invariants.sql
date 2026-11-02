\set ON_ERROR_STOP on

BEGIN;

DO $$
DECLARE
  v_predicate text;
BEGIN
  SELECT pg_get_expr(i.indpred, i.indrelid)
    INTO v_predicate
  FROM pg_index AS i
  JOIN pg_class AS c ON c.oid = i.indexrelid
  JOIN pg_namespace AS n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname = 'idx_appointments_active_scheduled_at';

  IF v_predicate IS NULL
     OR position('requested' IN v_predicate) = 0
     OR position('pending_confirmation' IN v_predicate) = 0
     OR position('confirmed' IN v_predicate) = 0
     OR position('cancelled_by_customer' IN v_predicate) > 0
     OR position('cancelled_by_technician' IN v_predicate) > 0 THEN
    RAISE EXCEPTION '0004 active appointment index is missing';
  END IF;

  INSERT INTO public.appointments (
    appointment_number,
    scheduled_at,
    duration_minutes,
    status,
    customer_name,
    customer_phone
  )
  VALUES (
    'CI-0004-A',
    '2099-01-02 10:00:00+00',
    0,
    'requested',
    'CI Fixture',
    '0000000000'
  );

  BEGIN
    INSERT INTO public.appointments (
      appointment_number,
      scheduled_at,
      duration_minutes,
      status,
      customer_name,
      customer_phone
    )
    VALUES (
      'CI-0004-B',
      '2099-01-02 10:00:00+00',
      0,
      'requested',
      'CI Fixture',
      '0000000000'
    );
    RAISE EXCEPTION '0004 duplicate active start was accepted';
  EXCEPTION
    WHEN unique_violation THEN
      NULL;
  END;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.appointments'::regclass
      AND conname = 'appointments_active_schedule_no_overlap'
      AND contype = 'x'
  ) THEN
    RAISE EXCEPTION '0007 active appointment exclusion is missing';
  END IF;

  INSERT INTO public.appointments (
    appointment_number,
    scheduled_at,
    duration_minutes,
    status,
    customer_name,
    customer_phone
  )
  VALUES (
    'CI-0007-A',
    '2099-01-03 10:00:00+00',
    30,
    'confirmed',
    'CI Fixture',
    '0000000000'
  );

  INSERT INTO public.appointments (
    appointment_number,
    scheduled_at,
    duration_minutes,
    status,
    customer_name,
    customer_phone
  )
  VALUES (
    'CI-0007-B',
    '2099-01-03 10:30:00+00',
    30,
    'confirmed',
    'CI Fixture',
    '0000000000'
  );

  BEGIN
    INSERT INTO public.appointments (
      appointment_number,
      scheduled_at,
      duration_minutes,
      status,
      customer_name,
      customer_phone
    )
    VALUES (
      'CI-0007-C',
      '2099-01-03 10:15:00+00',
      30,
      'confirmed',
      'CI Fixture',
      '0000000000'
    );
    RAISE EXCEPTION '0007 overlapping active appointment was accepted';
  EXCEPTION
    WHEN exclusion_violation THEN
      NULL;
  END;
END
$$;

DO $$
DECLARE
  v_public_count integer;
  v_private_count integer;
BEGIN
  INSERT INTO public.settings (key, value)
  VALUES ('internal_secret_test', '"ci-only-private-value"');

  SET LOCAL ROLE anon;

  IF current_user <> 'anon' THEN
    RAISE EXCEPTION '0006 test did not execute as anon';
  END IF;

  SELECT COUNT(*)::integer
    INTO v_public_count
  FROM public.settings
  WHERE key IN (
    'business_name',
    'business_tagline',
    'business_city',
    'business_province',
    'instagram',
    'facebook'
  );

  SELECT COUNT(*)::integer
    INTO v_private_count
  FROM public.settings
  WHERE key = 'internal_secret_test';

  IF v_public_count <> 6 THEN
    RAISE EXCEPTION '0006 expected six public settings, got %', v_public_count;
  END IF;

  IF v_private_count <> 0 THEN
    RAISE EXCEPTION '0006 private setting is visible to anon';
  END IF;
END
$$;

RESET ROLE;

DO $$
DECLARE
  v_function regprocedure;
  v_owner name;
  v_security_definer boolean;
  v_config text[];
BEGIN
  SELECT p.oid::regprocedure,
         pg_get_userbyid(p.proowner),
         p.prosecdef,
         p.proconfig
    INTO v_function, v_owner, v_security_definer, v_config
  FROM pg_proc AS p
  JOIN pg_namespace AS n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname = 'generate_appointment_number'
    AND pg_get_function_identity_arguments(p.oid) = '';

  IF v_function IS NULL OR v_owner <> 'postgres'
     OR NOT v_security_definer
     OR NOT (COALESCE('search_path=pg_catalog' = ANY(v_config), false)) THEN
    RAISE EXCEPTION '0005 appointment generator metadata is unsafe';
  END IF;

  IF NOT has_function_privilege('postgres', 'public.generate_appointment_number()', 'EXECUTE')
     OR NOT has_function_privilege('service_role', 'public.generate_appointment_number()', 'EXECUTE')
     OR has_function_privilege('anon', 'public.generate_appointment_number()', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.generate_appointment_number()', 'EXECUTE') THEN
    RAISE EXCEPTION '0005 appointment generator ACL is incorrect';
  END IF;

  IF NOT has_function_privilege('postgres', 'public._generate_number(text)', 'EXECUTE')
     OR has_function_privilege('service_role', 'public._generate_number(text)', 'EXECUTE')
     OR has_function_privilege('anon', 'public._generate_number(text)', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public._generate_number(text)', 'EXECUTE') THEN
    RAISE EXCEPTION '0005 internal generator ACL is incorrect';
  END IF;

  IF has_table_privilege('anon', 'public.number_sequences', 'SELECT')
     OR has_table_privilege('authenticated', 'public.number_sequences', 'SELECT')
     OR has_table_privilege('service_role', 'public.number_sequences', 'SELECT') THEN
    RAISE EXCEPTION '0005 number_sequences remains directly readable';
  END IF;
END
$$;

DO $$
DECLARE
  v_value text;
BEGIN
  SET LOCAL ROLE anon;
  BEGIN
    PERFORM public.generate_appointment_number();
    RAISE EXCEPTION '0005 anon invocation was accepted';
  EXCEPTION
    WHEN insufficient_privilege THEN
      NULL;
  END;

  RESET ROLE;
  SET LOCAL ROLE authenticated;
  BEGIN
    PERFORM public.generate_appointment_number();
    RAISE EXCEPTION '0005 authenticated invocation was accepted';
  EXCEPTION
    WHEN insufficient_privilege THEN
      NULL;
  END;

  RESET ROLE;
  SET LOCAL ROLE service_role;
  IF current_user <> 'service_role' THEN
    RAISE EXCEPTION '0005 service_role could not be assumed';
  END IF;
  v_value := public.generate_appointment_number();
  IF v_value !~ '^TUR-[0-9]{4}-[0-9]{6}$' THEN
    RAISE EXCEPTION '0005 generator returned invalid value';
  END IF;
END
$$;

RESET ROLE;
ROLLBACK;
