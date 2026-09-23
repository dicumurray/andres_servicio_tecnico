/**
 * Type declarations para @supabase/ssr — compatibilidad con el API de cookies de Next.js.
 * Estos son tipos de runtime-safe que el type checker de Next.js necesita para compilar.
 */

declare module '@supabase/ssr' {
  export interface CookieOptions {
    secure?: boolean
    path?: string
    domain?: string
    maxAge?: number
    httpOnly?: boolean
    sameSite?: 'lax' | 'strict' | 'none'
  }

  export interface CookieMethodsServer {
    get(name: string): string | undefined
    set(name: string, value: string, options?: CookieOptions): void
    remove(name: string, options?: CookieOptions): void
  }

  export interface SupabaseClientOptions<T extends object> {
    auth?: {
      autoRefreshToken?: boolean
      persistSession?: boolean
      detectSessionInUrl?: boolean
    }
    helpers?: {
      createServerComponentClient?: () => void
    }
    cookies?: {
      get?: (name: string) => string | undefined
      set?: (name: string, value: string, options?: CookieOptions) => void
      remove?: (name: string, options?: CookieOptions) => void
    }
  }

  export function createServerClient<T extends object = object>(
    url: string,
    key: string,
    options?: SupabaseClientOptions<T>
  ): import('@supabase/supabase-js').SupabaseClient<T>
}
