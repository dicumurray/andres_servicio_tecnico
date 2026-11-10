-- La política pública usa una lista blanca para evitar que una nueva clave
-- sensible quede expuesta por accidente.

BEGIN;

DROP POLICY IF EXISTS settings_select_public ON public.settings;

CREATE POLICY settings_select_public ON public.settings
  FOR SELECT
  TO anon, authenticated
  USING (
    key IN (
      'business_name',
      'business_tagline',
      'business_city',
      'business_province',
      'instagram',
      'facebook'
    )
  );

COMMIT;
