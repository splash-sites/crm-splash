export const VISITA_STATUS = ['agendada', 'realizada', 'cancelada'] as const
export type VisitaStatus = (typeof VISITA_STATUS)[number]

export const VISITA_STATUS_LABELS: Record<VisitaStatus, string> = {
  agendada: 'Agendada',
  realizada: 'Realizada',
  cancelada: 'Cancelada',
}

export type Visita = {
  id: string
  lead_id: string
  data_hora: string
  status: VisitaStatus
  lead_nome: string
  lead_telefone: string
}

export type LeadOption = {
  id: string
  nome: string
  telefone: string
}
