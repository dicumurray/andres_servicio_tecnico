import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface AlertProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

const alertVariants = {
  default: 'border-default bg-muted/50 text-body',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  error: 'border-error/30 bg-error/10 text-error',
}

export function Alert({ children, variant = 'default', className }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-md border p-4 text-sm flex gap-3',
        alertVariants[variant],
        className,
      )}
      role="alert"
    >
      {variant === 'success' && (
        <Check className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
      )}
      {children}
    </div>
  )
}

Alert.displayName = 'Alert'
