import { describe, expect, it } from 'vitest'
import { SIGNUP_LIMITS, validateSignUpInput } from './validateSignUpInput'

function input(overrides: Partial<Parameters<typeof validateSignUpInput>[0]> = {}) {
  return {
    nome: 'Ana',
    email: 'ana@example.com',
    password: '123456',
    confirmarSenha: '123456',
    ...overrides,
  }
}

describe('validateSignUpInput', () => {
  it('não retorna erros para dados válidos', () => {
    expect(validateSignUpInput(input())).toEqual({})
  })

  it('rejeita nome maior que o limite', () => {
    const errors = validateSignUpInput(input({ nome: 'a'.repeat(SIGNUP_LIMITS.nome.max + 1) }))
    expect(errors.nome).toBeDefined()
  })

  it('rejeita email inválido', () => {
    const errors = validateSignUpInput(input({ email: 'não-é-email' }))
    expect(errors.email).toBe('Email inválido')
  })

  it('rejeita email maior que o limite', () => {
    const emailGigante = `${'a'.repeat(SIGNUP_LIMITS.email.max)}@example.com`
    const errors = validateSignUpInput(input({ email: emailGigante }))
    expect(errors.email).toBeDefined()
  })

  it('rejeita senha menor que o mínimo', () => {
    const errors = validateSignUpInput(input({ password: '123', confirmarSenha: '123' }))
    expect(errors.password).toBe('Senha precisa ter pelo menos 6 caracteres')
  })

  it('rejeita senha maior que o máximo', () => {
    const senhaGigante = 'a'.repeat(SIGNUP_LIMITS.senha.max + 1)
    const errors = validateSignUpInput(input({ password: senhaGigante, confirmarSenha: senhaGigante }))
    expect(errors.password).toBe(`Senha pode ter no máximo ${SIGNUP_LIMITS.senha.max} caracteres`)
  })

  it('aceita senha exatamente no limite máximo', () => {
    const senhaNoLimite = 'a'.repeat(SIGNUP_LIMITS.senha.max)
    const errors = validateSignUpInput(input({ password: senhaNoLimite, confirmarSenha: senhaNoLimite }))
    expect(errors.password).toBeUndefined()
  })

  it('rejeita quando as senhas não coincidem', () => {
    const errors = validateSignUpInput(input({ password: '123456', confirmarSenha: '654321' }))
    expect(errors.confirmarSenha).toBe('As senhas não coincidem.')
  })

  it('não checa confirmação quando a senha em si já é inválida', () => {
    const errors = validateSignUpInput(input({ password: '123', confirmarSenha: '456' }))
    expect(errors.password).toBeDefined()
    expect(errors.confirmarSenha).toBeUndefined()
  })
})
