export const ETAPAS = [
  'novo',
  'contactado',
  'qualificando',
  'proposta',
  'negociacao',
  'fechado',
] as const

export type Etapa = (typeof ETAPAS)[number]

export const ORIGENS = ['instagram', 'indicacao', 'whatsapp', 'prospeccao'] as const
export type Origem = (typeof ORIGENS)[number]

export const PRODUTOS_INTERESSE = ['software', 'landing_page'] as const
export type ProdutoInteresse = (typeof PRODUTOS_INTERESSE)[number]

export type Lead = {
  id: string
  corretor_id: string
  nome_empresa: string
  nome_contato: string
  telefone: string
  email: string | null
  origem: Origem | null
  produto_interesse: ProdutoInteresse | null
  ticket_estimado: number | null
  etapa: Etapa
  posicao: number
  motivo_perda: string | null
  ultima_interacao: string | null
  dias_para_contato: number
  proximo_contato_em: string
  observacoes: string | null
  created_at: string
  updated_at: string
}

export type LeadInput = {
  nome_empresa: string
  nome_contato: string
  telefone: string
  email?: string | null
  origem?: Origem | null
  produto_interesse?: ProdutoInteresse | null
  ticket_estimado?: number | null
  etapa?: Etapa
  dias_para_contato?: number
  observacoes?: string | null
}
