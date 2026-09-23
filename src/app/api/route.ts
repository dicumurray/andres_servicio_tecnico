import { NextResponse } from 'next/server'

// Redirigir /api a la raíz o a la documentación.
export async function GET() {
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'))
}
