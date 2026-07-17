import type { Etapa, Origem, ProdutoInteresse } from '@/shared/types/lead'

export type DashboardLead = {
  id: string
  etapa: Etapa
  origem: Origem | null
  produto_interesse: ProdutoInteresse | null
  ticket_estimado: number | null
  created_at: string
  updated_at: string
  proximo_contato_em: string
}

export type EtapaHistoricoRow = {
  lead_id: string
  etapa: Etapa
  entrou_em: string
}

export type Kpis = {
  leadsAtivos: number
  taxaConversao: number
  leadsVencidos: number
  leadsSemInteracao: number
  pipelineAberto: number
  fechadoNoMes: number
  ticketMedio: number
  tempoMedioFechar: number
}

export type FunilItem = { etapa: Etapa; label: string; count: number }
export type OrigemItem = { origem: string; label: string; count: number }
export type ProdutoItem = { produto: string; label: string; count: number }
export type TempoEtapaItem = { etapa: Etapa; label: string; diasMedio: number }
