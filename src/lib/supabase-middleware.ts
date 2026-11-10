/**
 * Middleware de autenticación.
 * Usa @supabase/ssr para mantener la sesión via cookies.
 *
 * @supabase/ssr v0.12 — usa CookieMethodsServerDeprecated para get/set/remove.
 * Se usan tipos `any` para evitar errores de type-checking del framework.
 */

import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database, Profile } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

type StaffProfile = Pick<Profile, 'role' | 'status' | 'email' | 'full_name' | 'phone'>
type AuthResult = { user: User; profile: StaffProfile }

function createServerSupabase(request: NextRequest, response?: NextResponse) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string): string | undefined {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options?: CookieOptions) {
        request.cookies.set(name, value)
        response?.cookies.set(name, value, options)
      },
      remove(name: string, options?: CookieOptions) {
        request.cookies.set(name, '')
        response?.cookies.set(name, '', { ...options, maxAge: 0 })
      },
    },
  })
}

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  const supabase = createServerSupabase(request, supabaseResponse)

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

  const { data: profileData } = await supabase
    .from('profiles')
    .select('role, status, email, full_name, phone')
    .eq('id', user.id)
    .single()
  const profile = profileData as StaffProfile | null

  // profile puede ser null — en ese caso redirigir al login.
  // Usamos as any para evitar errores de tipado cuando el schema aún no existe.
  if (!profile || profile.status !== 'active' || !profile.role) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  return { user, profile }
}

export async function requireAdmin(request: NextRequest) {
  const result: AuthResult | NextResponse = await requireAuth(request)
  if (result instanceof NextResponse) return result

  if (
    result.profile.status !== 'active' ||
    result.profile.role !== 'admin'
  ) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return result
}
