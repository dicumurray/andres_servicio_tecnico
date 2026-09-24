import Link from 'next/link'
import type { PublicService } from '@/types/service'

interface HomeHeroProps {
  services: PublicService[]
}

export function HomeHero({ services }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-default px-4 py-14 sm:py-20 lg:py-24">
      {/* Fondo sutil — línea de PCB / trazado técnico */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Equipo en perspectiva — decorativo */}
      <div
        className="pointer-events-none absolute right-[-5%] top-1/2 hidden w-[360px] -translate-y-1/2 opacity-30 lg:block"
        aria-hidden="true"
        style={{ transform: 'translateY(-50%) perspective(800px) rotateY(25deg) rotateX(10deg)' }}
      >
        <svg
          viewBox="0 0 200 150"
          className="w-full h-auto drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base / teclado en perspectiva */}
          <path
            d="M20 95 L50 85 L150 85 L180 95 L180 105 L150 115 L50 115 L20 105 Z"
            fill="var(--color-tech-700)"
            stroke="var(--color-tech-500)"
            strokeWidth="1.5"
          />
          {/* Teclado - filas de teclas */}
          <rect x="42" y="89" width="116" height="6" rx="1" fill="var(--color-tech-600)" />
          <rect x="42" y="96" width="116" height="6" rx="1" fill="var(--color-tech-600)" />
          <rect x="42" y="103" width="116" height="6" rx="1" fill="var(--color-tech-600)" />
          {/* Trackpad */}
          <rect x="75" y="105" width="50" height="7" rx="2" fill="var(--color-tech-500)" />
          {/* Pantalla en perspectiva superior */}
          <path
            d="M45 85 L55 50 L145 50 L155 85 Z"
            fill="var(--color-tech-800)"
            stroke="var(--color-tech-400)"
            strokeWidth="1.5"
          />
          {/* Brillo de pantalla */}
          <path
            d="M55 50 L145 50 L145 65 L55 65 Z"
            fill="var(--color-accent)"
            opacity="0.1"
          />
          {/* Hopkins/Extensión */}
          <rect x="120" y="92" width="8" height="20" rx="1" fill="var(--color-tech-500)" />
          {/* Webcam */}
          <circle cx="100" cy="55" r="2" fill="var(--color-tech-400)" />
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
        {/* Mark */}
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/20">
          <svg
            viewBox="0 0 32 32"
            className="h-8 w-8 text-accent"
            fill="none"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="6" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="1.5" />
            <line x1="16" y1="6" x2="16" y2="26" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Servicio técnico en La Plata
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-body sm:text-5xl lg:text-6xl">
          Reparar bien empieza por diagnosticar mejor.
        </h1>

        <p className="mt-5 text-lg font-medium text-muted sm:text-xl">
          Andrés Servicio Técnico
        </p>

        <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">
          Reparamos celulares y electrónica con un proceso claro: revisamos la falla,
          presupuestamos antes de avanzar y probamos el equipo antes de entregarlo.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
          <Link
            href="/turnos"
            className="inline-flex items-center justify-center rounded-md border border-accent bg-accent/10 h-11 px-6 text-sm font-semibold text-body hover:bg-accent hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Solicitar diagnóstico
          </Link>
          <Link
            href="/servicios"
            className="inline-flex items-center justify-center rounded-md h-11 px-6 text-sm font-medium bg-elevated text-body border border-default hover:bg-muted hover:text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Ver servicios
          </Link>
        </div>

        {/* WhatsApp */}
        <p className="mt-5 text-sm text-muted">
          O escribinos por{' '}
          <a
            href="https://wa.me/541123992527?text=Hola%20Andres,%20quiero%20consultar%20por%20una%20reparacion."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-accent bg-accent/10 h-10 px-5 text-sm font-semibold text-body hover:bg-accent hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            WhatsApp
          </a>
        </p>
      </div>

      <div className="relative hidden rounded-2xl border border-default bg-elevated/80 p-6 shadow-soft backdrop-blur-sm lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Trabajamos con método</p>
        <div className="mt-6 space-y-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
            <div>
              <p className="text-sm font-semibold text-body">Diagnóstico antes de reparar</p>
              <p className="mt-1 text-sm text-muted">Te explicamos qué encontramos y por qué.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
            <div>
              <p className="text-sm font-semibold text-body">Presupuesto claro</p>
              <p className="mt-1 text-sm text-muted">Aprobás el trabajo antes de que avancemos.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
            <div>
              <p className="text-sm font-semibold text-body">Prueba y garantía</p>
              <p className="mt-1 text-sm text-muted">Entregamos el equipo funcionando y verificado.</p>
            </div>
          </div>
        </div>
        <div className="mt-7 border-t border-default pt-4 text-xs text-muted">
          {services.length > 0 ? `${services.length} servicios disponibles` : 'Atención personalizada'}
          <span className="px-2 text-accent">·</span> La Plata, Buenos Aires
        </div>
      </div>
      </div>
    </section>
  )
}
