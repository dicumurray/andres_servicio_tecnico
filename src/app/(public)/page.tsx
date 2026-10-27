import { createClient } from '@/lib/supabase-server'
import type { PublicService } from '@/types/service'
import { HomeHero } from '@/components/public/home-hero'
import { HomeServices } from '@/components/public/home-services'
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
    .returns<PublicService[]>()

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data ?? []
}

export default async function HomePage() {
  const services = await getPublicServices()
  const featuredServices = services.filter(s => s.featured)

  return (
    <div className="flex min-h-screen flex-col">
      <HomeHero />
      <HomeServices services={services} featuredServices={featuredServices} />
      <HomeContact />
    </div>
  )
}
