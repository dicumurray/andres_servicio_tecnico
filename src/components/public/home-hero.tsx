import Link from 'next/link'
import type { PublicService } from '@/types/service'

interface HomeHeroProps {
  services: PublicService[]
}

export function HomeHero({ services }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:py-24">
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

      {/* MacBook en perspectiva — decorativo */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[180px] opacity-20 pointer-events-none"
        aria-hidden="true"
        style={{
          transform: 'translateY(-50%) perspective(800px) rotateY(25deg) rotateX(10deg)',
        }}
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

      <div className="mx-auto max-w-3xl text-center">
        {/* Mark */}
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 ring-1 ring-accent/20">
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

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-body">
          Andrés Servicio Técnico
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-muted font-medium">
          Diagnóstico preciso. Reparaciones con criterio.
        </p>

        <p className="mt-4 text-base text-muted max-w-xl mx-auto">
          Servicio técnico de electrónica y celulares en La Plata, Buenos Aires.
          Primero diagnosticamos. Después reparamos.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/turnos"
            className="inline-flex items-center justify-center rounded-md h-11 px-6 text-sm font-semibold bg-accent text-white hover:bg-accent-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Solicitar turno
          </Link>
          <Link
            href="/servicios"
            className="inline-flex items-center justify-center rounded-md h-11 px-6 text-sm font-medium bg-elevated text-body border border-default hover:bg-muted hover:text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Ver servicios
          </Link>
        </div>

        {/* WhatsApp */}
        <p className="mt-6 text-sm text-muted">
          O escribinos por{' '}
          <a
            href={`https://wa.me/+541****2527?text=Hola%20Andres,%20quiero%20consultar%20por%20una%20reparacion.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md h-10 px-5 text-sm font-semibold bg-accent text-white hover:bg-accent-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            WhatsApp
          </a>
        </p>
      </div>

      {/* Flecha hacia servicios */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/servicios"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-body transition-colors animate-fade-in"
        >
          Ver servicios
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
