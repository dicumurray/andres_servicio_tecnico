/**
 * Cliente Supabase para entorno cliente (Browser).
 * Usa el SDK base de Supabase (sin cookies) — la sesión se maneja con el SDK cliente.
 */

import { createClient } from '@supabase/supabase-js'
import { useRef } from 'react'

export function useSupabaseClient() {
  const clientRef = useRef<ReturnType<typeof createClient> | null>(null)

  if (!clientRef.current) {
    clientRef.current = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return clientRef.current
}

/**
 * Cliente estático para usos puntuales fuera de React (edge, scripts).
 */
export function createSupabaseWebClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
