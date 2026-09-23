export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'

export const metadata: Metadata = {
  title: 'Servicios',
  description: 'Catálogo de servicios de Andrés Servicio Técnico. Reparación de celulares, electrónica, placas, fuentes, UPS y más en La Plata, Buenos Aires.',
}

export default function ServicesPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-body mb-2">Servicios</h1>
          <p className="text-base text-muted mb-8">
            En breve estarán disponibles todos los servicios del catálogo.
          </p>
          <div className="rounded-lg border border-default bg-elevated p-8 text-center">
            <p className="text-muted">
              El catálogo de servicios se está cargando desde la base de datos.
            </p>
            <p className="mt-2 text-sm text-muted">
              Si necesitás un servicio ahora,{' '}
              <a
                href={`https://wa.me/+541123992527?text=Hola%20Andres,%20quiero%20consultar%20por%20un%20servicio.`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                consultanos por WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  )
}
