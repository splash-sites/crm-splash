import { describe, expect, it } from 'vitest'
import { validateLeadInput } from './validateLeadInput'
import type { LeadInput } from '@/shared/types/lead'

function baseInput(overrides: Partial<LeadInput> = {}): LeadInput {
  return { nome: 'Ana', telefone: '11999999999', ...overrides }
}

describe('validateLeadInput', () => {
  it('não retorna erros para um input válido', () => {
    expect(validateLeadInput(baseInput())).toEqual({})
  })

  it('rejeita nome menor que 2 caracteres', () => {
    expect(validateLeadInput(baseInput({ nome: 'A' }))).toHaveProperty('nome')
  })

  it('rejeita nome maior que 100 caracteres', () => {
    expect(validateLeadInput(baseInput({ nome: 'a'.repeat(101) }))).toHaveProperty('nome')
  })

  it('rejeita telefone com menos de 11 dígitos (DDD + 9 números)', () => {
    expect(validateLeadInput(baseInput({ telefone: '1199999' }))).toHaveProperty('telefone')
  })

  it('rejeita telefone com mais de 11 dígitos', () => {
    expect(validateLeadInput(baseInput({ telefone: '119999999999' }))).toHaveProperty('telefone')
  })

  it('aceita telefone já formatado, contando só os dígitos', () => {
    expect(validateLeadInput(baseInput({ telefone: '(11) 99999-9999' }))).toEqual({})
  })

  it('rejeita email com formato inválido', () => {
    expect(validateLeadInput(baseInput({ email: 'não-é-email' }))).toHaveProperty('email')
  })

  it('aceita email vazio (campo opcional)', () => {
    expect(validateLeadInput(baseInput({ email: '' }))).toEqual({})
  })

  it('rejeita email maior que 255 caracteres', () => {
    const longEmail = `${'a'.repeat(250)}@a.com`
    expect(validateLeadInput(baseInput({ email: longEmail }))).toHaveProperty('email')
  })

  it('rejeita observações maiores que 1000 caracteres', () => {
    expect(validateLeadInput(baseInput({ observacoes: 'a'.repeat(1001) }))).toHaveProperty(
      'observacoes'
    )
  })
})
