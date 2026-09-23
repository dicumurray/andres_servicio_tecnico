'use client'

import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <button
      type="button"
      aria-label={`Modo actual: ${resolvedTheme === 'dark' ? 'oscuro' : 'claro'}. Cambiar tema.`}
      className={cn(
        'inline-flex items-center justify-center rounded-md',
        'h-9 w-9 text-sm font-medium',
        'transition-colors duration-150',
        'hover:bg-muted hover:text-body',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        'bg-elevated border border-default text-muted',
      )}
      onClick={() => {
        if (theme === 'dark') setTheme('light')
        else if (theme === 'light') setTheme('system')
        else setTheme('dark')
      }}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">Cambiar tema</span>
    </button>
  )
}
