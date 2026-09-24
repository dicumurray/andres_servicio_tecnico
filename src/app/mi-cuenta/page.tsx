'use client'

import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createSupabaseWebClient } from '@/lib/supabase-web'
import { Button } from '@/components/ui/primitives'

export default function MiCuentaPage() {
  const router = useRouter()
  const supabase = createSupabaseWebClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      if (!user) {
        router.push('/admin/login')
      }
    }
    checkUser()
  }, [supabase, router])

  if (loading) {
    return (
      <>
        <AppHeader />
        <main className="min-h-screen bg-body px-4 py-12">
          <div className="mx-auto max-w-md">
            <div className="rounded-lg border border-default bg-elevated p-6 text-center">
              <p className="text-muted">Cargando...</p>
            </div>
          </div>
        </main>
        <AppFooter />
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-bold text-body mb-2">Mi cuenta</h1>
          <p className="text-base text-muted mb-8">
            Panel de cliente.
          </p>

          <div className="rounded-lg border border-default bg-elevated p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 ring-1 ring-accent/20">
                <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-body">Usuario</h2>
                <p className="text-sm text-muted">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-default bg-elevated p-6">
            <h2 className="text-lg font-semibold text-body mb-4">Tu historial</h2>
            <p className="text-sm text-muted mb-4">
              Aquí podrás ver tus turnos y reparaciones.
            </p>
            <div className="rounded-md border border-default bg-muted/50 p-4 text-center text-muted text-sm">
              Próximamente disponibles.
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href="/turnos"
              className="flex-1 inline-flex items-center justify-center rounded-md border border-accent bg-elevated h-11 px-5 text-sm font-medium text-accent dark:text-accent-light hover:bg-accent hover:text-white dark:hover:bg-accent-light transition-colors"
            >
              Solicitar nuevo turno
            </Link>
            <Link
              href="/servicios"
              className="flex-1 inline-flex items-center justify-center rounded-md h-11 px-5 text-sm font-medium bg-elevated text-body border border-default hover:bg-muted hover:text-body transition-colors"
            >
              Ver servicios
            </Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  )
}