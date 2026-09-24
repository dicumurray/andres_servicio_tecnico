import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-default bg-elevated/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-body font-semibold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          aria-label="Andrés Servicio Técnico — ir al inicio"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-accent text-white text-xs font-bold">
            AST
          </span>
          <span>Andrés Servicio Técnico</span>
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Navegación principal">
          <Link
            href="/servicios"
            className="text-muted hover:text-body transition-colors hover:underline underline-offset-4"
          >
            Servicios
          </Link>
          <Link
            href="/reparaciones"
            className="text-muted hover:text-body transition-colors hover:underline underline-offset-4"
          >
            Reparaciones
          </Link>
          <Link
            href="/blog"
            className="text-muted hover:text-body transition-colors hover:underline underline-offset-4"
          >
            Blog
          </Link>
          <Link
            href="/turnos"
            className="text-muted hover:text-body transition-colors hover:underline underline-offset-4"
          >
            Turnos
          </Link>
          <Link
            href="/contacto"
            className="text-muted hover:text-body transition-colors hover:underline underline-offset-4"
          >
            Contacto
          </Link>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <Link
            href="/turnos"
            className="hidden sm:inline-flex items-center justify-center rounded-md border border-accent bg-elevated h-9 px-4 text-sm font-medium text-accent dark:text-accent-light hover:bg-accent hover:text-white dark:hover:bg-accent-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Solicitar turno
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
