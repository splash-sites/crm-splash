import { TELEFONE_DIGITS } from '@/shared/lib/telefoneMask'
import type { PerfilInput } from '@/shared/types/perfil'

export type ConfiguracoesErrors = Partial<Record<keyof PerfilInput, string>>

export const CONFIG_LIMITS = {
  nome: { max: 100 },
  diasParaContatoPadrao: { min: 1, max: 365 },
} as const

export function validateConfiguracoes(input: PerfilInput): ConfiguracoesErrors {
  const errors: ConfiguracoesErrors = {}

  const nome = input.nome?.trim()
  if (nome && nome.length > CONFIG_LIMITS.nome.max) {
    errors.nome = `Nome pode ter no máximo ${CONFIG_LIMITS.nome.max} caracteres`
  }

  const telefoneDigits = input.telefone?.replace(/\D/g, '') ?? ''
  if (telefoneDigits.length > 0 && telefoneDigits.length !== TELEFONE_DIGITS) {
    errors.telefone = 'Telefone precisa ter DDD + 9 dígitos, ex: (51) 99172-6861'
  }

  if (input.dias_para_contato_padrao !== undefined) {
    const dias = input.dias_para_contato_padrao
    if (
      !Number.isInteger(dias) ||
      dias < CONFIG_LIMITS.diasParaContatoPadrao.min ||
      dias > CONFIG_LIMITS.diasParaContatoPadrao.max
    ) {
      errors.dias_para_contato_padrao = `Precisa ser um número entre ${CONFIG_LIMITS.diasParaContatoPadrao.min} e ${CONFIG_LIMITS.diasParaContatoPadrao.max}`
    }
  }

  return errors
}
