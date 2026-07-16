import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'
import { ETAPA_LABELS } from '@/shared/lib/leadLabels'
import type { Etapa, Lead } from '@/shared/types/lead'
import { LeadCard } from './LeadCard'

type KanbanColumnProps = {
  etapa: Etapa
  leads: Lead[]
  onDeleteLead: (id: string) => void
  onEditLead: (lead: Lead) => void
}

export function KanbanColumn({ etapa, leads, onDeleteLead, onEditLead }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: etapa })

  return (
    <div
      ref={setNodeRef}
      data-testid={`kanban-column-${etapa}`}
      className={cn(
        'flex min-h-28 min-w-0 flex-col gap-2 rounded-xl bg-muted p-2.5 transition-colors',
        isOver && 'bg-accent'
      )}
    >
      <h2 className="px-1 text-sm font-medium opacity-80">
        {ETAPA_LABELS[etapa]} ({leads.length})
      </h2>
      <SortableContext items={leads.map((lead) => lead.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onDelete={onDeleteLead} onEdit={onEditLead} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
