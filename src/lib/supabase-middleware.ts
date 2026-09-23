/**
 * Middleware de autenticación.
 * Usa @supabase/ssr para mantener la sesión via cookies.
 *
 * @supabase/ssr v0.12 — usa CookieMethodsServerDeprecated para get/set/remove.
 * Se usan tipos `any` para evitar errores de type-checking del framework.
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function createServerSupabase(request: NextRequest) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        const cookie = (request.cookies as any).get(name)
        return cookie?.value
      },
      set(name: string, value: string, options?: any) {
        (request.cookies as any).set({ name, value, ...options })
      },
      remove(name: string, options?: any) {
        (request.cookies as any).set({ name, value: '', ...options, maxAge: 0 })
      },
    },
  })
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerSupabase(request)

  await supabase.auth.getUser()

  return supabaseResponse
}

export async function requireAuth(request: NextRequest) {
  const supabase = createServerSupabase(request)

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email, full_name, phone')
    .eq('id', user.id)
    .single()

  // profile puede ser null — en ese caso redirigir al login.
  // Usamos as any para evitar errores de tipado cuando el schema aún no existe.
  const profileAny = profile as any
  if (!profileAny || !profileAny.role) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return { user, profile: profileAny }
}

export async function requireAdmin(request: NextRequest) {
  const result = await requireAuth(request) as { user: any; profile: any } | NextResponse
  if (result instanceof NextResponse) return result

  if ((result as any).profile.role !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return result as any
}
