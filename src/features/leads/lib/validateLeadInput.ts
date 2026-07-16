import { TELEFONE_DIGITS } from '@/shared/lib/telefoneMask'
import type { LeadInput } from '@/shared/types/lead'

export type LeadInputErrors = Partial<Record<keyof LeadInput, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const LEAD_LIMITS = {
  nomeEmpresa: { min: 2, max: 100 },
  nomeContato: { min: 2, max: 100 },
  telefone: { digits: TELEFONE_DIGITS },
  email: { max: 255 },
  diasParaContato: { min: 1, max: 365 },
  observacoes: { max: 1000 },
  ticketEstimado: { min: 0 },
} as const

export function validateLeadInput(input: LeadInput): LeadInputErrors {
  const errors: LeadInputErrors = {}

  const nomeEmpresa = input.nome_empresa.trim()
  if (nomeEmpresa.length < LEAD_LIMITS.nomeEmpresa.min) {
    errors.nome_empresa = `Nome da empresa precisa ter pelo menos ${LEAD_LIMITS.nomeEmpresa.min} caracteres`
  } else if (nomeEmpresa.length > LEAD_LIMITS.nomeEmpresa.max) {
    errors.nome_empresa = `Nome da empresa pode ter no máximo ${LEAD_LIMITS.nomeEmpresa.max} caracteres`
  }

  const nomeContato = input.nome_contato.trim()
  if (nomeContato.length < LEAD_LIMITS.nomeContato.min) {
    errors.nome_contato = `Nome do contato precisa ter pelo menos ${LEAD_LIMITS.nomeContato.min} caracteres`
  } else if (nomeContato.length > LEAD_LIMITS.nomeContato.max) {
    errors.nome_contato = `Nome do contato pode ter no máximo ${LEAD_LIMITS.nomeContato.max} caracteres`
  }

  const telefoneDigits = input.telefone.replace(/\D/g, '')
  if (telefoneDigits.length !== LEAD_LIMITS.telefone.digits) {
    errors.telefone = 'Precisa ter DDD + 9 dígitos, ex: (99) 99999-9999.'
  }

  const email = input.email?.trim()
  if (email) {
    if (!EMAIL_RE.test(email)) {
      errors.email = 'Email inválido'
    } else if (email.length > LEAD_LIMITS.email.max) {
      errors.email = `Email pode ter no máximo ${LEAD_LIMITS.email.max} caracteres`
    }
  }

  if (input.dias_para_contato !== undefined) {
    if (
      !Number.isInteger(input.dias_para_contato) ||
      input.dias_para_contato < LEAD_LIMITS.diasParaContato.min ||
      input.dias_para_contato > LEAD_LIMITS.diasParaContato.max
    ) {
      errors.dias_para_contato = `Precisa ser um número entre ${LEAD_LIMITS.diasParaContato.min} e ${LEAD_LIMITS.diasParaContato.max}`
    }
  }

  if (input.ticket_estimado != null) {
    if (!Number.isFinite(input.ticket_estimado) || input.ticket_estimado < LEAD_LIMITS.ticketEstimado.min) {
      errors.ticket_estimado = 'Precisa ser um valor válido, maior ou igual a 0'
    }
  }

  const observacoes = input.observacoes?.trim()
  if (observacoes && observacoes.length > LEAD_LIMITS.observacoes.max) {
    errors.observacoes = `Observações podem ter no máximo ${LEAD_LIMITS.observacoes.max} caracteres`
  }

  return errors
}
