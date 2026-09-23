import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  variants: {
    variant: {
      default: 'bg-accent text-white hover:bg-accent-dark shadow-sm',
      secondary: 'bg-tech-600 text-tech-100 hover:bg-tech-500',
      ghost: 'text-body hover:bg-muted hover:text-body',
      link: 'text-accent underline-offset-4 hover:underline',
      destructive: 'bg-error text-white hover:bg-error/90',
      outline: 'border border-default bg-transparent text-body hover:bg-muted hover:text-body',
    },
    size: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

const inputVariants = tv({
  base: 'flex w-full rounded-md border bg-elevated px-3 py-2 text-sm text-body placeholder:text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    variant: {
      default: 'border-default hover:border-strong',
      error: 'border-error hover:border-error/80',
    },
    size: {
      sm: 'h-8',
      md: 'h-10',
      lg: 'h-12',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export type InputProps = React.ComponentPropsWithoutRef<'input'> &
  VariantProps<typeof inputVariants>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export type TextareaProps = React.ComponentPropsWithoutRef<'textarea'> &
  VariantProps<typeof inputVariants>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          inputVariants({ variant, size, className }),
          'min-h-[100px] resize-y',
        )}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export type SelectProps = React.ComponentPropsWithoutRef<'select'> &
  VariantProps<typeof inputVariants> & {
    label?: string
    error?: string
  }

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, children, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-body">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            inputVariants({ variant: error ? 'error' : variant, size, className }),
            error && 'border-error',
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1 text-xs text-error">{error}</p>
        )}
      </div>
    )
  },
)
Select.displayName = 'Select'

export type LabelProps = React.ComponentPropsWithoutRef<'label'>

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium text-body leading-none',
        className,
      )}
      {...props}
    />
  )
}

export type CardProps = React.ComponentPropsWithoutRef<'div'>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-default bg-elevated p-4 shadow-soft',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-4 pb-2', className)}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: React.ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      className={cn('text-lg font-semibold text-body leading-none tracking-tight', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={cn('text-sm text-muted', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('p-4 pt-2', className)}
      {...props}
    />
  )
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('flex items-center p-4 pt-0', className)}
      {...props}
    />
  )
}
