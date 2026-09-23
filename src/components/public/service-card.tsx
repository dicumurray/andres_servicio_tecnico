import type { PublicService } from '@/types/service'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface ServiceCardProps {
  service: PublicService
  variant?: 'default' | 'highlighted'
}

export function ServiceCard({ service, variant = 'default' }: ServiceCardProps) {
  const statusLabel = service.status === 'coming_soon'
    ? 'Próximamente'
    : service.price_visible && service.price
      ? `Desde $${Number(service.price).toLocaleString('es-AR')}`
      : 'Consultá precio'

  return (
    <Link
      href={`/servicios/${service.slug}`}
      className={cn(
        'group block rounded-lg border border-default bg-elevated p-5 transition-all duration-150',
        'hover:border-accent hover:shadow-soft hover:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        variant === 'highlighted' && 'border-accent bg-accent/[0.03]',
      )}
    >
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-body text-base">{service.name}</h3>
          <p className="mt-1 text-sm text-muted line-clamp-2">
            {service.short_description || service.full_description?.substring(0, 100)}
          </p>
        </div>
        {service.status === 'coming_soon' && (
          <span className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-tech-500 text-tech-100 border border-tech-400">
            Próximamente
          </span>
        )}
      </div>

      {/* Detalles */}
      <div className="mt-3 flex items-center gap-4 text-xs text-muted">
        {service.estimated_duration && (
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 000 2h2v2a1 1 0 102 0v-2h2a1 1 0 000-2h-2V7z" clipRule="evenodd" />
            </svg>
            {service.estimated_duration} min aprox.
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
            <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
            <path d="M3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
          </svg>
          {statusLabel}
        </span>
      </div>

      {/* Flecha */}
      <div className="mt-4 flex items-center gap-1 text-xs text-accent group-hover:text-accent-light opacity-0 group-hover:opacity-100 transition-opacity">
        Más información
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </div>
    </Link>
  )
}
