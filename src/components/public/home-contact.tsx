import Link from 'next/link'

export function HomeContact() {
  return (
    <section className="px-4 py-16 bg-muted/30">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-xl font-semibold text-body mb-2">¿Tu equipo tiene una falla?</h2>
        <p className="text-sm text-muted mb-6">
          Solicitá un turno para diagnóstico. Estamos en La Plata, Buenos Aires.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/turnos"
            className="inline-flex items-center justify-center rounded-md h-11 px-6 text-sm font-semibold bg-accent text-white hover:bg-accent-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Solicitar turno
          </Link>
          <a
            href={`https://wa.me/+541123992527?text=Hola%20Andres,%20quiero%20consultar%20por%20una%20reparacion.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md h-11 px-6 text-sm font-medium bg-elevated text-body border border-default hover:bg-muted hover:text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Consultar por WhatsApp
          </a>
        </div>

        <p className="mt-4 text-xs text-muted">
          Respondemos de lunes a viernes, de 9 a 19 hs.
        </p>
      </div>
    </section>
  )
}
