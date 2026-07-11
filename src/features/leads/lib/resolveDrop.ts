import { ETAPAS, type Etapa, type Lead } from '@/shared/types/lead'

const POSICAO_GAP = 1000

export type DropResult = {
  etapa: Etapa
  posicao: number
}

export function resolveDrop(leads: Lead[], activeId: string, overId: string | null): DropResult | null {
  if (!overId || overId === activeId) return null

  const activeLead = leads.find((lead) => lead.id === activeId)
  if (!activeLead) return null

  const overLead = leads.find((lead) => lead.id === overId)
  const etapa: Etapa = overLead
    ? overLead.etapa
    : ((ETAPAS as readonly string[]).includes(overId) ? (overId as Etapa) : activeLead.etapa)

  const colunaLeads = leads
    .filter((lead) => lead.etapa === etapa && lead.id !== activeId)
    .sort((a, b) => a.posicao - b.posicao)

  let posicao: number
  if (overLead) {
    const overIndex = colunaLeads.findIndex((lead) => lead.id === overLead.id)
    const anterior = colunaLeads[overIndex - 1]
    posicao = anterior ? (anterior.posicao + overLead.posicao) / 2 : overLead.posicao - POSICAO_GAP
  } else {
    const ultimo = colunaLeads[colunaLeads.length - 1]
    posicao = ultimo ? ultimo.posicao + POSICAO_GAP : 0
  }

  return { etapa, posicao }
}
