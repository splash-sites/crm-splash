import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WhatsAppLink } from '@/shared/components/WhatsAppLink'
import { ETAPA_BADGE_CLASSES, ETAPA_LABELS } from '@/shared/lib/leadLabels'
import type { Lead } from '@/shared/types/lead'
import { diasSemUltimoContato } from '../lib/precisaFalarHoje'

const PRODUTO_LABELS: Record<string, string> = {
  software: 'Software',
  landing_page: 'Landing Page',
}

function formatTicket(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

type FollowUpItemProps = {
  lead: Lead
  agora: Date
  onContatado: (lead: Lead) => void
}

export function FollowUpItem({ lead, agora, onContatado }: FollowUpItemProps) {
  const [observacoesAbertas, setObservacoesAbertas] = useState(false)

  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{lead.nome_empresa}</p>
          <span
            className={cn(
              'shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium',
              ETAPA_BADGE_CLASSES[lead.etapa]
            )}
          >
            {ETAPA_LABELS[lead.etapa]}
          </span>
        </div>
        <p className="truncate text-sm text-muted-foreground">{lead.nome_contato}</p>
        <WhatsAppLink telefone={lead.telefone} className="inline-block text-sm text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          {diasSemUltimoContato(lead, agora)} dias sem contato
        </p>

        {(lead.produto_interesse || lead.ticket_estimado != null) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {lead.produto_interesse && (
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {PRODUTO_LABELS[lead.produto_interesse]}
              </span>
            )}
            {lead.ticket_estimado != null && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {formatTicket(lead.ticket_estimado)}
              </span>
            )}
          </div>
        )}

        {lead.observacoes && (
          <div className="mt-1.5 text-sm text-muted-foreground">
            <p className={observacoesAbertas ? 'whitespace-pre-wrap' : 'truncate'}>
              {lead.observacoes}
            </p>
            <button
              type="button"
              className="cursor-pointer text-xs underline underline-offset-2"
              onClick={() => setObservacoesAbertas((prev) => !prev)}
            >
              {observacoesAbertas ? 'ver menos' : 'ver mais'}
            </button>
          </div>
        )}
      </div>
      <Button type="button" onClick={() => onContatado(lead)}>
        Marcar como concluído
      </Button>
    </li>
  )
}
