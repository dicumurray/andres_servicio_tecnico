import { updateSession } from '@/lib/supabase-middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const response = await updateSession(request)

  const isAdmin = request.nextUrl.pathname.startsWith('/admin')
  const isAdminAuthPage =
    request.nextUrl.pathname === '/admin/login' ||
    request.nextUrl.pathname === '/admin/register'
  const isClientArea = request.nextUrl.pathname.startsWith('/mi-cuenta')

  if ((isAdmin && !isAdminAuthPage) || isClientArea) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const { createServerClient } = await import('@supabase/ssr')
    const cookieStore = request.cookies

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set() {},
          remove() {},
        },
      },
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const redirectUrl = new URL('/admin/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    if (isAdmin && !isAdminAuthPage) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', user.id)
        .maybeSingle()
      const profile = profileData as { role: string; status: string } | null

      const isManager =
        profile?.status === 'active' &&
        (profile.role === 'admin' || profile.role === 'technician')

      if (!isManager) {
        return NextResponse.redirect(new URL('/admin/login?unauthorized=1', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
