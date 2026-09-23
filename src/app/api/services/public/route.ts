import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import type { PublicService } from '@/types/service'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'No se pudieron cargar los servicios' },
      { status: 500 },
    )
  }

  // Mapeo explícito para evitar problemas de tipado del schema de Supabase.
  const publicServices: PublicService[] = (data ?? []).map((s: any) => ({
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

  return NextResponse.json(publicServices)
}
