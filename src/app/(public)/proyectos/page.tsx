import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'

export const metadata = {
  title: 'Proyectos',
  description: 'Proyectos de Andrés Servicio Técnico.',
}

export default function ProyectosPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-body mb-2">Proyectos</h1>
          <p className="text-base text-muted mb-8">
            No hay proyectos publicados.
          </p>
        </div>
      </main>
      <AppFooter />
    </>
  )
}