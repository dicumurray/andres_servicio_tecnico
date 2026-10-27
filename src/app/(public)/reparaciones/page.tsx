import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'
import { serviceCatalog } from '@/lib/service-catalog'

export const metadata = {
  title: 'Reparaciones',
  description: 'Trabajos disponibles para celulares y computadoras en Andrés Servicio Técnico.',
}

export default function ReparacionesPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-body mb-2">Reparaciones</h1>
          <p className="text-base text-muted mb-8">
            Trabajos disponibles, separados por tipo de equipo.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {serviceCatalog.map((category) => (
              <section key={category.slug} className="rounded-lg border border-default bg-elevated p-6">
                <h2 className="text-lg font-semibold text-body mb-4">{category.name}</h2>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
                  {category.services.map((service) => <li key={service}>{service}</li>)}
                </ul>
              </section>
            ))}
          </div>

          <div className="rounded-lg border border-default bg-muted/50 p-6 text-center">
            <p className="text-muted mb-4">Consultas por WhatsApp.</p>
            <a
              href={`https://wa.me/+541123992527?text=Hola%20Andres,%20quiero%20consultar%20por%20una%20reparacion.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-accent bg-elevated h-11 px-6 text-sm font-semibold text-accent dark:text-accent-light hover:bg-accent hover:text-white dark:hover:bg-accent-light transition-colors"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  )
}