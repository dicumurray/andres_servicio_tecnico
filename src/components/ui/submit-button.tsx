import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SubmitButton({ children, className, disabled, ...props }: React.ComponentPropsWithoutRef<'button'>) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-md h-11 px-6 text-sm font-semibold bg-accent text-white transition-all hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Procesando...
        </>
      ) : (
        children
      )}
    </button>
  )
}
