#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Verificación PRE-MIGRACIÓN — solo lectura.
 * Comprueba estado de la base de datos de Supabase.
 * NO ejecuta INSERT, UPDATE, DELETE, DROP, ALTER, CREATE.
 */

const { Client } = require('pg');

// La API REST de Supabase no permite ejecutar SQL arbitrario. Usar la URL de
// conexión de PostgreSQL disponible en Project Settings > Database > Connect.
const DATABASE_URL = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Falta SUPABASE_DB_URL o DATABASE_URL.');
  console.error('Copiá la cadena URI de PostgreSQL desde Supabase: Project Settings > Database > Connect.');
  console.error('Luego ejecutá: source .env.local && node check-migration-status.js');
  process.exit(1);
}

const databaseUrl = new URL(DATABASE_URL);
const host = databaseUrl.hostname;

// Verificar que se puede alcanzar el host sin exponer el URL completo
console.log('=== VERIFICACIÓN DE CONEXIÓN ===');
console.log('Host del proyecto:', host.replace(/^[^.]+\./, '[proyecto].'));
console.log('');

const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function executeSql(sql) {
  const result = await client.query(sql);
  return result.rows;
}

async function run() {
  console.log('=== VERIFICACIÓN DEL ESTADO DEL PROYECTO ===\n');

  // 1. Verificar que la conexión funciona
  try {
    const test = await executeSql('SELECT 1 AS connected');
    if (test[0]?.connected === 1) {
      console.log('✓ Conexión a la base de datos establecida correctamente.\n');
    } else {
      console.log('✗ La conexión no devolvió el resultado esperado.');
      process.exit(1);
    }
  } catch (e) {
    console.error('✗ NO SE PUDO CONECTAR A LA BASE DE DATOS:', e.message);
    console.error('Posibles causas:');
    console.error('  - El host o el puerto PostgreSQL no son accesibles desde esta red.');
    console.error('  - El proxy/firewall bloquea la salida TCP o TLS.');
    console.error('  - La cadena de conexión, usuario o contraseña no son correctos.');
    console.error('  - El proyecto está pausado o inactivo.');
    process.exit(1);
  }

  // 2. Listar tablas existentes
  console.log('=== 1. TABLAS EN SCHEMA PUBLIC ===');
  let tables = [];
  try {
    const result = await executeSql(`
      SELECT table_name, table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    tables = result;
    console.log(`Se encontraron ${tables.length} tablas:\n`);
    tables.forEach(t => {
      console.log(`  ${t.table_name} (${t.table_type})`);
    });
  } catch (e) {
    console.error('✗ Error al listar tablas:', e.message);
  }

  console.log('');

  // 3. Verificar tablas específicas
  console.log('=== 2. TABLAS ESPECÍFICAS (según 0001_initial_schema.sql) ===');
  const expectedTables = [
    'profiles', 'customers', 'devices', 'services',
    'appointments', 'availability', 'availability_exceptions',
    'repairs', 'repair_status_history', 'quotes', 'quote_items',
    'content_posts', 'repair_posts', 'projects', 'media',
    'notifications', 'settings', 'audit_logs'
  ];
  const existingNames = new Set(tables.map(t => t.table_name));
  expectedTables.forEach(t => {
    const exists = existingNames.has(t);
    console.log(`  ${exists ? '✓ EXISTE' : '✗ NO EXISTE'}  ${t}`);
  });

  console.log('');

  // 4. Enums
  console.log('=== 3. ENUMS DEFINIDOS ===');
  let enums = [];
  try {
    const result = await executeSql(`
      SELECT typname
      FROM pg_type
      WHERE typtype = 'e'
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      ORDER BY typname
    `);
    enums = result.map(e => e.typname);
    console.log(`Se encontraron ${enums.length} enums:\n`);
    enums.forEach(e => console.log(`  - ${e}`));
  } catch (e) {
    console.error('✗ Error al listar enums:', e.message);
  }

  console.log('');

  // 5. Funciones
  console.log('=== 4. FUNCIONES DEFINIDAS ===');
  let functions = [];
  try {
    const result = await executeSql(`
      SELECT proname
      FROM pg_proc
      WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      ORDER BY proname
    `);
    functions = result.map(f => f.proname);
    console.log(`Se encontraron ${functions.length} funciones:\n`);
    functions.forEach(f => console.log(`  - ${f}`));
  } catch (e) {
    console.error('✗ Error al listar funciones:', e.message);
  }

  console.log('');

  // 6. Triggers
  console.log('=== 5. TRIGGERS DEFINIDOS ===');
  let triggers = [];
  try {
    const result = await executeSql(`
      SELECT tgname, tgrelid::regclass AS table_name
      FROM pg_trigger
      WHERE tgnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        AND tgname NOT LIKE 'pg_%'
      ORDER BY tgname
    `);
    triggers = result;
    console.log(`Se encontraron ${triggers.length} triggers:\n`);
    triggers.forEach(t => console.log(`  - ${t.tgname} (tabla: ${t.table_name})`));
  } catch (e) {
    console.error('✗ Error al listar triggers:', e.message);
  }

  console.log('');

  // 7. Policies de RLS
  console.log('=== 6. POLÍTICAS DE RLS ===');
  let policies = [];
  try {
    const result = await executeSql(`
      SELECT schemaname, tablename, policyname, permissive, cmd
      FROM pg_policies
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname
    `);
    policies = result;
    if (policies.length === 0) {
      console.log('  No hay políticas de RLS definidas.');
    } else {
      console.log(`Se encontraron ${policies.length} políticas:\n`);
      policies.forEach(p => {
        console.log(`  ${p.tablename}.${p.policyname} (${p.permissive}, cmd=${p.cmd})`);
      });
    }
  } catch (e) {
    console.error('✗ Error al listar políticas:', e.message);
  }

  console.log('');

  // 8. Tablas con RLS habilitado
  console.log('=== 7. TABLAS CON RLS HABILITADO ===');
  let rlsEnabled = [];
  try {
    const result = await executeSql(`
      SELECT c.relname
      FROM pg_class c
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE n.nspname = 'public'
        AND c.relkind = 'r'
        AND c.relrowsecurity = true
      ORDER BY c.relname
    `);
    rlsEnabled = result.map(r => r.relname);
    if (rlsEnabled.length === 0) {
      console.log('  Ninguna tabla tiene RLS habilitado.');
    } else {
      console.log(`${rlsEnabled.length} tablas con RLS habilitado:\n`);
      rlsEnabled.forEach(t => console.log(`  - ${t}`));
    }
  } catch (e) {
    console.error('✗ Error al verificar RLS:', e.message);
  }

  console.log('');

  // 9. Resumen final
  console.log('=== RESUMEN: ESTADO DEL PROYECTO ===');
  const existingCount = tables.filter(t => t.table_type === 'BASE TABLE').length;
  const totalExpected = expectedTables.length;
  const missingCount = expectedTables.filter(t => !existingNames.has(t)).length;

  console.log(`Tablas existentes (base tables): ${existingCount}`);
  console.log(`Tablas esperadas (según 0001): ${totalExpected}`);
  console.log(`Tablas faltantes: ${missingCount}`);
  console.log('');

  if (existingCount === 0 && missingCount === totalExpected) {
    console.log('⚠️  SITUACIÓN A: La base de datos está VACÍA.');
    console.log('   La migración 0001 NO ha sido aplicada.');
    console.log('   Se puede corregir 0001 antes de ejecutarla.\n');
  } else if (missingCount === 0 && existingCount >= totalExpected) {
    console.log('⚠️  SITUACIÓN B: Todas las tablas esperadas EXISTEN.');
    console.log('   Es probable que la migración 0001 YA HAYA SIDO aplicada.');
    console.log('   NO se debe modificar 0001. Crear 0002 para cambios adicionales.\n');
  } else {
    console.log('⚠️  SITUACIÓN INTERMEDIA: Algunas tablas existen, otras no.');
    console.log('   Verificar manualmente qué partes de la migración se aplicaron.\n');
  }

  // Details on key functions
  console.log('=== DETALLE: FUNCIONES CRÍTICAS ===');
  const criticalFuncs = [
    'handle_new_user',
    'generate_appointment_number',
    'generate_repair_number',
    'generate_customer_number',
    'generate_quote_number',
    'trigger_set_updated_at',
  ];
  criticalFuncs.forEach(fn => {
    const exists = functions.includes(fn);
    console.log(`  ${exists ? '✓ EXISTE' : '✗ NO EXISTE'}  ${fn}`);
  });

  console.log('');

  // Details on triggers
  console.log('=== DETALLE: TRIGGERS DE MIGRACIÓN ===');
  const criticalTriggers = [
    'on_auth_user_created',
    'set_profiles_updated_at',
    'set_customers_updated_at',
    'set_devices_updated_at',
    'set_services_updated_at',
    'set_appointments_updated_at',
    'set_repairs_updated_at',
    'set_quotes_updated_at',
    'set_content_posts_updated_at',
    'set_repair_posts_updated_at',
    'set_projects_updated_at',
    'set_settings_updated_at',
  ];
  const triggerNames = triggers.map(t => t.tgname);
  criticalTriggers.forEach(tn => {
    const exists = triggerNames.includes(tn);
    console.log(`  ${exists ? '✓ EXISTE' : '✗ NO EXISTE'}  ${tn}`);
  });

  console.log('');

  // Details on RLS
  console.log('=== DETALLE: ESTADO DE RLS ===');
  console.log(`  Policies definidas: ${policies.length}`);
  console.log(`  Tablas con RLS: ${rlsEnabled.length}`);
  if (policies.length === 0 && rlsEnabled.length === 0) {
    console.log('  → RLS NO está habilitado en ninguna tabla.');
    console.log('  → Es necesario agregar ENABLE ROW LEVEL SECURITY + CREATE POLICY.');
  }

  console.log('\n=== VERIFICACIÓN COMPLETADA ===');
}

run().catch(e => {
  console.error('\n✗ ERROR FATAL:', e.message);
  console.error('No se pudo completar la verificación.');
  process.exit(1);
}).finally(() => client.end().catch(() => {}));
