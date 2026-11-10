#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Verificación PRE-MIGRACIÓN — solo lectura.
 * Usa una conexión PostgreSQL de solo lectura.
 * NO ejecuta INSERT, UPDATE, DELETE, DROP, ALTER, CREATE.
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('NO EXISTE .env.local');
  process.exit(1);
}

// Parse .env.local sin exponer valores
const envLines = fs.readFileSync(envPath, 'utf-8').split('\n');
const envVars = {};
for (const line of envLines) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim();
      envVars[key] = val;
    }
  }
}

const DATABASE_URL = envVars.SUPABASE_DB_URL || envVars.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Falta SUPABASE_DB_URL o DATABASE_URL en .env.local.');
  console.error('Copiá la cadena URI desde Supabase: Project Settings > Database > Connect.');
  process.exit(1);
}

const databaseUrl = new URL(DATABASE_URL);
const host = databaseUrl.hostname;
const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function executeSql(query) {
  const result = await client.query(query);
  return result.rows;
}

async function runChecks() {
  const results = {
    project_host: host,
    check_time: new Date().toISOString(),
    checks: []
  };

  // Helper
  async function q(sql) {
    const result = await executeSql(sql);
    if (result.error) throw new Error(`SQL error: ${result.error.message || JSON.stringify(result.error)}`);
    return Array.isArray(result) ? result : [result];
  }

  // 1. Tablas en public schema
  const tables = await q(`
    SELECT table_name, table_type
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  results.tables = tables;
  results.summary_tables = {
    found: tables.length,
    names: tables.map(t => t.table_name)
  };

  // 2. Tablas objetivo
  const targetTables = [
    'profiles', 'customers', 'devices', 'services',
    'appointments', 'availability', 'availability_exceptions',
    'repairs', 'repair_status_history', 'quotes', 'quote_items',
    'content_posts', 'repair_posts', 'projects', 'media',
    'notifications', 'settings', 'audit_logs'
  ];
  results.target_tables = {};
  for (const t of targetTables) {
    results.target_tables[t] = tables.some(row => row.table_name === t);
  }

  // 3. Enums
  const enums = await q(`
    SELECT enum_name, enum_label
    FROM information_schema.enum_values
    WHERE schema_name = 'public'
    ORDER BY enum_name, enum_label
  `);
  results.enums = enums;
  const enumNames = [...new Set(enums.map(e => e.enum_name))];
  results.enum_names = enumNames;

  // 4. Funciones
  const funcs = await q(`
    SELECT routine_name, data_type
    FROM information_schema.routines
    WHERE routine_schema = 'public'
      AND routine_type = 'FUNCTION'
    ORDER BY routine_name
  `);
  results.functions = funcs;
  const funcNames = funcs.map(f => f.routine_name);
  results.func_exists = {
    handle_new_user: funcNames.includes('handle_new_user'),
    generate_appointment_number: funcNames.includes('generate_appointment_number'),
    generate_repair_number: funcNames.includes('generate_repair_number'),
    generate_customer_number: funcNames.includes('generate_customer_number'),
    generate_quote_number: funcNames.includes('generate_quote_number'),
    trigger_set_updated_at: funcNames.includes('trigger_set_updated_at'),
  };

  // 5. Triggers
  const triggers = await q(`
    SELECT trigger_name, event_object_table
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    ORDER BY event_object_table, trigger_name
  `);
  results.triggers = triggers;
  const triggerNames = triggers.map(t => t.trigger_name);
  results.trigger_exists = {
    on_auth_user_created: triggerNames.includes('on_auth_user_created'),
    set_profiles_updated_at: triggerNames.includes('set_profiles_updated_at'),
    set_customers_updated_at: triggerNames.includes('set_customers_updated_at'),
    set_devices_updated_at: triggerNames.includes('set_devices_updated_at'),
    set_services_updated_at: triggerNames.includes('set_services_updated_at'),
    set_appointments_updated_at: triggerNames.includes('set_appointments_updated_at'),
    set_repairs_updated_at: triggerNames.includes('set_repairs_updated_at'),
    set_quotes_updated_at: triggerNames.includes('set_quotes_updated_at'),
    set_content_posts_updated_at: triggerNames.includes('set_content_posts_updated_at'),
    set_repair_posts_updated_at: triggerNames.includes('set_repair_posts_updated_at'),
    set_projects_updated_at: triggerNames.includes('set_projects_updated_at'),
    set_settings_updated_at: triggerNames.includes('set_settings_updated_at'),
  };

  // 6. Policies RLS
  const policies = await q(`
    SELECT schemaname, tablename, policyname, permissive, cmd
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname
  `);
  results.policies = policies;
  results.policy_count = policies.length;
  results.policies_by_table = {};
  for (const p of policies) {
    if (!results.policies_by_table[p.tablename]) {
      results.policies_by_table[p.tablename] = [];
    }
    results.policies_by_table[p.tablename].push({
      name: p.policyname,
      permissive: p.permissive,
      cmd: p.cmd
    });
  }

  // 7. Tablas con RLS habilitado
  const rlsTables = await q(`
    SELECT c.relname AS table_name,
           c.relrowsecurity AS row_security_enabled
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
    ORDER BY c.relname
  `);
  results.rls_tables = rlsTables;
  const rlsEnabled = rlsTables.filter(t => t.row_security_enabled).map(t => t.table_name);
  results.rls_enabled_tables = rlsEnabled;

  // Summary final
  results.summary = {
    tables_found: tables.length,
    target_tables_found: targetTables.filter(t => results.target_tables[t]).length,
    target_tables_missing: targetTables.filter(t => !results.target_tables[t]),
    enums_found: enumNames.length,
    functions_found: funcNames.length,
    functions_missing: Object.entries(results.func_exists)
      .filter(([, value]) => !value)
      .map(([name]) => name),
    triggers_found: triggers.length,
    triggers_missing: Object.entries(results.trigger_exists)
      .filter(([, value]) => !value)
      .map(([name]) => name),
    policies_found: policies.length,
    rls_enabled_tables: rlsEnabled.length,
    rls_disabled_tables: rlsTables.filter(t => !t.row_security_enabled).map(t => t.table_name),
  };

  console.log(JSON.stringify(results, null, 2));
}

runChecks().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
}).finally(() => client.end().catch(() => {}));
