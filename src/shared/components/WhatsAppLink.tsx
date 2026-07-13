import { cn } from '@/lib/utils'
import { maskTelefone } from '@/shared/lib/telefoneMask'
import { buildWhatsAppLink } from '@/shared/lib/whatsapp'

type WhatsAppLinkProps = {
  telefone: string
  className?: string
}

export function WhatsAppLink({ telefone, className }: WhatsAppLinkProps) {
  return (
    <a
      href={buildWhatsAppLink(telefone)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      aria-label={`Abrir conversa no WhatsApp com ${maskTelefone(telefone)}`}
      className={cn('cursor-pointer hover:underline', className)}
    >
      {maskTelefone(telefone)}
    </a>
  )
}
