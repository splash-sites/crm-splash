import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const signInMock = vi.fn()
vi.mock('../services/authService', () => ({
  signIn: (...args: unknown[]) => signInMock(...args),
}))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

const { LoginForm } = await import('./LoginForm')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('LoginForm', () => {
  it('chama signIn com email, senha e lembrar-me marcado por padrão', async () => {
    signInMock.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(signInMock).toHaveBeenCalledWith('a@a.com', '123456', true)
  })

  it('chama signIn com lembrar-me false quando desmarcado', async () => {
    signInMock.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.click(screen.getByRole('checkbox', { name: 'Lembrar-me' }))
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(signInMock).toHaveBeenCalledWith('a@a.com', '123456', false)
  })

  it('navega pra "/" depois de logar com sucesso', async () => {
    signInMock.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('não navega quando signIn falha', async () => {
    signInMock.mockRejectedValue(new Error('credenciais inválidas'))
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), 'errada')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('credenciais inválidas')
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
