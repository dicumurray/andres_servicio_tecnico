import { createClient } from '@/lib/supabase-server'
import type { PublicService } from '@/types/service'
import { HomeHero } from '@/components/public/home-hero'
import { HomeServices } from '@/components/public/home-services'
import { HomeProcess } from '@/components/public/home-process'
import { HomeContact } from '@/components/public/home-contact'

export async function generateStaticParams() {
  return []
}

async function getPublicServices(): Promise<PublicService[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  // Mapeo explícito a PublicService para evitar problemas de tipado del schema.
  return (data ?? []).map((s: any) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    short_description: s.short_description,
    full_description: s.full_description,
    category: s.category,
    image_url: s.image_url,
    price: s.price,
    price_visible: s.price_visible,
    estimated_duration: s.estimated_duration,
    featured: s.featured,
    sort_order: s.sort_order,
    seo_title: s.seo_title,
    seo_description: s.seo_description,
    status: s.status ?? 'active',
  }))
}

export default async function HomePage() {
  const services = await getPublicServices()
  const featuredServices = services.filter(s => s.featured)

  return (
    <div className="flex min-h-screen flex-col">
      <HomeHero services={services} />
      <HomeServices services={services} featuredServices={featuredServices} />
      <HomeProcess />
      <HomeContact />
    </div>
  )
}
