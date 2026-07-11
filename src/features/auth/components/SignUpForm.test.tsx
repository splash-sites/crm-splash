import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const signUpMock = vi.fn()
vi.mock('../services/authService', () => ({
  signUp: (...args: unknown[]) => signUpMock(...args),
}))

const { SignUpForm } = await import('./SignUpForm')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('SignUpForm', () => {
  it('chama signUp com nome, email e senha', async () => {
    signUpMock.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<SignUpForm />)

    await user.type(screen.getByLabelText('Nome'), 'Ana')
    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(signUpMock).toHaveBeenCalledWith('a@a.com', '123456', 'Ana')
  })

  it('mostra mensagem de sucesso após cadastro', async () => {
    signUpMock.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<SignUpForm />)

    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Cadastro feito')
  })

  it('mostra erro quando signUp falha', async () => {
    signUpMock.mockRejectedValue(new Error('email já cadastrado'))
    const user = userEvent.setup()
    render(<SignUpForm />)

    await user.type(screen.getByLabelText('Email'), 'a@a.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('email já cadastrado')
  })
})
