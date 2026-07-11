import { describe, expect, it } from 'vitest'
import { validateConfiguracoes } from './validateConfiguracoes'

describe('validateConfiguracoes', () => {
  it('não retorna erros para um input vazio (tudo opcional)', () => {
    expect(validateConfiguracoes({})).toEqual({})
  })

  it('rejeita nome maior que 100 caracteres', () => {
    expect(validateConfiguracoes({ nome: 'a'.repeat(101) })).toHaveProperty('nome')
  })

  it('aceita telefone vazio', () => {
    expect(validateConfiguracoes({ telefone: '' })).toEqual({})
  })

  it('rejeita telefone com menos de 11 dígitos', () => {
    expect(validateConfiguracoes({ telefone: '11999' })).toHaveProperty('telefone')
  })

  it('aceita telefone com 11 dígitos, já formatado', () => {
    expect(validateConfiguracoes({ telefone: '(11) 99999-9999' })).toEqual({})
  })

  it('rejeita dias_para_contato_padrao fora do intervalo 1-365', () => {
    expect(validateConfiguracoes({ dias_para_contato_padrao: 0 })).toHaveProperty(
      'dias_para_contato_padrao'
    )
    expect(validateConfiguracoes({ dias_para_contato_padrao: 366 })).toHaveProperty(
      'dias_para_contato_padrao'
    )
  })

  it('aceita dias_para_contato_padrao dentro do intervalo', () => {
    expect(validateConfiguracoes({ dias_para_contato_padrao: 7 })).toEqual({})
  })
})
