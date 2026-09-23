/**
 * Tipos centrales de la aplicación.
 * Derivados del esquema de Supabase — mantener sincronizados con las migraciones.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: Partial<Profile>
      }
      customers: {
        Row: Customer
        Insert: CustomerInsert
        Update: Partial<Customer>
      }
      devices: {
        Row: Device
        Insert: DeviceInsert
        Update: Partial<Device>
      }
      services: {
        Row: Service
        Insert: ServiceInsert
        Update: Partial<Service>
      }
      appointments: {
        Row: Appointment
        Insert: AppointmentInsert
        Update: Partial<Appointment>
      }
      availability: {
        Row: Availability
        Insert: AvailabilityInsert
        Update: Partial<Availability>
      }
      availability_exceptions: {
        Row: AvailabilityException
        Insert: AvailabilityExceptionInsert
        Update: Partial<AvailabilityException>
      }
      repairs: {
        Row: Repair
        Insert: RepairInsert
        Update: Partial<Repair>
      }
      repair_status_history: {
        Row: RepairStatusHistory
        Insert: RepairStatusHistoryInsert
        Update: never
      }
      quotes: {
        Row: Quote
        Insert: QuoteInsert
        Update: Partial<Quote>
      }
      quote_items: {
        Row: QuoteItem
        Insert: QuoteItemInsert
        Update: Partial<QuoteItem>
      }
      content_posts: {
        Row: ContentPost
        Insert: ContentPostInsert
        Update: Partial<ContentPost>
      }
      repair_posts: {
        Row: RepairPost
        Insert: RepairPostInsert
        Update: Partial<RepairPost>
      }
      projects: {
        Row: Project
        Insert: ProjectInsert
        Update: Partial<Project>
      }
      media: {
        Row: Media
        Insert: MediaInsert
        Update: Partial<Media>
      }
      notifications: {
        Row: Notification
        Insert: NotificationInsert
        Update: Partial<Notification>
      }
      settings: {
        Row: Setting
        Insert: SettingInsert
        Update: Partial<Setting>
      }
      audit_logs: {
        Row: AuditLog
        Insert: AuditLogInsert
        Update: never
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      profile_role: 'admin' | 'technician' | 'customer'
      service_status: 'active' | 'inactive' | 'coming_soon'
      appointment_status: 'requested' | 'pending_confirmation' | 'confirmed' | 'cancelled_by_customer' | 'cancelled_by_technician' | 'completed' | 'no_show'
      device_type: 'celular' | 'notebook' | 'pc' | 'impresora' | 'ups' | 'fuente' | 'placa' | 'otro'
      repair_status: 'recibido' | 'en_diagnostico' | 'presupuesto_pendiente' | 'presupuesto_enviado' | 'esperando_autorizacion' | 'autorizado' | 'en_reparacion' | 'esperando_repuesto' | 'reparacion_finalizada' | 'en_pruebas' | 'listo_para_retirar' | 'entregado' | 'rechazado' | 'cancelado' | 'sin_reparacion' | 'abandonado'
      quote_status: 'borrador' | 'enviado' | 'visto' | 'aceptado' | 'rechazado' | 'vencido'
      content_status: 'borrador' | 'publicado' | 'archivado'
      content_type: 'articulo' | 'reparacion_publicable' | 'proyecto'
      profile_status: 'active' | 'inactive'
      customer_status: 'active' | 'inactive'
      media_category: 'celulares' | 'electronica' | 'placas' | 'soldadura' | 'laboratorio' | 'ups' | 'fuentes' | 'pc' | 'impresoras' | 'proyectos'
      project_status: 'activo' | 'completado' | 'en_curso'
      notification_type: 'appointment_requested' | 'appointment_confirmed' | 'appointment_cancelled' | 'repair_received' | 'budget_sent' | 'repair_authorized' | 'repair_finished' | 'ready_for_pickup' | 'repair_delivered'
      entity_type: 'repair' | 'content_post' | 'project' | 'gallery'
    }
  }
}

// ─── PROFILES ────────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  role: 'admin' | 'technician' | 'customer'
  avatar_url: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface ProfileInsert {
  id: string
  email?: string | null
  full_name?: string | null
  phone?: string | null
  role?: 'admin' | 'technician' | 'customer'
  avatar_url?: string | null
  status?: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

// ─── CUSTOMERS ──────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  profile_id: string | null
  customer_number: string
  name: string
  surname: string
  phone: string | null
  email: string | null
  notes: string | null
  status: 'active' | 'inactive'
  communications_consent: boolean
  created_at: string
  updated_at: string
}

export interface CustomerInsert {
  id?: string
  profile_id?: string | null
  customer_number?: string
  name: string
  surname: string
  phone?: string | null
  email?: string | null
  notes?: string | null
  status?: 'active' | 'inactive'
  communications_consent?: boolean
  created_at?: string
  updated_at?: string
}

// ─── DEVICES ────────────────────────────────────────────────────────────────

export interface Device {
  id: string
  customer_id: string
  type: 'celular' | 'notebook' | 'pc' | 'impresora' | 'ups' | 'fuente' | 'placa' | 'otro'
  brand: string | null
  model: string | null
  serial_number: string | null
  imei: string | null
  description: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DeviceInsert {
  id?: string
  customer_id: string
  type?: 'celular' | 'notebook' | 'pc' | 'impresora' | 'ups' | 'fuente' | 'placa' | 'otro'
  brand?: string | null
  model?: string | null
  serial_number?: string | null
  imei?: string | null
  description?: string | null
  notes?: string | null
  created_at?: string
  updated_at?: string
}

// ─── SERVICES ───────────────────────────────────────────────────────────────

export interface Service {
  id: string
  name: string
  slug: string
  short_description: string | null
  full_description: string | null
  category: string | null
  image_url: string | null
  price: number | null
  price_visible: boolean
  estimated_duration: number | null
  status: 'active' | 'inactive' | 'coming_soon'
  featured: boolean
  sort_order: number
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

export interface ServiceInsert {
  id?: string
  name: string
  slug: string
  short_description?: string | null
  full_description?: string | null
  category?: string | null
  image_url?: string | null
  price?: number | null
  price_visible?: boolean
  estimated_duration?: number | null
  status?: 'active' | 'inactive' | 'coming_soon'
  featured?: boolean
  sort_order?: number
  seo_title?: string | null
  seo_description?: string | null
  created_at?: string
  updated_at?: string
}

// ─── APPOINTMENTS ───────────────────────────────────────────────────────────

export interface Appointment {
  id: string
  customer_id: string | null
  service_id: string | null
  appointment_number: string
  scheduled_at: string
  duration_minutes: number | null
  status: 'requested' | 'pending_confirmation' | 'confirmed' | 'cancelled_by_customer' | 'cancelled_by_technician' | 'completed' | 'no_show'
  customer_name: string | null
  customer_surname: string | null
  customer_phone: string | null
  customer_email: string | null
  device_brand: string | null
  device_model: string | null
  failure_description: string | null
  notes: string | null
  confirmation_sent_at: string | null
  created_at: string
  updated_at: string
}

export interface AppointmentInsert {
  id?: string
  customer_id?: string | null
  service_id?: string | null
  appointment_number?: string
  scheduled_at?: string
  duration_minutes?: number | null
  status?: 'requested' | 'pending_confirmation' | 'confirmed' | 'cancelled_by_customer' | 'cancelled_by_technician' | 'completed' | 'no_show'
  customer_name?: string | null
  customer_surname?: string | null
  customer_phone?: string | null
  customer_email?: string | null
  device_brand?: string | null
  device_model?: string | null
  failure_description?: string | null
  notes?: string | null
  confirmation_sent_at?: string | null
  created_at?: string
  updated_at?: string
}

// ─── AVAILABILITY ───────────────────────────────────────────────────────────

export interface Availability {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_default: boolean
  created_at: string
}

export interface AvailabilityInsert {
  id?: string
  day_of_week: number
  start_time: string
  end_time: string
  is_default?: boolean
  created_at?: string
}

// ─── AVAILABILITY EXCEPTIONS ────────────────────────────────────────────────

export interface AvailabilityException {
  id: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  reason: string | null
  type: 'blocked' | 'vacation' | 'holiday' | 'special'
  created_at: string
}

export interface AvailabilityExceptionInsert {
  id?: string
  start_date: string
  end_date: string
  start_time?: string
  end_time?: string
  reason?: string | null
  type?: 'blocked' | 'vacation' | 'holiday' | 'special'
  created_at?: string
}

// ─── REPAIRS ────────────────────────────────────────────────────────────────

export interface Repair {
  id: string
  customer_id: string
  device_id: string | null
  appointment_id: string | null
  repair_number: string
  received_at: string
  declared_failure: string | null
  diagnosis: string | null
  cause: string | null
  work_done: string | null
  components_used: string | null
  budget: number | null
  final_price: number | null
  warranty: string | null
  status: 'recibido' | 'en_diagnostico' | 'presupuesto_pendiente' | 'presupuesto_enviado' | 'esperando_autorizacion' | 'autorizado' | 'en_reparacion' | 'esperando_repuesto' | 'reparacion_finalizada' | 'en_pruebas' | 'listo_para_retirar' | 'entregado' | 'rechazado' | 'cancelado' | 'sin_reparacion' | 'abandonado'
  internal_notes: string | null
  delivery_date: string | null
  publish_authorized: boolean
  hide_sensitive_data: boolean
  created_at: string
  updated_at: string
}

export interface RepairInsert {
  id?: string
  customer_id: string
  device_id?: string | null
  appointment_id?: string | null
  repair_number?: string
  received_at?: string
  declared_failure?: string | null
  diagnosis?: string | null
  cause?: string | null
  work_done?: string | null
  components_used?: string | null
  budget?: number | null
  final_price?: number | null
  warranty?: string | null
  status?: 'recibido' | 'en_diagnostico' | 'presupuesto_pendiente' | 'presupuesto_enviado' | 'esperando_autorizacion' | 'autorizado' | 'en_reparacion' | 'esperando_repuesto' | 'reparacion_finalizada' | 'en_pruebas' | 'listo_para_retirar' | 'entregado' | 'rechazado' | 'cancelado' | 'sin_reparacion' | 'abandonado'
  internal_notes?: string | null
  delivery_date?: string | null
  publish_authorized?: boolean
  hide_sensitive_data?: boolean
  created_at?: string
  updated_at?: string
}

// ─── REPAIR STATUS HISTORY ─────────────────────────────────────────────────

export interface RepairStatusHistory {
  id: string
  repair_id: string
  status: string
  note: string | null
  created_at: string
}

export interface RepairStatusHistoryInsert {
  id?: string
  repair_id: string
  status: string
  note?: string | null
  created_at?: string
}

// ─── QUOTES ────────────────────────────────────────────────────────────────

export interface Quote {
  id: string
  repair_id: string
  quote_number: string
  description: string | null
  amount: number | null
  expiration_date: string | null
  conditions: string | null
  status: 'borrador' | 'enviado' | 'visto' | 'aceptado' | 'rechazado' | 'vencido'
  created_at: string
  updated_at: string
}

export interface QuoteInsert {
  id?: string
  repair_id: string
  quote_number?: string
  description?: string | null
  amount?: number | null
  expiration_date?: string | null
  conditions?: string | null
  status?: 'borrador' | 'enviado' | 'visto' | 'aceptado' | 'rechazado' | 'vencido'
  created_at?: string
  updated_at?: string
}

// ─── QUOTE ITEMS ───────────────────────────────────────────────────────────

export interface QuoteItem {
  id: string
  quote_id: string
  description: string | null
  quantity: number | null
  unit_price: number | null
  total_price: number | null
  created_at: string
}

export interface QuoteItemInsert {
  id?: string
  quote_id: string
  description?: string | null
  quantity?: number | null
  unit_price?: number | null
  total_price?: number | null
  created_at?: string
}

// ─── CONTENT POSTS (BLOG) ──────────────────────────────────────────────────

export interface ContentPost {
  id: string
  title: string
  slug: string
  summary: string | null
  content: string | null
  cover_image_url: string | null
  author_id: string | null
  published_at: string | null
  category: string | null
  tags: string[] | null
  status: 'borrador' | 'publicado' | 'archivado'
  seo_title: string | null
  seo_description: string | null
  featured: boolean
  created_at: string
  updated_at: string
}

export interface ContentPostInsert {
  id?: string
  title: string
  slug: string
  summary?: string | null
  content?: string | null
  cover_image_url?: string | null
  author_id?: string | null
  published_at?: string | null
  category?: string | null
  tags?: string[] | null
  status?: 'borrador' | 'publicado' | 'archivado'
  seo_title?: string | null
  seo_description?: string | null
  featured?: boolean
  created_at?: string
  updated_at?: string
}

// ─── REPAIR POSTS ──────────────────────────────────────────────────────────

export interface RepairPost {
  id: string
  repair_id: string
  title: string | null
  problem: string | null
  diagnosis: string | null
  solution: string | null
  result: string | null
  images: string[] | null
  video_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface RepairPostInsert {
  id?: string
  repair_id: string
  title?: string | null
  problem?: string | null
  diagnosis?: string | null
  solution?: string | null
  result?: string | null
  images?: string[] | null
  video_url?: string | null
  published?: boolean
  created_at?: string
  updated_at?: string
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────

export interface Project {
  id: string
  name: string
  description: string | null
  technologies: string[] | null
  images: string[] | null
  videos: string[] | null
  status: 'activo' | 'completado' | 'en_curso'
  content: string | null
  created_at: string
  updated_at: string
}

export interface ProjectInsert {
  id?: string
  name: string
  description?: string | null
  technologies?: string[] | null
  images?: string[] | null
  videos?: string[] | null
  status?: 'activo' | 'completado' | 'en_curso'
  content?: string | null
  created_at?: string
  updated_at?: string
}

// ─── MEDIA ────────────────────────────────────────────────────────────────

export interface Media {
  id: string
  entity_type: 'repair' | 'content_post' | 'project' | 'gallery'
  entity_id: string | null
  file_url: string
  file_type: 'image' | 'video' | 'document'
  title: string | null
  description: string | null
  category: 'celulares' | 'electronica' | 'placas' | 'soldadura' | 'laboratorio' | 'ups' | 'fuentes' | 'pc' | 'impresoras' | 'proyectos' | null
  alt_text: string | null
  is_private: boolean
  created_at: string
}

export interface MediaInsert {
  id?: string
  entity_type?: 'repair' | 'content_post' | 'project' | 'gallery'
  entity_id?: string | null
  file_url: string
  file_type?: 'image' | 'video' | 'document'
  title?: string | null
  description?: string | null
  category?: 'celulares' | 'electronica' | 'placas' | 'soldadura' | 'laboratorio' | 'ups' | 'fuentes' | 'pc' | 'impresoras' | 'proyectos' | null
  alt_text?: string | null
  is_private?: boolean
  created_at?: string
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────

export interface Notification {
  id: string
  user_id: string
  type: 'appointment_requested' | 'appointment_confirmed' | 'appointment_cancelled' | 'repair_received' | 'budget_sent' | 'repair_authorized' | 'repair_finished' | 'ready_for_pickup' | 'repair_delivered'
  title: string | null
  message: string | null
  reference_type: string | null
  reference_id: string | null
  read: boolean
  created_at: string
}

export interface NotificationInsert {
  id?: string
  user_id: string
  type?: 'appointment_requested' | 'appointment_confirmed' | 'appointment_cancelled' | 'repair_received' | 'budget_sent' | 'repair_authorized' | 'repair_finished' | 'ready_for_pickup' | 'repair_delivered'
  title?: string | null
  message?: string | null
  reference_type?: string | null
  reference_id?: string | null
  read?: boolean
  created_at?: string
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────

export interface Setting {
  id: string
  key: string
  value: Json | null
  updated_at: string
}

export interface SettingInsert {
  id?: string
  key: string
  value?: Json | null
  updated_at?: string
}

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────

export interface AuditLog {
  id: string
  admin_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  details: Json | null
  created_at: string
}

export interface AuditLogInsert {
  id?: string
  admin_id?: string | null
  action: string
  entity_type?: string | null
  entity_id?: string | null
  details?: Json | null
  created_at?: string
}
