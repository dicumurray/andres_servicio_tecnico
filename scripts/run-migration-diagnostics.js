#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Diagnosticos de migraciones 0004-0007.
 *
 * Solo lectura: este archivo no ejecuta INSERT, UPDATE, DELETE, DDL ni
 * consultas que expongan valores de datos personales.
 *
 * Requiere SUPABASE_DB_URL o DATABASE_URL en el entorno del proceso. Nunca
 * lee ni imprime .env.local para evitar copiar secretos al reporte.
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const outputPath = process.argv[2] || path.join(
  process.cwd(),
  'INFORME-DIAGNOSTICO-MIGRACIONES-LOCAL.txt',
);
const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
const report = {
  generated_at: new Date().toISOString(),
  mode: 'read-only',
  credentials_in_report: false,
  connection: connectionString ? 'configured' : 'missing',
  checks: [],
};

function addCheck(name, status, details) {
  report.checks.push({ name, status, details });
}

async function check(client, name, sql, map) {
  try {
    const result = await client.query(sql);
    addCheck(name, 'ok', map(result.rows));
  } catch (error) {
    addCheck(name, 'blocked', {
      reason: error instanceof Error ? error.message : 'SQL query failed',
    });
  }
}

async function main() {
  if (!connectionString) {
    addCheck('connection', 'blocked', {
      reason: 'Define SUPABASE_DB_URL o DATABASE_URL fuera del repositorio.',
    });
    writeReport();
    return;
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    await check(client, 'schema_objects', `
      SELECT
        to_regclass('public.appointments') IS NOT NULL AS appointments,
        to_regclass('public.number_sequences') IS NOT NULL AS number_sequences,
        to_regclass('public.settings') IS NOT NULL AS settings
    `, rows => rows[0]);

    await check(client, '0004_duplicate_active_starts', `
      SELECT COUNT(*)::integer AS duplicate_groups
      FROM (
        SELECT scheduled_at
        FROM public.appointments
        WHERE status IN ('requested', 'pending_confirmation', 'confirmed')
        GROUP BY scheduled_at
        HAVING COUNT(*) > 1
      ) duplicates
    `, rows => rows[0]);

    await check(client, '0007_invalid_active_durations', `
      SELECT COUNT(*)::integer AS invalid_rows
      FROM public.appointments
      WHERE status IN ('requested', 'pending_confirmation', 'confirmed')
        AND duration_minutes IS NOT NULL
        AND duration_minutes <= 0
    `, rows => rows[0]);

    await check(client, '0007_active_overlaps', `
      SELECT COUNT(*)::integer AS overlapping_pairs
      FROM public.appointments a
      JOIN public.appointments b
        ON a.id < b.id
       AND a.status IN ('requested', 'pending_confirmation', 'confirmed')
       AND b.status IN ('requested', 'pending_confirmation', 'confirmed')
       AND tstzrange(
             a.scheduled_at,
             a.scheduled_at + make_interval(mins => COALESCE(a.duration_minutes, 30)),
             '[)'
           ) &&
           tstzrange(
             b.scheduled_at,
             b.scheduled_at + make_interval(mins => COALESCE(b.duration_minutes, 30)),
             '[)'
           )
    `, rows => rows[0]);

    await check(client, '0005_number_sequence_rls', `
      SELECT relrowsecurity AS rls_enabled,
             relforcerowsecurity AS force_rls
      FROM pg_class
      WHERE oid = 'public.number_sequences'::regclass
    `, rows => rows[0] || { table_missing: true });

    await check(client, '0005_number_sequence_grants', `
      SELECT grantee, privilege_type
      FROM information_schema.role_table_grants
      WHERE table_schema = 'public'
        AND table_name = 'number_sequences'
      ORDER BY grantee, privilege_type
    `, rows => rows);

    await check(client, '0005_generator_functions', `
      SELECT p.proname AS name,
             pg_get_userbyid(p.proowner) AS owner,
             p.prosecdef AS security_definer,
             pg_get_function_identity_arguments(p.oid) AS arguments
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public'
        AND p.proname IN (
          '_generate_number',
          'generate_appointment_number',
          'generate_repair_number',
          'generate_customer_number',
          'generate_quote_number'
        )
      ORDER BY p.proname, arguments
    `, rows => rows);

    await check(client, '0005_generator_execute_grants', `
      SELECT routine_name, grantee, privilege_type
      FROM information_schema.role_routine_grants
      WHERE routine_schema = 'public'
        AND routine_name IN (
          '_generate_number',
          'generate_appointment_number',
          'generate_repair_number',
          'generate_customer_number',
          'generate_quote_number'
        )
      ORDER BY routine_name, grantee, privilege_type
    `, rows => rows);

    await check(client, '0006_public_settings_keys', `
      SELECT
        COUNT(*)::integer AS total_keys,
        COUNT(*) FILTER (
          WHERE key IN (
            'business_name',
            'business_tagline',
            'business_city',
            'business_province',
            'instagram',
            'facebook'
          )
        )::integer AS allowed_keys,
        COUNT(*) FILTER (
          WHERE key NOT IN (
            'business_name',
            'business_tagline',
            'business_city',
            'business_province',
            'instagram',
            'facebook'
          )
        )::integer AS non_public_keys
      FROM public.settings
    `, rows => rows[0]);

    await check(client, '0007_btree_gist', `
      SELECT EXISTS (
        SELECT 1
        FROM pg_extension
        WHERE extname = 'btree_gist'
      ) AS installed
    `, rows => rows[0]);

    await check(client, 'migration_constraints', `
      SELECT conname, contype
      FROM pg_constraint
      WHERE conrelid = 'public.appointments'::regclass
        AND conname IN (
          'appointments_active_schedule_no_overlap'
        )
      ORDER BY conname
    `, rows => rows);
  } finally {
    await client.end().catch(() => {});
  }

  writeReport();
}

function writeReport() {
  const blocked = report.checks.filter(checkResult => checkResult.status === 'blocked');
  report.summary = {
    checks: report.checks.length,
    completed: report.checks.length - blocked.length,
    blocked: blocked.length,
    result: blocked.length === report.checks.length && report.connection === 'missing'
      ? 'connection_required'
      : blocked.length > 0 ? 'partial' : 'completed',
  };

  const lines = [
    'DIAGNOSTICO DE MIGRACIONES 0004-0007',
    `Generado: ${report.generated_at}`,
    'Modo: solo lectura',
    `Conexion: ${report.connection}`,
    '',
    'No se guardan credenciales, URLs completas, valores de settings, IDs de usuarios',
    'ni registros individuales en este informe.',
    '',
    JSON.stringify(report, null, 2),
    '',
  ];
  fs.writeFileSync(outputPath, lines.join('\n'), { mode: 0o600 });
  console.log(`Reporte escrito en ${outputPath}`);
}

main().catch(error => {
  addCheck('runner', 'blocked', {
    reason: error instanceof Error ? error.message : 'diagnostic runner failed',
  });
  writeReport();
  process.exitCode = 1;
});
