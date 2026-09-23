export function generateStaticParams() {
  return []
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import type { ServiceOption } from '@/types/service'
import { AppointmentForm } from '@/components/turnos/appointment-form'
import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'

export const metadata: Metadata = {
  title: 'Solicitar turno',
  description: 'Solicitá un turno para diagnóstico en Andrés Servicio Técnico. La Plata, Buenos Aires.',
}

export default async function TurnosPage() {
  // Cargar servicios para el formulario.
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('id, name, slug, estimated_duration')
    .eq('status', 'active')
    .order('sort_order', { ascending: true })

  const serviceOptions: ServiceOption[] = (services ?? []).map((s: any) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    duration: s.estimated_duration ?? null,
  }))

  return (
    <>
      <AppHeader />
      <main>
        <div className="px-4 py-12">
          <div className="mx-auto max-w-xl">
            <h1 className="text-3xl font-bold text-body mb-2">Solicitar turno</h1>
            <p className="text-base text-muted mb-8">
              Completá el formulario y te confirmaremos el horario disponibles.
            </p>

            <div className="rounded-lg border border-default bg-elevated p-6">
              <AppointmentForm services={serviceOptions} />
            </div>

            <div className="mt-6 rounded-lg border border-default bg-muted/50 p-4 text-sm text-muted">
              <p>
                <strong>¿No querés completar el formulario ahora?</strong>{' '}
                <a
                  href={`https://wa.me/+541123992527?text=Hola%20Andres,%20quiero%20consultar%20por%20una%20reparacion.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Escribinos por WhatsApp
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  )
}
