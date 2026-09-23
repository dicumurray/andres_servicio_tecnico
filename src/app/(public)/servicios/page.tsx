export function generateStaticParams() {
  return []
}

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import type { PublicService } from '@/types/service'
import Link from 'next/link'
import { ServiceList } from '@/components/public/service-list'
import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'
import { notFound } from 'next/navigation'

interface PageProps {
  searchParams: Promise<{ slug?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const slug = params.slug

  if (!slug) {
    return {
      title: 'Servicios',
      description: 'Catálogo de servicios de Andrés Servicio Técnico. Reparación de celulares, electrónica, placas, fuentes, UPS y más en La Plata, Buenos Aires.',
    }
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('services')
    .select('seo_title, seo_description')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Servicio' }

  return {
    title: (data as any).seo_title ?? `Servicio: ${slug}`,
    description: (data as any).seo_description,
  }
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const slug = params.slug

  const supabase = await createClient()

  if (slug) {
    // Página individual de servicio.
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !service) {
      notFound()
    }

    const s = service as unknown as PublicService

    return (
      <>
        <AppHeader />
        <main>
          <div className="px-4 py-12">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/servicios"
                className="inline-flex items-center gap-1 text-sm text-muted hover:text-body transition-colors mb-6"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Volver a servicios
              </Link>

              <h1 className="text-3xl font-bold text-body mb-4">{s.name}</h1>

              <div className="rounded-lg border border-default bg-elevated p-6">
                {s.short_description && (
                  <p className="text-base text-body mb-4">{s.short_description}</p>
                )}

                {s.full_description && (
                  <div className="text-sm text-muted prose prose-sm max-w-none">
                    {s.full_description}
                  </div>
                )}

                <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {s.estimated_duration && (
                    <div className="flex justify-between">
                      <dt className="text-muted">Duración estimada</dt>
                      <dd className="font-medium text-body">{s.estimated_duration} minutos</dd>
                    </div>
                  )}
                  {s.price_visible && s.price != null && (
                    <div className="flex justify-between">
                      <dt className="text-muted">Precio estimado</dt>
                      <dd className="font-medium text-body">
                        ${Number(s.price).toLocaleString('es-AR')}
                      </dd>
                    </div>
                  )}
                  {!s.price_visible && (
                    <div className="flex justify-between">
                      <dt className="text-muted">Precio</dt>
                      <dd className="font-medium text-body">Consultá cotización</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted">Categoría</dt>
                    <dd className="font-medium text-body">{s.category ?? 'General'}</dd>
                  </div>
                </dl>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/turnos?service=${s.slug}`}
                    className="inline-flex items-center justify-center rounded-md h-10 px-5 text-sm font-semibold bg-accent text-white hover:bg-accent-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Solicitar turno para este servicio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <AppFooter />
      </>
    )
  }

  // Listado de servicios.
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error cargando servicios:', error)
  }

  const servicesList = (services ?? []) as unknown as PublicService[]

  return (
    <>
      <AppHeader />
      <main>
        <div className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl font-bold text-body mb-2">Servicios</h1>
            <p className="text-base text-muted mb-8 max-w-2xl">
              Catálogo de servicios de Andrés Servicio Técnico. Reparación de celulares, electrónica, placas, fuentes, UPS y más.
              Si no encontramos tu servicio, preguntanos.
            </p>
            <ServiceList services={servicesList} />
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  )
}
