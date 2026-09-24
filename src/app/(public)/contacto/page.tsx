import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'

export const metadata = {
  title: 'Contacto',
  description: 'Contactá a Andrés Servicio Técnico. La Plata, Buenos Aires. Consultá por WhatsApp o solicitá un turno.',
}

export default function ContactoPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-body mb-2">Contacto</h1>
          <p className="text-base text-muted mb-8">
            Consultá, solicitá un turno o hacé tu pregunta. Responderemos pronto.
          </p>

          <div className="space-y-6">
            {/* WhatsApp */}
            <div className="rounded-lg border border-default bg-elevated p-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 ring-1 ring-accent/20 shrink-0">
                  <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.52.598-.819.893-.297.297-.693.446-.989.446-.297 0-.594-.149-.89-.446-.297-.298-.495-.598-.693-.894-.198-.298-.298-.397-.396-.595-.099-.198-.149-.298-.198-.447-.298-.595-.397-1.19-.397-1.784 0-.595.198-1.19.595-1.784.148-.298.346-.597.595-.893.248-.297.496-.595.793-.893.297-.298.595-.496.893-.595.298-.1 1.044-.347 1.49-.247.446.1 1.043.347 1.44.496.198.05 1.193.2 1.341.3.148.099.198.248.248.347.05.099.05.2-.05.298-.1.099-1.096.396-1.343.446-.247.05-.495.099-.743.099-.544 0-1.09-.25-1.485-.595-.395-.347-.594-.844-.594-1.342 0-.497.198-.994.595-1.391.198-.198.396-.297.595-.297.198 0 .347.099.446.297.099.198.148.446.148.693 0 .544-.248 1.09-.595 1.536-.198.248-.446.496-.693.693-.248.198-.496.298-.743.298-.248 0-.545-.099-.793-.297-.248-.198-.347-.446-.347-.693 0-.149.148-.347.347-.496.198-.15.297-.25.446-.25.1 0 .248.1.297.249.05.148.05.298.05.446 0 .446-.198.844-.545 1.191-.198.2-.446.3-.743.3h-.743c-.544 0-1.09.248-1.485.693-.395.446-.594 1.043-.594 1.637 0 .545.198 1.09.595 1.535.198.248.446.496.693.693.248.198.496.298.743.298.149 0 .347-.05.446-.15.099-.1.149-.3.149-.496 0-.544-.248-1.09-.693-1.486-.248-.248-.545-.397-.893-.397-.346 0-.644.149-.893.397-.248.248-.397.545-.397.893 0 .644.346 1.19.844 1.587.248.248.545.446.893.595.347.149.744.25 1.14.25.545 0 1.043-.25 1.44-.7 2.187-2.139 2.187-3.634 2.187-4.282 0-1.14-.544-2.134-1.44-2.83-.893-.693-1.988-1.041-3.133-1.041h-.743c-1.145 0-2.239.347-3.234 1.041-.945.6-1.485 1.342-1.732 2.134-.248.792-.347 1.586-.347 2.379 0 .794.099 1.588.347 2.38.248.792.595 1.584 1.044 2.28.446.693 1.043 1.241 1.732 1.685.69.446 1.386.694 2.133.744.25.05.545.05.844.05.744 0 1.485-.249 2.18-.7v-.001c.544-.346 1.09-.792 1.588-1.339.498-.544.946-1.189 1.292-1.932.297-.637.545-1.375.545-2.11 0-1.14-.545-2.134-1.44-2.83z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-body mb-1">WhatsApp</h2>
                  <p className="text-sm text-muted mb-3">
                    Escribinos directamente por WhatsApp para consultas rápidas.
                  </p>
                  <a
                    href={`https://wa.me/+541123992527?text=Hola%20Andres,%20quiero%20consultar.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md border border-accent bg-elevated h-11 px-6 text-sm font-semibold text-accent dark:text-accent-light hover:bg-accent hover:text-white dark:hover:bg-accent-light transition-colors"
                  >
                    Escribir por WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Turnos */}
            <div className="rounded-lg border border-default bg-elevated p-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 ring-1 ring-accent/20 shrink-0">
                  <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-body mb-1">Solicitar turno</h2>
                  <p className="text-sm text-muted mb-3">
                    Pedí tu turno para diagnóstico y reparación.
                  </p>
                  <a
                    href="/turnos"
                    className="inline-flex items-center justify-center rounded-md border border-accent bg-elevated h-11 px-6 text-sm font-semibold text-accent dark:text-accent-light hover:bg-accent hover:text-white dark:hover:bg-accent-light transition-colors"
                  >
                    Solicitar turno
                  </a>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="rounded-lg border border-default bg-elevated p-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 ring-1 ring-accent/20 shrink-0">
                  <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-body mb-1">Ubicación</h2>
                  <p className="text-sm text-muted">
                    Andrés Servicio Técnico
                    {' '}
La Plata, Buenos Aires, Argentina
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-default bg-muted/50 p-6 text-center">
            <p className="text-muted mb-4">
              No encontrás tu respuesta? Escribinos directamente.
            </p>
            <a
              href={`https://wa.me/+541123992527?text=Hola%20Andres,%20tengo%20una%20pregunta.`}
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