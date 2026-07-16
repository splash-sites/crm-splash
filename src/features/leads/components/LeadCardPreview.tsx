import { GripVertical } from 'lucide-react'
import { maskTelefone } from '@/shared/lib/telefoneMask'
import type { Lead } from '@/shared/types/lead'

export function LeadCardPreview({ lead }: { lead: Lead }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-card p-2.5 text-sm text-card-foreground shadow-lg">
      <div className="flex items-start gap-1.5">
        <span className="mt-0.5 text-muted-foreground">
          <GripVertical className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="block truncate font-medium">{lead.nome_empresa}</span>
          <span className="block truncate text-muted-foreground">{lead.nome_contato}</span>
          <span className="block text-muted-foreground">{maskTelefone(lead.telefone)}</span>
        </div>
      </div>
    </div>
  )
}
