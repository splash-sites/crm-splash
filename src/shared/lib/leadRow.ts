import type { Lead } from '@/shared/types/lead'

export type LeadRow = Omit<Lead, 'bairros'> & {
  lead_bairros: { bairros: { nome: string } }[]
}

export function toLead(row: LeadRow): Lead {
  const { lead_bairros, ...rest } = row
  return { ...rest, bairros: lead_bairros.map((lb) => lb.bairros.nome) }
}
