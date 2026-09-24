import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'

export const metadata = {
  title: 'Proyectos',
  description: 'Proyectos de reparación y recuperación de equipos. Andrés Servicio Técnico, La Plata.',
}

export default function ProyectosPage() {
  const proyectos = [
    {
      title: 'Recuperación de fuente de poder',
      description: 'Reparación de fuente switching de 12V usada en sistema de monitoreo.',
      status: 'completado',
    },
    {
      title: 'Reparación de tablet comercial',
      description: 'Reemplazo de pantalla y batería en tablet de gestión de inventario.',
      status: 'completado',
    },
    {
      title: 'Diagnóstico de equipo de audio',
      description: 'Evaluación de parlante Bluetooth con falla en el circuito de carga.',
      status: 'completado',
    },
  ]

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-body mb-2">Proyectos</h1>
          <p className="text-base text-muted mb-8">
            Ejemplos de trabajos de reparación y recuperación realizados.
          </p>

          <div className="space-y-4">
            {proyectos.map((proyecto) => (
              <div key={proyecto.title} className="rounded-lg border border-default bg-elevated p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-lg font-semibold text-body">{proyecto.title}</h2>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-success/20 text-success border border-success/30">
                    {proyecto.status === 'completado' ? 'Completado' : 'En progreso'}
                  </span>
                </div>
                <p className="text-sm text-muted">{proyecto.description}</p>
              </div>
            ))}
          </div>

          {proyectos.length === 0 && (
            <div className="rounded-lg border border-default bg-elevated p-8 text-center">
              <p className="text-muted">Próximamente agregaremos ejemplos de proyectos.</p>
            </div>
          )}

          <div className="mt-8 rounded-lg border border-default bg-muted/50 p-6 text-center">
            <p className="text-muted mb-4">
              Tenés un equipo que necesita reparación?
            </p>
            <a
              href={`https://wa.me/+541123992527?text=Hola%20Andres,%20tengo%20un%20equipo%20para%20reparar.`}
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