/**
 * Cliente Supabase para entorno servidor (Server Components, Server Actions).
 * Usa cookies para persistencia de sesión.
 *
 * @supabase/ssr v0.12 — compatible con Next.js 15+ cookies API.
 */

import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
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

export function createPublicClient<Schema extends object = object>() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    throw new Error('Faltan las variables públicas de entorno para conectar con Supabase.')
  }

  return createSupabaseClient<Schema>(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}

/**
 * Cliente con servicio role — solo para uso server-side administrativo.
 * NUNCA exponer al cliente.
 */
export function createAdminClient<Schema extends object = object>() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Faltan las variables de entorno para conectar con Supabase como administrador.')
  }

  return createSupabaseClient<Schema>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}
