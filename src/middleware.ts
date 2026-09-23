import { updateSession } from '@/lib/supabase-middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Actualizar sesión para todas las rutas.
  const response = await updateSession(request)

  // Rutas públicas que no necesitan protección extra.
  const publicPaths = [
    '/',
    '/servicios',
    '/servicios/',
    '/reparaciones',
    '/reparaciones/',
    '/proyectos',
    '/proyectos/',
    '/blog',
    '/blog/',
    '/turnos',
    '/contacto',
    '/nosotros',
    '/estado',
    '/admin/login',
    '/admin/register',
  ]

  const isPublic = publicPaths.some(p => request.nextUrl.pathname.startsWith(p))
  const isAdmin = request.nextUrl.pathname.startsWith('/admin')
  const isClientArea = request.nextUrl.pathname.startsWith('/mi-cuenta')

  if (isAdmin || isClientArea) {
    // Verificar que haya sesión activa.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Crear cliente mínimo solo para check de sesión.
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
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - sitemap.xml, robots.txt (SEO)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
