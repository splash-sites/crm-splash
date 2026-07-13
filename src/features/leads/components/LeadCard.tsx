import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WhatsAppLink } from '@/shared/components/WhatsAppLink'
import type { Lead } from '@/shared/types/lead'

type LeadCardProps = {
  lead: Lead
  onDelete: (id: string) => void
  onEdit: (lead: Lead) => void
}

export function LeadCard({ lead, onDelete, onEdit }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`lead-card-${lead.id}`}
      className={cn(
        'flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-card p-2.5 text-sm text-card-foreground shadow-sm',
        isDragging && 'opacity-40'
      )}
      data-dragging={isDragging || undefined}
    >
      <div className="flex items-start gap-1.5">
        <button
          type="button"
          {...listeners}
          {...attributes}
          aria-label="Arrastar lead"
          className="mt-0.5 cursor-grab rounded text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <GripVertical className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            className="block w-full cursor-pointer rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label={`Editar ${lead.nome}`}
            title={lead.nome}
            onClick={() => onEdit(lead)}
          >
            <span className="block truncate font-medium">{lead.nome}</span>
          </button>
          <WhatsAppLink
            telefone={lead.telefone}
            className="block text-muted-foreground hover:text-foreground"
          />
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="self-end text-destructive hover:bg-destructive/10 hover:text-destructive"
            />
          }
        >
          Excluir
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso remove {lead.nome} e todo o histórico associado. Não pode ser desfeito.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => onDelete(lead.id)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
