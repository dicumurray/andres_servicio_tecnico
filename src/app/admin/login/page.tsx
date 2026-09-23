'use client'

import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { createSupabaseWebClient } from '@/lib/supabase-web'
import { Button, Input, Label } from '@/components/ui/primitives'
import { SubmitButton } from '@/components/ui/submit-button'
import { Alert } from '@/components/ui/alert'

export default function AdminLoginPage() {
  const supabase = createSupabaseWebClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    })
  }

  if (success) {
    return (
      <>
        <AppHeader />
        <main className="min-h-screen bg-body px-4 py-12">
          <div className="mx-auto max-w-md">
            <div className="rounded-lg border border-success/30 bg-success/10 p-6 text-center">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/20">
                <svg className="h-6 w-6 text-success" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-success">Sesión iniciada</h2>
              <p className="mt-2 text-sm text-body">Redirigiendo al panel...</p>
            </div>
          </div>
        </main>
        <AppFooter />
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-md">
          <div className="rounded-lg border border-default bg-elevated p-6">
            <div className="text-center mb-6">
              <div className="mb-3 inline-flex items-center justify-center w-10 h-10 rounded-md bg-accent/10 ring-1 ring-accent/20">
                <span className="text-accent font-bold text-sm">AST</span>
              </div>
              <h1 className="text-xl font-semibold text-body">Iniciar sesión</h1>
              <p className="text-sm text-muted mt-1">Panel de administración</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="error" className="mb-4">
                  {error}
                </Alert>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="mt-1.5"
                  required
                />
              </div>

              <SubmitButton type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Iniciando...' : 'Iniciar sesión'}
              </SubmitButton>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted">
                No tenés cuenta?{' '}
                <Link href="/admin/register" className="text-accent hover:underline">
                  Crear una cuenta
                </Link>
              </p>
            </div>

            <div className="mt-6 rounded-md border border-default bg-muted/50 p-4 text-sm text-muted">
              <p>
                <strong className="text-body">¿Necesitás ayuda?</strong>{' '}
                <a
                  href={`https://wa.me/+541123992527?text=Hola%20Andres,%20necesito%20ayuda%20con%20el%20acceso.%20`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Contactanos por WhatsApp
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