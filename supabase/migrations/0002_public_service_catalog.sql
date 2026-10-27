BEGIN;

UPDATE services
SET status = 'inactive',
    featured = FALSE
WHERE status = 'active';

INSERT INTO services (
  name,
  slug,
  short_description,
  full_description,
  category,
  image_url,
  price,
  price_visible,
  estimated_duration,
  status,
  featured,
  sort_order,
  seo_title,
  seo_description
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
