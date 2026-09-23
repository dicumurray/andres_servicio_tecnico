-- ─── Seed de desarrollo ─────────────────────────────────────────────────
-- WARNING: Solo para desarrollo. Nunca ejecutar en producción.
-- Todos los datos son ficticios.

BEGIN;

-- ─── SERVICES (servicios) ────────────────────────────────────────────────

INSERT INTO services (name, slug, short_description, full_description, category, image_url, price, price_visible, estimated_duration, status, featured, sort_order, seo_title, seo_description)
VALUES
  (
    'Reparación de celulares',
    'reparacion-celulares',
    'Diagnóstico y reparación de celulares y smartphones.',
    'Reparamos celulares de todas las marcas: pantalla, batería, conector de carga, módulos, software y fallas de hardware. Diagnóstico previo para identificar la causa real del problema.',
    'celulares',
    NULL,
    NULL,
    TRUE,
    60,
    'active',
    TRUE,
    1,
    'Reparación de celulares en La Plata | Andrés Servicio Técnico',
    'Servicio de reparación de celulares y smartphones en La Plata. Pantallas, baterías, conectores y más. Diagnóstico preciso.'
  ),
  (
    'Diagnóstico electrónico',
    'diagnostico-electronico',
    'Diagnóstico profundo de fallas electrónicas.',
    'Análisis detallado de equipos electrónicos: mediciones, pruebas con osciloscopio y analizador, identificación de componentes dañados y propuesta de solución.',
    'electronica',
    NULL,
    NULL,
    TRUE,
    30,
    'active',
    TRUE,
    2,
    'Diagnóstico electrónico en La Plata | Andrés Servicio Técnico',
    'Diagnóstico profesional de fallas electrónicas en La Plata. Mediciones, análisis y solución técnica.'
  ),
  (
    'Cambio de batería',
    'cambio-bateria',
    'Reemplazo de baterías de celulares y notebooks.',
    'Reemplazo de baterías degradadas o sin capacidad. Usamos repuestos de calidad verificada. Antes y después del cambio, medición de capacidad y estado de salud.',
    'baterias',
    NULL,
    NULL,
    TRUE,
    60,
    'active',
    FALSE,
    3,
    'Cambio de batería de celular y notebook | Andrés Servicio Técnico',
    'Cambio de batería para celulares y notebooks en La Plata. Repuestos de calidad, medición incluida.'
  ),
  (
    'Reparación de conector de carga',
    'reparacion-conector-carga',
    'Reparación y reemplazo de conectores de carga dañados.',
    'Reparación de conectores USB, 라이트닝, USB-C y de baterías que presentan falla de contacto o daño físico. Soldadura y verificación de continuidad.',
    'conectores',
    NULL,
    NULL,
    TRUE,
    45,
    'active',
    FALSE,
    4,
    'Reparación de conector de carga en La Plata',
    'Reparación profesional de conectores de carga dañados. USB, USB-C, Lightning. Soldadura y verificación.'
  ),
  (
    'Reparación de placas electrónicas',
    'reparacion-placas',
    'Reparación de placas de circuito impreso.',
    'Reparación de placas: rastreo de fallas, reemplazo de componentes SMT y through-hole, reparación de trazados, modificación de circuitos. Equipamiento de laboratorio.',
    'placas',
    NULL,
    NULL,
    TRUE,
    120,
    'active',
    FALSE,
    5,
    'Reparación de placas electrónicas en La Plata',
    'Reparación profesional de placas de circuito impreso. Componentes SMT y through-hole, trazados, modificación de circuitos.'
  ),
  (
    'Reparación de fuentes de alimentación',
    'reparacion-fuentes',
    'Diagnóstico y reparación de fuentes de alimentación.',
    'Reparación de fuentes de alimentación de todos los tipos: PC, CCTV, telecomunicaciones, industriales. Pruebas de salida, components, protección.',
    'fuentes',
    NULL,
    NULL,
    TRUE,
    90,
    'active',
    FALSE,
    6,
    'Reparación de fuentes de alimentación en La Plata',
    'Reparación de fuentes de alimentación de PC, CCTV, telecomunicaciones e industriales. Diagnóstico y reparación profesional.'
  ),
  (
    'Reparación de UPS',
    'reparacion-ups',
    'Mantenimiento y reparación de UPS.',
    'Diagnóstico, mantenimiento y reparación de UPS (Uninterruptible Power Supply): baterías, inversor, fuente, control. Reconfiguración y verificación de funcionamiento.',
    'ups',
    NULL,
    NULL,
    TRUE,
    90,
    'active',
    FALSE,
    7,
    'Reparación y mantenimiento de UPS en La Plata',
    'Mantenimiento y reparación de UPS: baterías, inversor, fuente de potencia, control. Verificación completa de funcionamiento.'
  ),
  (
    'Reparación de PC y desktops',
    'reparacion-pc',
    'Mantenimiento, diagnóstico y reparación de computadoras de escritorio.',
    'Diagnóstico y reparación de PC: fuentes, motherboards, procesadores, memoria, almacenamiento, refrigeración. Limpieza, reconfiguración y optimización.',
    'pc',
    NULL,
    NULL,
    TRUE,
    60,
    'active',
    FALSE,
    8,
    'Reparación de PC y desktops en La Plata',
    'Mantenimiento y reparación de computadoras de escritorio: fuentes, motherboards, procesadores, memoria, almacenamiento.'
  ),
  (
    'Reparación de notebooks',
    'reparacion-notebooks',
    'Servicio técnico de notebooks y laptops.',
    'Reparación de notebooks: pantalla, teclado, batería, fuente, motherboard, disipación. Diagnóstico completo y reparación con criterio técnico.',
    'notebooks',
    NULL,
    NULL,
    TRUE,
    90,
    'active',
    FALSE,
    9,
    'Reparación de notebooks y laptops en La Plata',
    'Servicio técnico de notebooks: pantalla, teclado, batería, fuente, motherboard. Diagnóstico completo y reparación profesional.'
  ),
  (
    'Reparación de impresoras',
    'reparacion-impresoras',
    'Diagnóstico y reparación de impresoras.',
    'Reparación de impresoras láser y de inyección: fallas mecánicas, electrónicas, de firmware. Limpieza de sistemas, reemplazo de componentes, calibración.',
    'impresoras',
    NULL,
    NULL,
    TRUE,
    60,
    'active',
    FALSE,
    10,
    'Reparación de impresoras en La Plata',
    'Diagnóstico y reparación de impresoras láser e inyección: fallas mecánicas, electrónicas, firmware. Limpieza y calibración.'
  ),
  (
    'Mantenimiento preventivo',
    'mantenimiento-preventivo',
    'Revisión general de equipos y sistemas.',
    'Revisión integral de equipos electrónicos: limpieza, verificación de niveles, chequeo de componentes críticos, monitoreo. Ideal para evitar fallas futuras.',
    'mantenimiento',
    NULL,
    NULL,
    FALSE,
    45,
    'coming_soon',
    FALSE,
    11,
    'Mantenimiento preventivo de equipos electrónicos en La Plata',
    'Revisión integral preventiva de equipos electrónicos: limpieza, verificación, chequeo de componentes críticos.'
  )
ON CONFLICT (slug) DO NOTHING;

-- ─── AVAILABILITY (horarios por defecto de ejemplo) ──────────────────────

-- Lunes a viernes: 9 a 13 y 15 a 19
INSERT INTO availability (day_of_week, start_time, end_time, is_default)
VALUES
  (1, '09:00', '13:00', TRUE),   -- Lunes mañana
  (1, '15:00', '19:00', TRUE),   -- Lunes tarde
  (2, '09:00', '13:00', TRUE),   -- Martes mañana
  (2, '15:00', '19:00', TRUE),   -- Martes tarde
  (3, '09:00', '13:00', TRUE),   -- Miércoles mañana
  (3, '15:00', '19:00', TRUE),   -- Miércoles tarde
  (4, '09:00', '13:00', TRUE),   -- Jueves mañana
  (4, '15:00', '19:00', TRUE),   -- Jueves tarde
  (5, '09:00', '13:00', TRUE),   -- Viernes mañana
  (5, '15:00', '19:00', TRUE)    -- Viernes tarde
ON CONFLICT DO NOTHING;

-- ─── CUSTOMERS (clientes de ejemplo) ──────────────────────────────────────

INSERT INTO customers (customer_number, name, surname, phone, email, notes, status, communications_consent)
VALUES
  ('CUS-2026-000001', 'Juan', 'Pérez', '+542211234567', 'juan.perez@email.com', 'Cliente recurrente. Telefonía celular.', 'active', TRUE),
  ('CUS-2026-000002', 'María', 'González', '+542219876543', 'maria.gonzalez@email.com', 'Primera visita. Notebook Lenovo.', 'active', TRUE),
  ('CUS-2026-000003', 'Carlos', 'Rodríguez', '+542215555123', 'carlos.r@email.com', 'Trajo fuente de PC para reparación.', 'active', FALSE)
ON CONFLICT (customer_number) DO NOTHING;

-- ─── DEVICES (equipos de ejemplo) ─────────────────────────────────────────

INSERT INTO devices (customer_id, type, brand, model, serial_number, imei, description, notes)
SELECT
  c.id,
  'celular',
  'Samsung',
  'Galaxy A54',
  NULL,
  '357120123456789',
  'Celular Samsung Galaxy A54 — no carga.',
  'Cliente trajo el celular sin encender. Se diagnosticará.'
FROM customers c WHERE c.customer_number = 'CUS-2026-000001'
ON CONFLICT DO NOTHING;

-- ─── APPOINTMENTS (turnos de ejemplo) ─────────────────────────────────────

INSERT INTO appointments (appointment_number, scheduled_at, duration_minutes, status, customer_id, service_id, customer_name, customer_surname, customer_phone, customer_email, device_brand, device_model, failure_description, notes)
SELECT
  'TUR-2026-000001',
  NOW() + INTERVAL '1 day' + INTERVAL '2 hours',
  60,
  'requested',
  c.id,
  s.id,
  c.name,
  c.surname,
  c.phone,
  c.email,
  'Samsung',
  'Galaxy A54',
  'No carga, pantalla congelada.',
  'Esperando confirmación del horario.'
FROM customers c
CROSS JOIN services s
WHERE c.customer_number = 'CUS-2026-000001'
  AND s.slug = 'reparacion-celulares'
ON CONFLICT (appointment_number) DO NOTHING;

-- ─── REPAIRS (reparaciones de ejemplo) ────────────────────────────────────

-- Crear una reparación de ejemplo para el cliente 1
INSERT INTO repairs (repair_number, customer_id, device_id, appointment_id, declared_failure, diagnosis, cause, work_done, components_used, budget, final_price, warranty, status, internal_notes, publish_authorized, hide_sensitive_data)
SELECT
  'REP-2026-000001',
  c.id,
  d.id,
  NULL,
  'El celular no enciende ni carga.',
  'La causa fue un conector de carga dañado por golpe. El conector no hacía buen contacto.',
  'Golpe directo sobre el conector.',
  'Reemplazo del conector de carga USB-C. Limpieza de la zona, soldadura, verificación de continuidad.',
  'Conector USB-C, pasta térmica.',
  15000,
  15000,
  '30 días',
  'entregado',
  'Reparación completada. Cliente satisfecho.',
  TRUE,
  FALSE
FROM customers c
LEFT JOIN devices d ON d.customer_id = c.id AND d.model = 'Galaxy A54'
WHERE c.customer_number = 'CUS-2026-000001'
ON CONFLICT (repair_number) DO NOTHING;

-- ─── REPAIR STATUS HISTORY (historial del estado de la reparación de ejemplo) ──

INSERT INTO repair_status_history (repair_id, status, note)
SELECT
  r.id,
  status_val,
  note_val
FROM repairs r
CROSS JOIN (
  VALUES
    ('recibido', 'Equipo recibido. Check inicial.'),
    ('en_diagnostico', 'Iniciado diagnóstico con multímetro y osciloscopio.'),
    ('presupuesto_pendiente', 'Diagnóstico completado. Preparando presupuesto.'),
    ('presupuesto_enviado', 'Presupuesto enviado al cliente.'),
    ('esperando_autorizacion', 'Esperando autorización del cliente.'),
    ('autorizado', 'Cliente autorizó el trabajo.'),
    ('en_reparacion', 'Iniciada la reparación: desoldado del conector dañado.'),
    ('reparacion_finalizada', 'Conector reemplazado y verificado.'),
    ('en_pruebas', 'Pruebas de carga y encendido.'),
    ('listo_para_retirar', 'Lista para entrega.'),
    ('entregado', 'Entregado al cliente. Recibe garantía de 30 días.')
) AS h(status_val, note_val)
WHERE r.repair_number = 'REP-2026-000001'
ORDER BY h.status_val
ON CONFLICT DO NOTHING;

-- ─── CONTENT POSTS (artículos de ejemplo) ───────────────────────────────

INSERT INTO content_posts (title, slug, summary, content, cover_image_url, author_id, published_at, category, tags, status, seo_title, seo_description, featured)
VALUES
  (
    'Cómo identificar si tu celular necesita cambio de batería',
    'como-identificar-cambio-bateria',
    'Signos claros de que la batería de tu celular está degradada y cuándo es momento de reemplazarla.',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Si tu celular se apaga repentinamente a pesar de mostrar batería, si la batería se calienta sin razón, o si la duración ya no dura todo el día, esos son señales de que la batería está degradada."}]}]}',
    NULL,
    NULL,
    NOW() - INTERVAL '5 days',
    'Consejos',
    ARRAY['baterias', 'celulares', 'consejos'],
    'publicado',
    'Cómo identificar si tu celular necesita cambio de batería',
    'Señales de que la batería de tu celular está degradada y cuándo es momento de reemplazarla. Diagnóstico en La Plata.',
    TRUE
  ),
  (
    'Conector de carga dañado: no es siempre la batería',
    'conector-carga-dañado-bateria',
    'Muchos creen que si el celular no carga es la batería. A veces el problema es el conector.',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Una de las fallas más comunes que veo en el taller es el conector de carga dañado. El celular no carga, la batería está bien, pero el contacto no se hace."}]}]}',
    NULL,
    NULL,
    NOW() - INTERVAL '3 days',
    'Reparaciones',
    ARRAY['conectores', 'celulares', 'reparaciones'],
    'publicado',
    'Conector de carga dañado: no es siempre la batería',
    'Muchos creen que si el celular no carga es la batería. A veces el problema es el conector de carga. Reparación profesional.',
    FALSE
  )
ON CONFLICT (slug) DO NOTHING;

-- ─── PROJECTS (proyectos de ejemplo) ─────────────────────────────────────

INSERT INTO projects (name, description, technologies, images, videos, status, content)
VALUES
  (
    'Andi Lab — Estación de Prototipado para Pedales',
    'Estación de prototipado para pedales de guitarra con control de efectos, filtros y amplificación.',
    ARRAY['Arduino', 'ESP8266', 'amplificacion', 'PWM', 'KiCad'],
    ARRAY[],
    ARRAY[],
    'completado',
    'Proyecto de prototipado para pedales de guitarra. Incluye diseño de PCB, programación de microcontroladores y pruebas de audio.'
  ),
  (
    'BENDER',
    'Proyecto de prototipado y desarrollo de hardware.',
    ARRAY['Arduino', 'sensor fusion', 'Bluetooth'],
    ARRAY[],
    ARRAY[],
    'completado',
    'Desarrollo de proyecto de hardware con microcontroladores, sensores y comunicación inalambrica.'
  )
ON CONFLICT (name) DO NOTHING;

-- ─── REPAIR POSTS (casos publicados de ejemplo) ──────────────────────────

INSERT INTO repair_posts (repair_id, title, problem, diagnosis, solution, result, images, video_url, published)
SELECT
  r.id,
  'Samsung Galaxy A54 — No cargaba y la batería no era el problema',
  'El celular no cargaba. El cliente reportó que la batería no duraba y pensaba que era la batería.',
  'Con motivo de diagnóstico, identificamos que el conector de carga USB-C estaba dañado por golpe. No había contacto adecuado.',
  'Reemplazo del conector de carga USB-C mediante soldadura. Verificación de continuidad y carga completa.',
  'El celular funcionó perfectamente después del reemplazo. El cliente recibió garantía de 30 días.',
  ARRAY['https://placehold.co/600x400/1a1d24/white?text=Celular+antes'],
  NULL,
  TRUE
FROM repairs r
WHERE r.repair_number = 'REP-2026-000001'
ON CONFLICT DO NOTHING;

-- ─── PROFILES (perfil de admin para desarrollo) ──────────────────────────

-- NOTA: Este seed crea un usuario de admin con email y contraseña de desarrollo.
-- Debe ser eliminado o reemplazado antes de producción.
-- Para crear el usuario real, usar las funciones de auth de Supabase.

INSERT INTO profiles (id, email, full_name, phone, role, status)
SELECT
  gen_random_uuid(),
  'desarrollo@andres-servicio-tecnico.local',
  'Andrés Desarrollo',
  '+542210000000',
  'admin',
  'active'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'desarrollo@andres-servicio-tecnico.local')
ON CONFLICT (id) DO NOTHING;

-- ─── MEDIA (imágenes de ejemplo — las URLs son placeholders) ──────────────

INSERT INTO media (entity_type, entity_id, file_url, file_type, title, description, category, alt_text, is_private)
SELECT
  'repair',
  r.id,
  'https://placehold.co/800x600/1a1d24/white?text=Reparacion+ejemplo',
  'image',
  'Reparación de ejemplo',
  'Imagen de la reparación realizada.',
  'celulares',
  'Celular reparado sobre la mesa de trabajo.',
  FALSE
FROM repairs r
WHERE r.repair_number = 'REP-2026-000001'
ON CONFLICT DO NOTHING;

COMMIT;

-- ─── MENSAJE FINAL ───────────────────────────────────────────────────────
-- Seed completado. Los datos son de desarrollo. Revisar y eliminar antes de producción.
