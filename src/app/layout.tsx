import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Andrés Servicio Técnico',
    template: '%s | Andrés Servicio Técnico',
  },
  description: 'Diagnóstico preciso. Reparaciones con criterio. Servicio técnico de electrónica y celulares en La Plata, Buenos Aires.',
  keywords: [
    'servicio técnico La Plata',
    'reparación celulares La Plata',
    'reparación electrónica La Plata',
    'diagnóstico electrónico La Plata',
    'reparación hardware La Plata',
  ],
  authors: [{ name: 'Andrés Servicio Técnico' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Andrés Servicio Técnico',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR" className={inter.variable} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
