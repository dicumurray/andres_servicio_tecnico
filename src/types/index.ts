/**
 * Tipos derivados para la aplicación.
 * El acceso a enums de Database requiere el modo ["public"]["Enums"] porque
 * Database es una interfaz, no un namespace.
 */

import type { Database } from './database'

type PublicEnums = Database['public']['Enums']

export type ProfileRole = PublicEnums['profile_role']
export type ServiceStatus = PublicEnums['service_status']
export type AppointmentStatus = PublicEnums['appointment_status']
export type DeviceType = PublicEnums['device_type']
export type RepairStatus = PublicEnums['repair_status']
export type QuoteStatus = PublicEnums['quote_status']
export type ContentStatus = PublicEnums['content_status']
export type ContentType = PublicEnums['content_type']
export type MediaCategory = PublicEnums['media_category']

// ─── ESTADO LABELS ──────────────────────────────────────────────────────────

export const REPAIR_STATUS_LABELS: Record<RepairStatus, string> = {
  recibido: 'Recibido',
  en_diagnostico: 'En diagnóstico',
  presupuesto_pendiente: 'Presupuesto pendiente',
  presupuesto_enviado: 'Presupuesto enviado',
  esperando_autorizacion: 'Esperando autorización',
  autorizado: 'Autorizado',
  en_reparacion: 'En reparación',
  esperando_repuesto: 'Esperando repuesto',
  reparacion_finalizada: 'Reparación finalizada',
  en_pruebas: 'En pruebas',
  listo_para_retirar: 'Listo para retirar',
  entregado: 'Entregado',
  rechazado: 'Rechazado',
  cancelado: 'Cancelado',
  sin_reparacion: 'Sin reparación',
  abandonado: 'Abandonado',
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  requested: 'Solicitado',
  pending_confirmation: 'Pendiente de confirmación',
  confirmed: 'Confirmado',
  cancelled_by_customer: 'Cancelado por cliente',
  cancelled_by_technician: 'Cancelado por técnico',
  completed: 'Completado',
  no_show: 'No asistió',
}

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  coming_soon: 'Próximamente',
}

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  borrador: 'Borrador',
  enviado: 'Enviado',
  visto: 'Visto',
  aceptado: 'Aceptado',
  rechazado: 'Rechazado',
  vencido: 'Vencido',
}

// ─── TRANSICIONES VÁLIDAS ──────────────────────────────────────────────────

/**
 * Transiciones válidas de estados de reparación (MVP).
 */
export const REPAIR_STATUS_TRANSITIONS: Record<RepairStatus, RepairStatus[]> = {
  recibido: ['en_diagnostico', 'cancelado', 'sin_reparacion', 'abandonado'],
  en_diagnostico: ['presupuesto_pendiente', 'cancelado', 'sin_reparacion', 'abandonado'],
  presupuesto_pendiente: ['presupuesto_enviado', 'cancelado', 'sin_reparacion', 'abandonado'],
  presupuesto_enviado: ['esperando_autorizacion', 'cancelado', 'sin_reparacion', 'abandonado'],
  esperando_autorizacion: ['autorizado', 'cancelado', 'rechazado', 'sin_reparacion', 'abandonado'],
  autorizado: ['en_reparacion', 'cancelado', 'sin_reparacion', 'abandonado'],
  en_reparacion: ['esperando_repuesto', 'reparacion_finalizada', 'cancelado', 'abandonado'],
  esperando_repuesto: ['en_reparacion', 'reparacion_finalizada', 'cancelado', 'abandonado'],
  reparacion_finalizada: ['en_pruebas', 'cancelado'],
  en_pruebas: ['listo_para_retirar', 'reparacion_finalizada', 'cancelado'],
  listo_para_retirar: ['entregado', 'cancelado'],
  entregado: [],
  rechazado: [],
  cancelado: [],
  sin_reparacion: [],
  abandonado: [],
}

// ─── ROLES ────────────────────────────────────────────────────────────────

export const ADMIN_ROLE: ProfileRole = 'admin'
export const TECHNICIAN_ROLE: ProfileRole = 'technician'
export const CUSTOMER_ROLE: ProfileRole = 'customer'
