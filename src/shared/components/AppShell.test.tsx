import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

const useAuthMock = vi.fn()
vi.mock('@/shared/hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}))

const signOutMock = vi.fn()
vi.mock('@/features/auth/services/authService', () => ({
  signOut: (...args: unknown[]) => signOutMock(...args),
}))

const { AppShell } = await import('./AppShell')

describe('AppShell', () => {
  it('mostra o nome do usuário logado, sidebar e o conteúdo filho', () => {
    useAuthMock.mockReturnValue({
      session: { user: { email: 'ana@example.com', user_metadata: { nome: 'Ana' } } },
    })
    render(
      <MemoryRouter>
        <AppShell>
          <p>conteúdo da página</p>
        </AppShell>
      </MemoryRouter>
    )
    expect(screen.getByText('Venda.ai')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('Funil de leads')).toBeInTheDocument()
    expect(screen.getByText('conteúdo da página')).toBeInTheDocument()
  })

  it('usa o email como nome quando não há nome cadastrado', () => {
    useAuthMock.mockReturnValue({
      session: { user: { email: 'ana@example.com', user_metadata: {} } },
    })
    render(
      <MemoryRouter>
        <AppShell>
          <p>conteúdo</p>
        </AppShell>
      </MemoryRouter>
    )
    expect(screen.getByText('ana@example.com')).toBeInTheDocument()
  })

  it('abre o menu e chama signOut ao clicar em "Sair"', async () => {
    useAuthMock.mockReturnValue({
      session: { user: { email: 'ana@example.com', user_metadata: { nome: 'Ana' } } },
    })
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AppShell>
          <p>conteúdo</p>
        </AppShell>
      </MemoryRouter>
    )

    await user.click(screen.getByText('Ana'))
    const sairItem = await screen.findByText('Sair')
    await user.click(sairItem)

    expect(signOutMock).toHaveBeenCalled()
  })
})
