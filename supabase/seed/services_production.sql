-- Services seed for Andrés Servicio Técnico
-- Ejecutar en el SQL Editor del dashboard de Supabase ( producción )
-- Los datos son reales para este negocio.

BEGIN;

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
    'Reparación de conectores USB, Lightning, USB-C y de baterías que presentan falla de contacto o daño físico. Soldadura y verificación de continuidad.',
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
    'Reparación de fuentes de alimentación de todos los tipos: PC, CCTV, telecomunicaciones, industriales. Pruebas de salida, componentes, protección.',
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

UPDATE services
SET status = 'inactive',
    featured = FALSE
WHERE status = 'active';

INSERT INTO services (
  name, slug, short_description, full_description, category, image_url, price,
  price_visible, estimated_duration, status, featured, sort_order, seo_title, seo_description
)
VALUES
  (
    'Celulares',
    'celulares',
    'Diagnósticos de fallas de hardware; cambio de módulo, pantalla, Glass y pin de carga; limpieza y mantenimiento de software y hardware.',
    E'Diagnósticos de fallas de hardware\nCambio de módulo, pantalla, Glass y pin de carga\nLimpieza y mantenimiento de software y hardware',
    'celulares',
    NULL,
    NULL,
    FALSE,
    NULL,
    'active',
    FALSE,
    1,
    'Servicios para celulares | Andrés Servicio Técnico',
    'Diagnósticos de fallas de hardware, cambio de módulo, pantalla, Glass y pin de carga, y limpieza y mantenimiento de software y hardware.'
  ),
  (
    'Computadoras',
    'computadoras',
    'Backup y recuperación de archivos, diagnóstico y reparación de errores de disco, mantenimiento y ensamblaje de computadoras.',
    E'Backup de archivos\nRecuperación de archivos de HDD y SSD\nDiagnóstico y reparación de errores de disco\nCambio de grasa térmica de microprocesador\nEnsamblaje de repuestos nuevos o de recambio\nFormateos con instalación de sistema operativo de preferencia y herramientas de ofimática como Office y otros\nLimpieza y mantenimiento de software y hardware',
    'pc',
    NULL,
    NULL,
    FALSE,
    NULL,
    'active',
    FALSE,
    2,
    'Servicios para computadoras | Andrés Servicio Técnico',
    'Backup y recuperación de archivos HDD y SSD, errores de disco, cambio de grasa térmica, ensamblaje, formateos y mantenimiento de software y hardware.'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  price = EXCLUDED.price,
  price_visible = EXCLUDED.price_visible,
  estimated_duration = EXCLUDED.estimated_duration,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  sort_order = EXCLUDED.sort_order,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW();

COMMIT;

-- Verificar: SELECT count(*) FROM services;
