export const ETAPAS = [
  'novo',
  'em_contato',
  'visita_agendada',
  'proposta',
  'fechado',
  'perdido',
] as const

export type Etapa = (typeof ETAPAS)[number]

export const ORIGENS = ['instagram', 'indicacao', 'portal', 'placa', 'whatsapp', 'outro'] as const
export type Origem = (typeof ORIGENS)[number]

export const TIPOS_IMOVEL = ['apartamento', 'casa', 'terreno', 'comercial'] as const
export type TipoImovel = (typeof TIPOS_IMOVEL)[number]

export const FINALIDADES = ['comprar', 'alugar', 'investir'] as const
export type Finalidade = (typeof FINALIDADES)[number]

export const FAIXAS_PRECO = [
  'ate_150k',
  '150k_300k',
  '300k_500k',
  '500k_750k',
  '750k_1m',
  '1m_1_5m',
  '1_5m_2m',
  '2m_3m',
  '3m_5m',
  '5m_10m',
  'acima_10m',
] as const
export type FaixaPreco = (typeof FAIXAS_PRECO)[number]

export type Bairro = {
  id: string
  corretor_id: string
  nome: string
  created_at: string
}

export type Lead = {
  id: string
  corretor_id: string
  nome: string
  telefone: string
  email: string | null
  origem: Origem | null
  tipo_imovel: TipoImovel | null
  finalidade: Finalidade | null
  bairros: string[]
  faixa_preco: FaixaPreco | null
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
  nome: string
  telefone: string
  email?: string | null
  origem?: Origem | null
  tipo_imovel?: TipoImovel | null
  finalidade?: Finalidade | null
  bairros?: string[]
  faixa_preco?: FaixaPreco | null
  etapa?: Etapa
  dias_para_contato?: number
  observacoes?: string | null
}
