/**
 * Tipos locales para servicios — usados cuando el schema de Supabase no está disponible.
 * Estos tipos son independientes del schema de DB y se usan en las páginas públicas.
 */

export interface PublicService {
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
  featured: boolean
  sort_order: number
  seo_title: string | null
  seo_description: string | null
  status: 'active' | 'inactive' | 'coming_soon'
}

export interface ServiceOption {
  id: string
  name: string
  slug: string
  duration: number | null
}

export type ServiceStatus = 'active' | 'inactive' | 'coming_soon'
