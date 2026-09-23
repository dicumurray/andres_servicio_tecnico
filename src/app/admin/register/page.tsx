'use client'

import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { createSupabaseWebClient } from '@/lib/supabase-web'
import { Button, Input, Label } from '@/components/ui/primitives'
import { SubmitButton } from '@/components/ui/submit-button'
import { Alert } from '@/components/ui/alert'

export default function AdminRegisterPage() {
  const supabase = createSupabaseWebClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    startTransition(async () => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
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
              <h2 className="text-lg font-semibold text-success">Cuenta creada</h2>
              <p className="mt-2 text-sm text-body">Revisá tu email para confirmar la cuenta.</p>
              <div className="mt-4">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center justify-center rounded-md h-10 px-5 text-sm font-medium bg-accent text-white hover:bg-accent-dark transition-colors"
                >
                  Ir al inicio de sesión
                </Link>
              </div>
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
              <h1 className="text-xl font-semibold text-body">Crear cuenta</h1>
              <p className="text-sm text-muted mt-1">Panel de administración</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <Alert variant="error" className="mb-4">
                  {error}
                </Alert>
              )}

              <div>
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre"
                  className="mt-1.5"
                  required
                />
              </div>

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
                  placeholder="Mínimo 6 caracteres"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetí tu contraseña"
                  className="mt-1.5"
                  required
                />
              </div>

              <SubmitButton type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
              </SubmitButton>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted">
                Ya tenés cuenta?{' '}
                <Link href="/admin/login" className="text-accent hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  )
}