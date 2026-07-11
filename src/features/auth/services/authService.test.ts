import { describe, expect, it, vi, beforeEach } from 'vitest'

const signUpMock = vi.fn()
const signInWithPasswordMock = vi.fn()
const signOutMock = vi.fn()
const getSessionMock = vi.fn()

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: (...args: unknown[]) => signUpMock(...args),
      signInWithPassword: (...args: unknown[]) => signInWithPasswordMock(...args),
      signOut: (...args: unknown[]) => signOutMock(...args),
      getSession: (...args: unknown[]) => getSessionMock(...args),
    },
  },
}))

const setRememberMeMock = vi.fn()
vi.mock('@/lib/authStorage', () => ({
  setRememberMe: (...args: unknown[]) => setRememberMeMock(...args),
}))

const { signUp, signIn, signOut, getSession } = await import('./authService')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('authService', () => {
  it('signUp envia nome como metadata quando informado', async () => {
    signUpMock.mockResolvedValue({ data: { user: null, session: null }, error: null })
    await signUp('a@a.com', '123456', 'Ana')
    expect(signUpMock).toHaveBeenCalledWith({
      email: 'a@a.com',
      password: '123456',
      options: { data: { nome: 'Ana' } },
    })
  })

  it('signUp lança erro quando supabase retorna error', async () => {
    signUpMock.mockResolvedValue({ data: null, error: new Error('email inválido') })
    await expect(signUp('a@a.com', '123456')).rejects.toThrow('email inválido')
  })

  it('signIn chama signInWithPassword e retorna dados', async () => {
    signInWithPasswordMock.mockResolvedValue({ data: { session: {} }, error: null })
    const result = await signIn('a@a.com', '123456')
    expect(signInWithPasswordMock).toHaveBeenCalledWith({ email: 'a@a.com', password: '123456' })
    expect(result).toEqual({ session: {} })
  })

  it('signIn define a preferência de lembrar-me antes de logar', async () => {
    signInWithPasswordMock.mockResolvedValue({ data: { session: {} }, error: null })
    await signIn('a@a.com', '123456', false)
    expect(setRememberMeMock).toHaveBeenCalledWith(false)
  })

  it('signIn usa lembrar-me true por padrão', async () => {
    signInWithPasswordMock.mockResolvedValue({ data: { session: {} }, error: null })
    await signIn('a@a.com', '123456')
    expect(setRememberMeMock).toHaveBeenCalledWith(true)
  })

  it('signIn lança erro quando credenciais são inválidas', async () => {
    signInWithPasswordMock.mockResolvedValue({ data: null, error: new Error('credenciais inválidas') })
    await expect(signIn('a@a.com', 'errada')).rejects.toThrow('credenciais inválidas')
  })

  it('signOut chama supabase.auth.signOut', async () => {
    signOutMock.mockResolvedValue({ error: null })
    await signOut()
    expect(signOutMock).toHaveBeenCalled()
  })

  it('getSession retorna a sessão atual', async () => {
    getSessionMock.mockResolvedValue({ data: { session: { user: { id: '1' } } }, error: null })
    const session = await getSession()
    expect(session).toEqual({ user: { id: '1' } })
  })
})
