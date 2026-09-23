import Link from 'next/link'

export function AppFooter() {
  return (
    <footer className="border-t border-default bg-body mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted">
              <Link href="/" className="hover:text-body hover:underline">
                Andrés Servicio Técnico
              </Link>
            </p>
            <p className="text-xs text-muted">
              La Plata, Buenos Aires, Argentina
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-muted" aria-label="Enlaces del pie de página">
            <Link href="/servicios" className="hover:text-body hover:underline">Servicios</Link>
            <Link href="/reparaciones" className="hover:text-body hover:underline">Reparaciones</Link>
            <Link href="/blog" className="hover:text-body hover:underline">Blog</Link>
            <Link href="/turnos" className="hover:text-body hover:underline">Turnos</Link>
            <a
              href={`https://wa.me/+541123992527?text=Hola%20Andres,%20quiero%20consultar%20por%20una%20reparacion.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-body hover:underline"
            >
              WhatsApp
            </a>
            <Link href="/contacto" className="hover:text-body hover:underline">Contacto</Link>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-default flex flex-col gap-2 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} Andrés Servicio Técnico. Todos los derechos reservados.</p>
          <p className="text-muted/70">
            Diagnóstico preciso. Reparaciones con criterio.
          </p>
        </div>
      </div>
    </footer>
  )
}
