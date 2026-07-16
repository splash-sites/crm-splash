import type { Lead } from '@/shared/types/lead'

const ETAPAS_SEM_FOLLOWUP = new Set(['fechado'])

export function precisaFalarHoje(lead: Lead, agora: Date): boolean {
  if (ETAPAS_SEM_FOLLOWUP.has(lead.etapa)) return false
  return new Date(lead.proximo_contato_em) <= agora
}

export function diasSemUltimoContato(lead: Lead, agora: Date): number {
  const base = new Date(lead.ultima_interacao ?? lead.created_at)
  const diffMs = agora.getTime() - base.getTime()
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}
