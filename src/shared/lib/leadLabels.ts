import type { Etapa } from '@/shared/types/lead'

export const ETAPA_LABELS: Record<Etapa, string> = {
  novo: 'Novo',
  contactado: 'Contactado',
  qualificando: 'Qualificando',
  proposta: 'Proposta',
  negociacao: 'Negociação',
  fechado: 'Fechado',
}

export const ETAPA_BADGE_CLASSES: Record<Etapa, string> = {
  novo: 'bg-blue-300 text-blue-900',
  contactado: 'bg-blue-300/70 text-blue-900',
  qualificando: 'bg-blue-200 text-blue-900',
  proposta: 'bg-blue-200/60 text-blue-800',
  negociacao: 'bg-blue-100 text-blue-800',
  fechado: 'bg-blue-100/60 text-blue-700',
}
