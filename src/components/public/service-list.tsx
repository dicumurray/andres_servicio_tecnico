import type { PublicService } from '@/types/service'
import Link from 'next/link'
import { ServiceCard } from './service-card'

interface ServiceListProps {
  services: PublicService[]
}

export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="rounded-lg border border-default bg-elevated p-8 text-center">
        <p className="text-muted">No hay servicios publicados en este momento.</p>
        <p className="mt-2 text-sm text-muted">
          Volvé luego o <Link href="/contacto" className="text-accent hover:underline">contactanos</Link> para consultar.
        </p>
      </div>
    )
  }

  // Agrupar por categoría.
  const grouped: Record<string, PublicService[]> = {}
  for (const service of services) {
    const cat = service.category ?? 'General'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(service)
  }

  const categories = Object.keys(grouped).sort()

  return (
    <div className="space-y-10">
      {/* Filtro por categoría */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <span
            key={cat}
            className="rounded-full px-3 py-1 text-xs font-medium bg-muted text-muted border border-default"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Servicios por categoría */}
      {categories.map(category => (
        <section key={category}>
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[category].map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
