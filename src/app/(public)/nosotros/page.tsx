import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'

export const metadata = {
  title: 'Sobre nosotros',
  description: 'Andrés Servicio Técnico — diagnóstico preciso y reparaciones con criterio. La Plata, Buenos Aires.',
}

export default function NosotrosPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-body mb-2">Sobre nosotros</h1>
          <p className="text-base text-muted mb-8">
            Servicio técnico de electrónica y celulares en La Plata, Buenos Aires.
          </p>

          <div className="rounded-lg border border-default bg-elevated p-6 mb-8">
            <h2 className="text-lg font-semibold text-body mb-4">Nuestro enfoque</h2>
            <p className="text-sm text-muted mb-4">
              Trabajamos con un criterio claro: primero diagnosticamos, después reparamos. 
              No recomendaramos un reemplazo si la reparación es viable.
            </p>
            <p className="text-sm text-muted">
              Nos especializamos en la reparación de celulares, electrónica de consumo y hardware. 
              Cada equipo recibe atención individual.
            </p>
          </div>

          <div className="rounded-lg border border-default bg-elevated p-6 mb-8">
            <h2 className="text-lg font-semibold text-body mb-4">Servicios</h2>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex justify-between">
                <span>Celulares y tablets</span>
                <span className="text-body">Reparación de pantalla, batería, puertos, conectividad</span>
              </li>
              <li className="flex justify-between">
                <span>Electrónica de consumo</span>
                <span className="text-body">Audífonos, parlantes, cargadores, dispositivos</span>
              </li>
              <li className="flex justify-between">
                <span>Hardware y PC</span>
                <span className="text-body">Placas, fuentes, UPS, periféricos</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 rounded-lg border border-default bg-muted/50 p-6 text-center">
            <p className="text-muted mb-4">
              Consultanos por WhatsApp.
            </p>
            <a
              href={`https://wa.me/+541123992527?text=Hola%20Andres,%20quiero%20más%20información.`}
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