'use client'

import { useState, createContext, useContext, useEffect, useCallback, type ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: ResolvedTheme
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
}: {
  children: ReactNode
  attribute?: 'class' | 'data-theme'
  defaultTheme?: Theme
  enableSystem?: boolean
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark')

  const applyResolvedTheme = useCallback((resolved: ResolvedTheme) => {
    const root = document.documentElement

    if (attribute === 'class') {
      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
    } else {
      root.setAttribute('data-theme', resolved)
    }
  }, [attribute])

  useEffect(() => {
    if (!enableSystem) {
      const stored = localStorage.getItem('theme') as Theme | null
      const initial = stored ?? defaultTheme
      setTheme(initial)
      setResolvedTheme(initial === 'system' ? 'dark' : initial as ResolvedTheme)
      applyResolvedTheme(resolvedTheme)
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const systemIsDark = mediaQuery.matches
    const stored = localStorage.getItem('theme') as Theme | null
    const initial = stored ?? defaultTheme

    setTheme(initial)
    const resolved = initial === 'system' ? (systemIsDark ? 'dark' : 'light') : (initial as ResolvedTheme)
    setResolvedTheme(resolved)
    applyResolvedTheme(resolved)

    const handleChange = () => {
      const systemNowIsDark = mediaQuery.matches
      if (theme === 'system') {
        const newResolved = systemNowIsDark ? 'dark' : 'light'
        setResolvedTheme(newResolved)
        applyResolvedTheme(newResolved)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [enableSystem, defaultTheme])

  useEffect(() => {
    applyResolvedTheme(resolvedTheme)
  }, [resolvedTheme, applyResolvedTheme])

  const value: ThemeProviderState = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem('theme', newTheme)
      setTheme(newTheme)

      if (newTheme === 'system' && enableSystem) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const resolved = mediaQuery.matches ? 'dark' : 'light'
        setResolvedTheme(resolved)
        applyResolvedTheme(resolved)
      } else {
        const resolved: ResolvedTheme = newTheme as ResolvedTheme
        setResolvedTheme(resolved)
        applyResolvedTheme(resolved)
      }
    },
    resolvedTheme,
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
