import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const signUpMock = vi.fn()
vi.mock('../services/authService', () => ({
  signUp: (...args: unknown[]) => signUpMock(...args),
}))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => navigateMock }
})

const { SignUpForm } = await import('./SignUpForm')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('SignUpForm', () => {
  it('chama signUp com nome, email e senha', async () => {
    signUpMock.mockResolvedValue({ session: null })
    const user = userEvent.setup()
    render(<SignUpForm />)

    await user.type(screen.getByLabelText('Nome'), 'Ana')
    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.type(screen.getByLabelText('Confirmar senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(signUpMock).toHaveBeenCalledWith('a@a.com', '123456', 'Ana')
  })

  it('mostra erro e não chama signUp quando as senhas não coincidem', async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)

    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.type(screen.getByLabelText('Confirmar senha'), '654321')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('As senhas não coincidem.')
    expect(signUpMock).not.toHaveBeenCalled()
  })

  it('mostra mensagem de sucesso quando confirmação por email ainda é necessária', async () => {
    signUpMock.mockResolvedValue({ session: null })
    const user = userEvent.setup()
    render(<SignUpForm />)

    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.type(screen.getByLabelText('Confirmar senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Cadastro feito')
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('navega pra "/dashboard" quando o cadastro já cria sessão (confirmação de email desativada)', async () => {
    signUpMock.mockResolvedValue({ session: { access_token: 'token' } })
    const user = userEvent.setup()
    render(<SignUpForm />)

    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.type(screen.getByLabelText('Confirmar senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(navigateMock).toHaveBeenCalledWith('/dashboard')
  })

  it('mostra erro quando signUp falha', async () => {
    signUpMock.mockRejectedValue(new Error('email já cadastrado'))
    const user = userEvent.setup()
    render(<SignUpForm />)

    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.type(screen.getByLabelText('Confirmar senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('email já cadastrado')
  })
})
