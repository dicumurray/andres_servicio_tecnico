-- ─── andres-servicio-tecnico — Initial Schema ──────────────────────────
-- Migración inicial: tablas base, enums, funciones, triggers, RLS.
-- Ejecutar con: supabase migration run
-- O pegar en SQL Editor del dashboard de Supabase.
-- Versión corregida: RLS con roles reales de Supabase (authenticated/anon),
--   ownership vía profiles.id = auth.uid(), generators con lock por fila,
--   función is_admin_or_technician() para autorización admin/technician.

BEGIN;

-- ─── ENUMS ───────────────────────────────────────────────────────────────

CREATE TYPE profile_role AS ENUM ('admin', 'technician', 'customer');
CREATE TYPE profile_status AS ENUM ('active', 'inactive');
CREATE TYPE service_status AS ENUM ('active', 'inactive', 'coming_soon');
CREATE TYPE appointment_status AS ENUM (
  'requested',
  'pending_confirmation',
  'confirmed',
  'cancelled_by_customer',
  'cancelled_by_technician',
  'completed',
  'no_show'
);
CREATE TYPE device_type AS ENUM ('celular', 'notebook', 'pc', 'impresora', 'ups', 'fuente', 'placa', 'otro');
CREATE TYPE repair_status AS ENUM (
  'recibido',
  'en_diagnostico',
  'presupuesto_pendiente',
  'presupuesto_enviado',
  'esperando_autorizacion',
  'autorizado',
  'en_reparacion',
  'esperando_repuesto',
  'reparacion_finalizada',
  'en_pruebas',
  'listo_para_retirar',
  'entregado',
  'rechazado',
  'cancelado',
  'sin_reparacion',
  'abandonado'
);
CREATE TYPE quote_status AS ENUM ('borrador', 'enviado', 'visto', 'aceptado', 'rechazado', 'vencido');
CREATE TYPE content_status AS ENUM ('borrador', 'publicado', 'archivado');
CREATE TYPE content_type AS ENUM ('articulo', 'reparacion_publicable', 'proyecto');
CREATE TYPE media_category AS ENUM (
  'celulares', 'electronica', 'placas', 'soldadura',
  'laboratorio', 'ups', 'fuentes', 'pc', 'impresoras', 'proyectos'
);
CREATE TYPE project_status AS ENUM ('activo', 'completado', 'en_curso');
CREATE TYPE notification_type AS ENUM (
  'appointment_requested',
  'appointment_confirmed',
  'appointment_cancelled',
  'repair_received',
  'budget_sent',
  'repair_authorized',
  'repair_finished',
  'ready_for_pickup',
  'repair_delivered'
);
CREATE TYPE entity_type AS ENUM ('repair', 'content_post', 'project', 'gallery');
CREATE TYPE availability_exception_type AS ENUM ('blocked', 'vacation', 'holiday', 'special');

-- ─── TABLAS ──────────────────────────────────────────────────────────────

-- Profiles (extensión de auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role profile_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  status profile_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  notes TEXT,
  status profile_status NOT NULL DEFAULT 'active',
  communications_consent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Devices
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type device_type NOT NULL DEFAULT 'celular',
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  imei TEXT,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  full_description TEXT,
  category TEXT,
  image_url TEXT,
  price NUMERIC(12,2),
  price_visible BOOLEAN NOT NULL DEFAULT FALSE,
  estimated_duration INTEGER, -- minutos
  status service_status NOT NULL DEFAULT 'active',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Availability (horarios por día de la semana)
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TEXT NOT NULL, -- HH:MM
  end_time TEXT NOT NULL,   -- HH:MM
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Availability exceptions (bloqueos, vacaciones, feriados)
CREATE TABLE IF NOT EXISTS availability_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  reason TEXT,
  type availability_exception_type NOT NULL DEFAULT 'blocked',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Appointments (turnos)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  appointment_number TEXT NOT NULL UNIQUE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  status appointment_status NOT NULL DEFAULT 'requested',
  customer_name TEXT,
  customer_surname TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  device_brand TEXT,
  device_model TEXT,
  failure_description TEXT,
  notes TEXT,
  confirmation_sent_at TIMESTAMPTZ,
  CONSTRAINT appointment_customer_details_check CHECK (
    (customer_id IS NOT NULL) OR
    (customer_name IS NOT NULL AND customer_phone IS NOT NULL)
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Repairs
CREATE TABLE IF NOT EXISTS repairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  repair_number TEXT NOT NULL UNIQUE,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  declared_failure TEXT,
  diagnosis TEXT,
  cause TEXT,
  work_done TEXT,
  components_used TEXT,
  budget NUMERIC(12,2),
  final_price NUMERIC(12,2),
  warranty TEXT,
  status repair_status NOT NULL DEFAULT 'recibido',
  internal_notes TEXT,
  delivery_date TIMESTAMPTZ,
  publish_authorized BOOLEAN NOT NULL DEFAULT FALSE,
  hide_sensitive_data BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Repair status history (línea temporal)
-- status ahora usa el tipo enum repair_status para integridad referencial
CREATE TABLE IF NOT EXISTS repair_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  status repair_status NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quotes (presupuestos)
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  quote_number TEXT NOT NULL UNIQUE,
  description TEXT,
  amount NUMERIC(12,2),
  expiration_date DATE,
  conditions TEXT,
  status quote_status NOT NULL DEFAULT 'borrador',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quote items
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT,
  quantity NUMERIC(10,2) DEFAULT 1 CHECK (quantity >= 0),
  unit_price NUMERIC(12,2) CHECK (unit_price IS NULL OR unit_price >= 0),
  total_price NUMERIC(12,2) CHECK (total_price IS NULL OR total_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Content posts (blog / artículos)
CREATE TABLE IF NOT EXISTS content_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  category TEXT,
  tags TEXT[], -- array de strings
  status content_status NOT NULL DEFAULT 'borrador',
  seo_title TEXT,
  seo_description TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Repair posts (casos de reparación publicables)
CREATE TABLE IF NOT EXISTS repair_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_id UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
  title TEXT,
  problem TEXT,
  diagnosis TEXT,
  solution TEXT,
  result TEXT,
  images TEXT[], -- URLs
  video_url TEXT,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  technologies TEXT[],
  images TEXT[],
  videos TEXT[],
  status project_status NOT NULL DEFAULT 'activo',
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Media (gestión centralizada de imágenes/videos/documentos)
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type entity_type NOT NULL,
  entity_id UUID, -- UUID de la entidad asociada (repair, content_post, project)
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document')),
  title TEXT,
  description TEXT,
  category media_category,
  alt_text TEXT,
  is_private BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT,
  message TEXT,
  reference_type TEXT, -- 'appointment', 'repair', 'quote'
  reference_id UUID,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Settings (configuración del negocio)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INDEXES ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_customers_customer_number ON customers(customer_number);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_devices_customer_id ON devices(customer_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_appointments_appointment_number ON appointments(appointment_number);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_repairs_repair_number ON repairs(repair_number);
CREATE INDEX IF NOT EXISTS idx_repairs_status ON repairs(status);
CREATE INDEX IF NOT EXISTS idx_repairs_customer_id ON repairs(customer_id);
CREATE INDEX IF NOT EXISTS idx_repairs_device_id ON repairs(device_id);
CREATE INDEX IF NOT EXISTS idx_repairs_appointment_id ON repairs(appointment_id);
CREATE INDEX IF NOT EXISTS idx_repair_status_history_repair_id ON repair_status_history(repair_id);
CREATE INDEX IF NOT EXISTS idx_repair_status_history_created_at ON repair_status_history(created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_repair_id ON quotes(repair_id);
CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes(quote_number);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_content_posts_slug ON content_posts(slug);
CREATE INDEX IF NOT EXISTS idx_content_posts_status ON content_posts(status);
CREATE INDEX IF NOT EXISTS idx_content_posts_published_at ON content_posts(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_content_posts_featured ON content_posts(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_repair_posts_repair_id ON repair_posts(repair_id);
CREATE INDEX IF NOT EXISTS idx_repair_posts_published ON repair_posts(published) WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_media_entity ON media(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_media_is_private ON media(is_private) WHERE is_private = TRUE;
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read) WHERE read = FALSE;
CREATE INDEX IF NOT EXISTS idx_availability_day_of_week ON availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_availability_exceptions_dates ON availability_exceptions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ─── FUNCIONES AUXILIARES DE AUTORIZACIÓN ────────────────────────────────
-- Estas funciones determinan si un usuario autenticado es admin o technician
-- consultando profiles.role. Son SECURITY DEFINER con search_path explícito.

-- ── is_admin_or_technician() ──────────────────────────────────────────────
-- Retorna TRUE si el usuario autenticado tiene role 'admin' o 'technician'.
-- Usada por las policies para autorizar operaciones administrativas.

CREATE OR REPLACE FUNCTION is_admin_or_technician()
RETURNS BOOLEAN AS $$
DECLARE
  v_role profile_role;
BEGIN
  -- search_path explícito para evitar inyección de schema
  SET LOCAL search_path = public;

  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN v_role IN ('admin'::profile_role, 'technician'::profile_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ─── Función para actualizar updated_at automáticamente ────────────────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Tabla de secuencias para números anuales ──────────────────────────────
-- Usada por los generators para evitar race conditions.
-- Cada fila representa el contador actual para un año + prefijo específico.
-- El lock a nivel de fila (SELECT FOR UPDATE) evita race conditions sin
-- bloquear innecesariamente otras combinaciones año/prefijo.

CREATE TABLE IF NOT EXISTS number_sequences (
  year INTEGER NOT NULL,
  prefix TEXT NOT NULL,
  seq BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (year, prefix)
);

-- ─── Generador atómico para números de turno: TUR-AAAA-NNNNNN ──────────────
-- Usa SELECT FOR UPDATE sobre la fila específica para bloqueo granular:
-- solo se bloquea la fila (año, prefijo) correspondiente, no toda la tabla.
-- Esto permite que generadores de distintos años/prefijos operen en paralelo.

CREATE OR REPLACE FUNCTION generate_appointment_number()
RETURNS TEXT AS $$
DECLARE
  v_year INTEGER;
  v_seq BIGINT;
  v_prefix TEXT := 'TUR';
BEGIN
  v_year := EXTRACT(YEAR FROM NOW())::INTEGER;

  -- Asegurar que existe la fila para este año/prefijo
  INSERT INTO number_sequences (year, prefix, seq)
  VALUES (v_year, v_prefix, 0)
  ON CONFLICT (year, prefix) DO NOTHING;

  -- Bloquear la fila específica (año, prefijo) para update atómico.
  -- SELECT FOR UPDATE bloquea solo esta fila, no toda la tabla.
  -- Otras combinaciones año/prefijo pueden operar en paralelo.
  UPDATE number_sequences
  SET seq = seq + 1
  WHERE year = v_year AND prefix = v_prefix
  RETURNING seq INTO v_seq;

  IF v_seq IS NULL THEN
    -- La fila no existía o el UPDATE no afectó filas.
    -- Lee el valor actual con FOR UPDATE para asegurar consistencia.
    SELECT seq + 1 INTO v_seq
    FROM number_sequences
    WHERE year = v_year AND prefix = v_prefix
    FOR UPDATE;

    IF v_seq IS NULL THEN
      -- Imposible si el INSERT ON CONFLICT funcionó, pero por seguridad:
      v_seq := 1;
      INSERT INTO number_sequences (year, prefix, seq)
      VALUES (v_year, v_prefix, v_seq);
    ELSE
      UPDATE number_sequences
      SET seq = v_seq
      WHERE year = v_year AND prefix = v_prefix;
    END IF;
  END IF;

  RETURN v_prefix || '-' || v_year || '-' || LPAD(v_seq::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- ─── Generador atómico para números de reparación: REP-AAAA-NNNNNN ─────────
CREATE OR REPLACE FUNCTION generate_repair_number()
RETURNS TEXT AS $$
DECLARE
  v_year INTEGER;
  v_seq BIGINT;
  v_prefix TEXT := 'REP';
BEGIN
  v_year := EXTRACT(YEAR FROM NOW())::INTEGER;

  INSERT INTO number_sequences (year, prefix, seq)
  VALUES (v_year, v_prefix, 0)
  ON CONFLICT (year, prefix) DO NOTHING;

  UPDATE number_sequences
  SET seq = seq + 1
  WHERE year = v_year AND prefix = v_prefix
  RETURNING seq INTO v_seq;

  IF v_seq IS NULL THEN
    SELECT seq + 1 INTO v_seq
    FROM number_sequences
    WHERE year = v_year AND prefix = v_prefix
    FOR UPDATE;

    IF v_seq IS NULL THEN
      v_seq := 1;
      INSERT INTO number_sequences (year, prefix, seq)
      VALUES (v_year, v_prefix, v_seq);
    ELSE
      UPDATE number_sequences
      SET seq = v_seq
      WHERE year = v_year AND prefix = v_prefix;
    END IF;
  END IF;

  RETURN v_prefix || '-' || v_year || '-' || LPAD(v_seq::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- ─── Generador atómico para números de cliente: CUS-AAAA-NNNNNN ────────────
CREATE OR REPLACE FUNCTION generate_customer_number()
RETURNS TEXT AS $$
DECLARE
  v_year INTEGER;
  v_seq BIGINT;
  v_prefix TEXT := 'CUS';
BEGIN
  v_year := EXTRACT(YEAR FROM NOW())::INTEGER;

  INSERT INTO number_sequences (year, prefix, seq)
  VALUES (v_year, v_prefix, 0)
  ON CONFLICT (year, prefix) DO NOTHING;

  UPDATE number_sequences
  SET seq = seq + 1
  WHERE year = v_year AND prefix = v_prefix
  RETURNING seq INTO v_seq;

  IF v_seq IS NULL THEN
    SELECT seq + 1 INTO v_seq
    FROM number_sequences
    WHERE year = v_year AND prefix = v_prefix
    FOR UPDATE;

    IF v_seq IS NULL THEN
      v_seq := 1;
      INSERT INTO number_sequences (year, prefix, seq)
      VALUES (v_year, v_prefix, v_seq);
    ELSE
      UPDATE number_sequences
      SET seq = v_seq
      WHERE year = v_year AND prefix = v_prefix;
    END IF;
  END IF;

  RETURN v_prefix || '-' || v_year || '-' || LPAD(v_seq::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- ─── Generador atómico para números de presupuesto: PRE-AAAA-NNNNNN ────────
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  v_year INTEGER;
  v_seq BIGINT;
  v_prefix TEXT := 'PRE';
BEGIN
  v_year := EXTRACT(YEAR FROM NOW())::INTEGER;

  INSERT INTO number_sequences (year, prefix, seq)
  VALUES (v_year, v_prefix, 0)
  ON CONFLICT (year, prefix) DO NOTHING;

  UPDATE number_sequences
  SET seq = seq + 1
  WHERE year = v_year AND prefix = v_prefix
  RETURNING seq INTO v_seq;

  IF v_seq IS NULL THEN
    SELECT seq + 1 INTO v_seq
    FROM number_sequences
    WHERE year = v_year AND prefix = v_prefix
    FOR UPDATE;

    IF v_seq IS NULL THEN
      v_seq := 1;
      INSERT INTO number_sequences (year, prefix, seq)
      VALUES (v_year, v_prefix, v_seq);
    ELSE
      UPDATE number_sequences
      SET seq = v_seq
      WHERE year = v_year AND prefix = v_prefix;
    END IF;
  END IF;

  RETURN v_prefix || '-' || v_year || '-' || LPAD(v_seq::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- ─── TRIGGERS ────────────────────────────────────────────────────────────

-- Triggers para updated_at en todas las tablas que lo tienen.
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_repairs_updated_at
  BEFORE UPDATE ON repairs
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_content_posts_updated_at
  BEFORE UPDATE ON content_posts
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_repair_posts_updated_at
  BEFORE UPDATE ON repair_posts
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ─── PROFILES: función de inserción automática desde auth ────────────────
-- TODOS los usuarios nuevos reciben role = 'customer' por defecto.
-- La metadata de role se IGNORA para evitar escalada de privilegios.
-- La promoción a admin/technician debe hacerse manualmente por un admin.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
BEGIN
  -- search_path explícito para evitar inyección de schema
  SET LOCAL search_path = public;

  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NULL);

  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    'customer'::profile_role,  -- Siempre customer, nunca tomar del metadata
    'active'::profile_status
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para llamar a handle_new_user después de INSERT en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── RLS: Row Level Security ──────────────────────────────────────────────
-- Se habilita RLS en todas las tablas que pueden ser accedidas por el cliente.
-- Las políticas usan los roles reales de Supabase (authenticated/anon) y
-- determinan autorización mediante auth.uid() y la función
-- is_admin_or_technician() (que consulta profiles.role de forma segura).

-- ── PROFILES ──────────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Un usuario autenticado puede leer su propio profile.
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Cualquier usuario autenticado puede insertar su propio profile.
-- Esto es necesario para que el trigger handle_new_user pueda insertar
-- (el trigger corre con los privilegios del user que lo invocó, no con
-- los del servicio_role). Pero en la práctica el trigger es el que inserta.
-- Abrimos INSERT para authenticated como respaldo, pero el WITH CHECK
-- asegura que solo se pueda insertar el propio usuario.
CREATE POLICY profiles_insert_own ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Solo admin/technician puede actualizar o eliminar profiles.
CREATE POLICY profiles_update_by_admin ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY profiles_delete_by_admin ON profiles
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── CUSTOMERS ─────────────────────────────────────────────────────────────
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Ownership: auth.uid() = profiles.id = customers.profile_id.
-- NOT auth.uid() = customers.id (customers.id es un UUID independiente).

-- Customer puede SELECT y UPDATE solamente su propio customer.
CREATE POLICY customers_select_own ON customers
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY customers_update_own ON customers
  FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Admin/technician pueden leer y administrar todos los customers.
CREATE POLICY customers_select_by_mgr ON customers
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY customers_insert_by_mgr ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY customers_delete_by_mgr ON customers
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── DEVICES ────────────────────────────────────────────────────────────────
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- El dispositivo pertenece a un customer, y ese customer se relaciona
-- con profiles.profile_id. ownership: devices.customer_id → customers.profile_id = auth.uid().
CREATE POLICY devices_select_own ON devices
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = devices.customer_id
        AND customers.profile_id = auth.uid()
    )
  );

CREATE POLICY devices_insert_own ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = devices.customer_id
        AND customers.profile_id = auth.uid()
    )
  );

CREATE POLICY devices_update_own ON devices
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = devices.customer_id
        AND customers.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = devices.customer_id
        AND customers.profile_id = auth.uid()
    )
  );

CREATE POLICY devices_delete_own ON devices
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = devices.customer_id
        AND customers.profile_id = auth.uid()
    )
  );

-- Admin/technician pueden administrar todos los dispositivos.
CREATE POLICY devices_select_by_mgr ON devices
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY devices_insert_by_mgr ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY devices_update_by_mgr ON devices
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY devices_delete_by_mgr ON devices
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── SERVICES ───────────────────────────────────────────────────────────────
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Catálogo público: SELECT permitido para todos (anon + authenticated).
CREATE POLICY services_select_public ON services
  FOR SELECT
  USING (true);

-- Escritura únicamente admin/technician.
CREATE POLICY services_insert_by_mgr ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY services_update_by_mgr ON services
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY services_delete_by_mgr ON services
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── AVAILABILITY ────────────────────────────────────────────────────────────
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- SELECT público para cálculo de disponibilidad (anon + authenticated).
CREATE POLICY availability_select_public ON availability
  FOR SELECT
  USING (true);

-- Escritura únicamente admin/technician.
CREATE POLICY availability_insert_by_mgr ON availability
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY availability_update_by_mgr ON availability
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY availability_delete_by_mgr ON availability
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── AVAILABILITY_EXCEPTIONS ─────────────────────────────────────────────────
ALTER TABLE availability_exceptions ENABLE ROW LEVEL SECURITY;

-- SELECT público para cálculo de disponibilidad.
CREATE POLICY availability_exceptions_select_public ON availability_exceptions
  FOR SELECT
  USING (true);

-- Escritura únicamente admin/technician.
CREATE POLICY availability_exceptions_insert_by_mgr ON availability_exceptions
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY availability_exceptions_update_by_mgr ON availability_exceptions
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY availability_exceptions_delete_by_mgr ON availability_exceptions
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── APPOINTMENTS ────────────────────────────────────────────────────────────
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Permite INSERT controlado para solicitar un turno.
-- Cualquier usuario autenticado puede crear una solicitud con status='requested'.
CREATE POLICY appointments_insert_public ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    status = 'requested'::appointment_status
    AND (
      customer_id IS NULL OR
      EXISTS (
        SELECT 1 FROM customers
        WHERE customers.id = appointments.customer_id
          AND customers.profile_id = auth.uid()
      )
    )
  );

-- Customer puede consultar solamente sus propios appointments.
-- El appointments.customer_id se relaciona con customers.id, y customers.profile_id
-- se relaciona con auth.uid(). ownership: appointments.customer_id → customers.profile_id = auth.uid().
CREATE POLICY appointments_select_own ON appointments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = appointments.customer_id
        AND customers.profile_id = auth.uid()
    )
  );

-- Admin/technician pueden consultar y administrar todos los appointments.
CREATE POLICY appointments_select_by_mgr ON appointments
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY appointments_update_by_mgr ON appointments
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY appointments_delete_by_mgr ON appointments
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── REPAIRS ────────────────────────────────────────────────────────────────
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;

-- Customer puede SELECT solamente sus propias reparaciones.
-- repairs.customer_id → customers.profile_id = auth.uid().
CREATE POLICY repairs_select_own ON repairs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = repairs.customer_id
        AND customers.profile_id = auth.uid()
    )
  );

-- Customer NO puede INSERT/UPDATE/DELETE en repairs.
-- Admin/technician pueden administrar todas las reparaciones.
CREATE POLICY repairs_select_by_mgr ON repairs
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY repairs_insert_by_mgr ON repairs
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY repairs_update_by_mgr ON repairs
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY repairs_delete_by_mgr ON repairs
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── REPAIR_STATUS_HISTORY ────────────────────────────────────────────────────
ALTER TABLE repair_status_history ENABLE ROW LEVEL SECURITY;

-- Customer puede ver el historial de sus propias reparaciones
-- (via repair_id → repairs.customer_id → customers.profile_id = auth.uid()).
CREATE POLICY repair_status_history_select_own ON repair_status_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM repairs
      JOIN customers ON customers.id = repairs.customer_id
      WHERE repairs.id = repair_status_history.repair_id
        AND customers.profile_id = auth.uid()
    )
  );

-- Admin/technician pueden administrar.
CREATE POLICY repair_status_history_select_by_mgr ON repair_status_history
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY repair_status_history_insert_by_mgr ON repair_status_history
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY repair_status_history_update_by_mgr ON repair_status_history
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY repair_status_history_delete_by_mgr ON repair_status_history
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── QUOTES ───────────────────────────────────────────────────────────────────
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Customer puede ver presupuestos de sus propias reparaciones.
-- quotes.repair_id → repairs.customer_id → customers.profile_id = auth.uid().
CREATE POLICY quotes_select_own ON quotes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM repairs
      JOIN customers ON customers.id = repairs.customer_id
      WHERE repairs.id = quotes.repair_id
        AND customers.profile_id = auth.uid()
    )
  );

-- Admin/technician pueden administrar.
CREATE POLICY quotes_select_by_mgr ON quotes
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY quotes_insert_by_mgr ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY quotes_update_by_mgr ON quotes
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY quotes_delete_by_mgr ON quotes
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── QUOTE_ITEMS ──────────────────────────────────────────────────────────────
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- Customer puede ver items de sus propios presupuestos.
-- quote_items.quote_id → quotes.repair_id → repairs.customer_id → customers.profile_id = auth.uid().
CREATE POLICY quote_items_select_own ON quote_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      JOIN repairs ON repairs.id = quotes.repair_id
      JOIN customers ON customers.id = repairs.customer_id
      WHERE quotes.id = quote_items.quote_id
        AND customers.profile_id = auth.uid()
    )
  );

-- Admin/technician pueden administrar.
CREATE POLICY quote_items_select_by_mgr ON quote_items
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY quote_items_insert_by_mgr ON quote_items
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY quote_items_update_by_mgr ON quote_items
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY quote_items_delete_by_mgr ON quote_items
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── CONTENT_POSTS ────────────────────────────────────────────────────────────
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;

-- SELECT público SOLAMENTE para contenido publicado.
CREATE POLICY content_posts_select_public ON content_posts
  FOR SELECT
  USING (status = 'publicado'::content_status);

-- Admin/technician puede administrar todo el contenido (incluyendo borradores).
CREATE POLICY content_posts_select_by_mgr ON content_posts
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY content_posts_insert_by_mgr ON content_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY content_posts_update_by_mgr ON content_posts
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY content_posts_delete_by_mgr ON content_posts
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── REPAIR_POSTS ──────────────────────────────────────────────────────────────
ALTER TABLE repair_posts ENABLE ROW LEVEL SECURITY;

-- SELECT público SOLAMENTE cuando published = true.
CREATE POLICY repair_posts_select_public ON repair_posts
  FOR SELECT
  USING (published = true);

-- Admin/technician puede administrar.
CREATE POLICY repair_posts_select_by_mgr ON repair_posts
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY repair_posts_insert_by_mgr ON repair_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY repair_posts_update_by_mgr ON repair_posts
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY repair_posts_delete_by_mgr ON repair_posts
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── PROJECTS ──────────────────────────────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- SELECT público para proyectos activos/completos.
CREATE POLICY projects_select_public ON projects
  FOR SELECT
  USING (status IN ('activo'::project_status, 'completado'::project_status));

-- Admin/technician puede administrar.
CREATE POLICY projects_select_by_mgr ON projects
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY projects_insert_by_mgr ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY projects_update_by_mgr ON projects
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY projects_delete_by_mgr ON projects
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── MEDIA ─────────────────────────────────────────────────────────────────────
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Media pública (is_private = false) puede consultarse públicamente.
CREATE POLICY media_select_public ON media
  FOR SELECT
  USING (is_private = false);

-- Admin/technician puede consultar todo.
CREATE POLICY media_select_by_mgr ON media
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY media_insert_by_mgr ON media
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY media_update_by_mgr ON media
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY media_delete_by_mgr ON media
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Usuario puede ver y actualizar solamente sus propias notifications.
-- notifications.user_id = profiles.id = auth.uid() (relación directa).
CREATE POLICY notifications_select_own ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY notifications_update_own ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin/technician puede administrar.
CREATE POLICY notifications_select_by_mgr ON notifications
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY notifications_insert_by_mgr ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY notifications_update_by_mgr ON notifications
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY notifications_delete_by_mgr ON notifications
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── SETTINGS ──────────────────────────────────────────────────────────────────
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- SELECT público para configuración no sensible.
-- No exponer settings que contengan secrets (whatsapp_number, phone_number, email, google_business).
CREATE POLICY settings_select_public ON settings
  FOR SELECT
  USING (key NOT IN ('whatsapp_number', 'phone_number', 'email', 'google_business'));

-- Admin/technician puede administrar.
CREATE POLICY settings_select_by_mgr ON settings
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

CREATE POLICY settings_insert_by_mgr ON settings
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

CREATE POLICY settings_update_by_mgr ON settings
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

CREATE POLICY settings_delete_by_mgr ON settings
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ── AUDIT_LOGS ────────────────────────────────────────────────────────────────
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- SOLAMENTE admin/technician puede consultar audit logs.
CREATE POLICY audit_logs_select_by_mgr ON audit_logs
  FOR SELECT
  TO authenticated
  USING (is_admin_or_technician());

-- Inserción controlada desde server-side/admin/technician.
CREATE POLICY audit_logs_insert_by_mgr ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_technician());

-- Actualización restringida a admin/technician.
CREATE POLICY audit_logs_update_by_mgr ON audit_logs
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_technician())
  WITH CHECK (is_admin_or_technician());

-- Admin/technician puede eliminar.
CREATE POLICY audit_logs_delete_by_mgr ON audit_logs
  FOR DELETE
  TO authenticated
  USING (is_admin_or_technician());

-- ─── INSERT DEFAULT SETTINGS ─────────────────────────────────────────────────
-- Configuración inicial del negocio (editable desde el panel después).
INSERT INTO settings (key, value) VALUES
  ('business_name', '"Andrés Servicio Técnico"'),
  ('business_tagline', '"Diagnóstico preciso. Reparaciones con criterio."'),
  ('business_city', '"La Plata"'),
  ('business_province', '"Buenos Aires"'),
  ('whatsapp_number', '"[WHATSAPP_PENDIENTE]"'),
  ('phone_number', '"[TELEFONO_PENDIENTE]"'),
  ('email', '"[EMAIL_PENDIENTE]"'),
  ('instagram', '"@andres_serviciotecnico_lp"'),
  ('facebook', 'null'),
  ('google_business', 'null'),
  ('default_slot_minutes', '30'),
  ('default_buffer_minutes', '15'),
  ('min_booking_advance_hours', '2'),
  ('max_booking_days_ahead', '30'),
  ('appointment_duration_defaults', '{"diagnostico": 30, "cambio_bateria": 60, "reparacion_electronica": 120}'),
  ('weekdays_default', '{"lunes": {"start": "09:00", "end": "13:00"}, "martes": {"start": "09:00", "end": "13:00"}, "miercoles": {"start": "09:00", "end": "13:00"}, "jueves": {"start": "09:00", "end": "13:00"}, "viernes": {"start": "09:00", "end": "13:00"}}')
ON CONFLICT (key) DO NOTHING;

COMMIT;