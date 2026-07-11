import { describe, expect, it, beforeEach } from 'vitest'
import { authStorage, setRememberMe } from './authStorage'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('authStorage', () => {
  it('usa localStorage por padrão (lembrar-me não definido)', () => {
    authStorage.setItem('token', 'abc')
    expect(localStorage.getItem('token')).toBe('abc')
    expect(sessionStorage.getItem('token')).toBeNull()
  })

  it('usa localStorage quando lembrar-me é true', () => {
    setRememberMe(true)
    authStorage.setItem('token', 'abc')
    expect(localStorage.getItem('token')).toBe('abc')
    expect(sessionStorage.getItem('token')).toBeNull()
  })

  it('usa sessionStorage quando lembrar-me é false', () => {
    setRememberMe(false)
    authStorage.setItem('token', 'abc')
    expect(sessionStorage.getItem('token')).toBe('abc')
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('getItem e removeItem respeitam a preferência atual', () => {
    setRememberMe(false)
    sessionStorage.setItem('token', 'xyz')
    expect(authStorage.getItem('token')).toBe('xyz')
    authStorage.removeItem('token')
    expect(sessionStorage.getItem('token')).toBeNull()
  })
})
