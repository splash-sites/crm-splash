import { useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type'>

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className="relative">
      <Input type={visivel ? 'text' : 'password'} className={cn('pr-9', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-2.5 text-muted-foreground hover:text-foreground"
      >
        {visivel ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}
