import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'

export const metadata = {
  title: 'Estado del servicio',
  description: 'Estado actual del servicio técnico. Andrés Servicio Técnico, La Plata.',
}

export default function EstadoPage() {
  const turnosDisponibles = [
    { fecha: '2026-09-24', horarios: ['10:00', '10:30', '14:00', '15:30', '16:00'] },
    { fecha: '2026-09-25', horarios: ['09:00', '11:00', '13:00', '16:30'] },
    { fecha: '2026-09-26', horarios: ['10:00', '14:00', '15:00', '17:30'] },
  ]

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-body mb-2">Estado del servicio</h1>
          <p className="text-base text-muted mb-8">
            Consultá los horarios disponibles para turnos.
          </p>

          <div className="rounded-lg border border-default bg-elevated p-6 mb-8">
            <h2 className="text-lg font-semibold text-body mb-4">Próximos turnos disponibles</h2>
            <div className="space-y-4">
              {turnosDisponibles.map((d) => (
                <div key={d.fecha} className="border border-default rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-body">
                      {new Date(d.fecha).toLocaleDateString('es-AR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </h3>
                    <span className="text-xs text-muted">{d.horarios.length} horarios</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {d.horarios.map((h) => (
                      <span key={h} className="rounded-full px-3 py-1 text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-default bg-elevated p-6 mb-8">
            <h2 className="text-lg font-semibold text-body mb-4">Horario de atención</h2>
            <p className="text-sm text-muted">
              De lunes a viernes, de 9 a 19 horas.
            </p>
          </div>

          <div className="mt-8 rounded-lg border border-default bg-muted/50 p-6 text-center">
            <p className="text-muted mb-4">
              No encontrás un horario que te convenga?
            </p>
            <a
              href={`https://wa.me/+541123992527?text=Hola%20Andres,%20quiero%20pedir%20un%20turno.`}
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