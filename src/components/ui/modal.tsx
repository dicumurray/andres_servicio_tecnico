import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from './primitives'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full max-w-lg rounded-lg border border-default bg-elevated p-6 shadow-soft animate-fade-in',
          className,
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="mb-4">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-body"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id="modal-description"
                className="mt-1 text-sm text-muted"
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Body */}
        <div className="mb-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3">
            {footer}
          </div>
        )}

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'absolute top-3 right-3 rounded-md p-1.5 text-muted hover:text-body hover:bg-muted transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          )}
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
