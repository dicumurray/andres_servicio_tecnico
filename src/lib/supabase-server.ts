/**
 * Cliente Supabase para entorno servidor (Server Components, Server Actions).
 * Usa cookies para persistencia de sesión.
 *
 * @supabase/ssr v0.12 — compatible con Next.js 15+ cookies API.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies as nextCookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await nextCookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string): string | undefined {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options?: any) {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // Headers ya enviados.
          }
        },
        remove(name: string, options?: any) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch {
            // Igual.
          }
        },
      },
    },
  )
}

/**
 * Cliente con servicio role — solo para uso server-side administrativo.
 * NUNCA exponer al cliente.
 */
export async function createAdminClient() {
  const cookieStore = await nextCookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string): string | undefined {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options?: any) {
          try {
            cookieStore.set(name, value, options)
          } catch {}
        },
        remove(name: string, options?: any) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch {}
        },
      },
    },
  )
}
