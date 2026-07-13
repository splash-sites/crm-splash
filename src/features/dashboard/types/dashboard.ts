import type { Etapa, Origem } from '@/shared/types/lead'

export type DashboardLead = {
  etapa: Etapa
  origem: Origem | null
  created_at: string
  proximo_contato_em: string
}

export type DashboardVisita = {
  status: 'agendada' | 'realizada' | 'cancelada'
  data_hora: string
}

export type Kpis = {
  leadsAtivos: number
  taxaConversao: number
  leadsVencidos: number
  visitasSemana: number
}

export type FunilItem = { etapa: Etapa; label: string; count: number }
export type OrigemItem = { origem: string; label: string; count: number }
export type TendenciaItem = { semana: string; count: number }
