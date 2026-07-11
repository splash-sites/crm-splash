import type { Etapa } from '@/shared/types/lead'

export const ETAPA_LABELS: Record<Etapa, string> = {
  novo: 'Novo',
  em_contato: 'Em contato',
  visita_agendada: 'Visita agendada',
  proposta: 'Proposta',
  fechado: 'Fechado',
  perdido: 'Perdido',
}

export const ETAPA_BADGE_CLASSES: Record<Etapa, string> = {
  novo: 'bg-blue-300 text-blue-900',
  em_contato: 'bg-blue-200 text-blue-900',
  visita_agendada: 'bg-blue-200/60 text-blue-800',
  proposta: 'bg-blue-100 text-blue-800',
  fechado: 'bg-blue-100/60 text-blue-700',
  perdido: 'bg-blue-50 text-blue-700',
}

export const FAIXA_PRECO_LABELS: Record<string, string> = {
  ate_150k: 'Até R$ 150 mil',
  '150k_300k': 'R$ 150 mil - R$ 300 mil',
  '300k_500k': 'R$ 300 mil - R$ 500 mil',
  '500k_750k': 'R$ 500 mil - R$ 750 mil',
  '750k_1m': 'R$ 750 mil - R$ 1 milhão',
  '1m_1_5m': 'R$ 1 milhão - R$ 1,5 milhão',
  '1_5m_2m': 'R$ 1,5 milhão - R$ 2 milhões',
  '2m_3m': 'R$ 2 milhões - R$ 3 milhões',
  '3m_5m': 'R$ 3 milhões - R$ 5 milhões',
  '5m_10m': 'R$ 5 milhões - R$ 10 milhões',
  acima_10m: 'Acima de R$ 10 milhões',
}
