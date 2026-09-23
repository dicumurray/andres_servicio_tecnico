import type { PublicService } from '@/types/service'
import Link from 'next/link'
import { ServiceCard } from './service-card'

interface HomeServicesProps {
  services: PublicService[]
  featuredServices: PublicService[]
}

export function HomeServices({ services, featuredServices }: HomeServicesProps) {
  if (services.length === 0) {
    return (
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold text-body mb-4">Servicios</h2>
          <div className="rounded-lg border border-default bg-elevated p-6 text-center text-muted text-sm">
            No hay servicios publicados aún. Probablemente se están cargando.
          </div>
        </div>
      </section>
    )
  }

  // Separar servicios destacados de los comunes.
  const featured = featuredServices.slice(0, 3)
  const rest = services.filter(s => !featuredServices.find(f => f.id === s.id))

  return (
    <section className="px-4 py-16 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        {/* Sección destacados */}
        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-body mb-2">Servicios destacados</h2>
            <p className="text-sm text-muted mb-6">
              Estos son algunos de los servicios que ofrecemos habitualmente.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* Todos los servicios */}
        <div>
          <h2 className="text-lg font-semibold text-body mb-2">Todos los servicios</h2>
          <p className="text-sm text-muted mb-6">
            Consultá el servicio que necesitás. Si no está en la lista, preguntanos.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light hover:underline"
            >
              Ver catálogo completo de servicios
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
