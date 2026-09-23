/**
 * Providers de aplicación — modo oscuro + Contextos futuros.
 */

'use client'

import { useEffect, type ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  )
}
