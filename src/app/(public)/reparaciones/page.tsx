import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'

export const metadata = {
  title: 'Reparaciones',
  description: 'Reparaciones de celulares, electrónica y hardware en Andrés Servicio Técnico. La Plata, Buenos Aires.',
}

export default function ReparacionesPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-body mb-2">Reparaciones</h1>
          <p className="text-base text-muted mb-8">
            Reparamos celulares, electrónica y hardware. Primero diagnosticamos, después reparamos.
          </p>

          <div className="rounded-lg border border-default bg-elevated p-6 mb-8">
            <h2 className="text-lg font-semibold text-body mb-4">¿Qué reparamos?</h2>
            <p className="text-sm text-muted mb-4">
              Reparamos una gran variedad de dispositivos y equipos. Si no está en la lista, preguntanos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-md border border-default bg-muted/50 p-4">
                <h3 className="font-semibold text-body mb-1">Celulares y tablets</h3>
                <p className="text-muted">Pantallas, baterías, cargadores, micrófonos, altavoces, botones, puertos, conectividad.</p>
              </div>
              <div className="rounded-md border border-default bg-muted/50 p-4">
                <h3 className="font-semibold text-body mb-1">Electrónica de consumo</h3>
                <p className="text-muted">Audífonos, parlantes, micrófonos, controles remotos, cargadores, adaptadores.</p>
              </div>
              <div className="rounded-md border border-default bg-muted/50 p-4">
                <h3 className="font-semibold text-body mb-1">Hardware y PC</h3>
                <p className="text-muted">Reparación de placas, fuentes de poder, UPS, discos rígidos, memorias, periféricos.</p>
              </div>
              <div className="rounded-md border border-default bg-muted/50 p-4">
                <h3 className="font-semibold text-body mb-1">Otros equipos</h3>
                <p className="text-muted">GPS, consolas, mando a distancia, dispositivos de domótica, pantallas LED.</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-default bg-elevated p-6 mb-8">
            <h2 className="text-lg font-semibold text-body mb-4">¿Cómo funciona?</h2>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent text-white text-xs font-semibold shrink-0">1</span>
                <span><strong className="text-body">Traé o enviá tu equipo.</strong> Nosotros recibimos para diagnóstico en La Plata.</span>
              </div>
              <div className="flex gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent text-white text-xs font-semibold shrink-0">2</span>
                <span><strong className="text-body">Diagnóstico.</strong> Te damos un presupuesto claro antes de comenzar cualquier trabajo.</span>
              </div>
              <div className="flex gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent text-white text-xs font-semibold shrink-0">3</span>
                <span><strong className="text-body">Reparación.</strong> Ejecutamos el trabajo con criterio técnico y garantía.</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-default bg-muted/50 p-6 text-center">
            <p className="text-muted mb-4">
              No encontraste tu equipo en la lista? Consultanos.
            </p>
            <a
              href={`https://wa.me/+541123992527?text=Hola%20Andres,%20quiero%20consultar%20por%20una%20reparacion.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md h-11 px-6 text-sm font-semibold bg-accent text-white hover:bg-accent-dark transition-colors"
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