import { describe, expect, it } from 'vitest'
import { maskTelefone, onlyDigits } from './telefoneMask'

describe('onlyDigits', () => {
  it('remove tudo que não é dígito e limita a 11 caracteres', () => {
    expect(onlyDigits('(51) 99172-6861')).toBe('51991726861')
    expect(onlyDigits('519917268619999')).toBe('51991726861')
  })
})

describe('maskTelefone', () => {
  it('retorna vazio para input vazio', () => {
    expect(maskTelefone('')).toBe('')
  })

  it('formata progressivamente enquanto digita', () => {
    expect(maskTelefone('5')).toBe('(5')
    expect(maskTelefone('51')).toBe('(51')
    expect(maskTelefone('519')).toBe('(51) 9')
    expect(maskTelefone('5199172')).toBe('(51) 99172')
    expect(maskTelefone('51991726861')).toBe('(51) 99172-6861')
  })

  it('ignora dígitos além do 11º', () => {
    expect(maskTelefone('519917268619999')).toBe('(51) 99172-6861')
  })
})
