import { useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import { useLeads } from '../hooks/useLeads'
import { resolveDrop } from '../lib/resolveDrop'
import { ETAPAS, type Lead } from '@/shared/types/lead'
import { KanbanColumn } from './KanbanColumn'
import { LeadCardPreview } from './LeadCardPreview'
import { LeadFormDialog } from './LeadFormDialog'

export function KanbanBoard() {
  const { leads, loading, error, addLead, editLead, reorderLead, removeLead } = useLeads()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [activeLead, setActiveLead] = useState<Lead | null>(null)

  function handleDragStart(event: DragStartEvent) {
    setActiveLead(leads.find((lead) => lead.id === event.active.id) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLead(null)
    const result = resolveDrop(leads, String(event.active.id), event.over ? String(event.over.id) : null)
    if (result) reorderLead(String(event.active.id), result.etapa, result.posicao)
  }

  function openCreateDialog() {
    setEditingLead(null)
    setDialogOpen(true)
  }

  function openEditDialog(lead: Lead) {
    setEditingLead(lead)
    setDialogOpen(true)
  }

  if (loading) return <p className="p-4 text-muted-foreground">Carregando leads...</p>

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Funil de leads</h1>
        <Button onClick={openCreateDialog}>Novo Lead</Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto">
          {ETAPAS.map((etapa) => (
            <KanbanColumn
              key={etapa}
              etapa={etapa}
              leads={leads
                .filter((lead) => lead.etapa === etapa)
                .sort((a, b) => a.posicao - b.posicao)}
              onDeleteLead={removeLead}
              onEditLead={openEditDialog}
            />
          ))}
        </div>
        <DragOverlay>{activeLead && <LeadCardPreview lead={activeLead} />}</DragOverlay>
      </DndContext>
      <LeadFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        lead={editingLead}
        onSubmit={(input) => (editingLead ? editLead(editingLead.id, input) : addLead(input))}
      />
    </div>
  )
}
