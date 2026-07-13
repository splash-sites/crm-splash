import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ThemeProvider } from '@/shared/hooks/useTheme'

const useAuthMock = vi.fn()
vi.mock('@/shared/hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}))

const signOutMock = vi.fn()
vi.mock('@/features/auth/services/authService', () => ({
  signOut: (...args: unknown[]) => signOutMock(...args),
}))

const { AppShell } = await import('./AppShell')

function renderShell(children: ReactNode) {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <AppShell>{children}</AppShell>
      </ThemeProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('AppShell', () => {
  it('mostra o nome do usuário logado, sidebar e o conteúdo filho', () => {
    useAuthMock.mockReturnValue({
      session: { user: { email: 'ana@example.com', user_metadata: { nome: 'Ana' } } },
    })
    renderShell(<p>conteúdo da página</p>)
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
    renderShell(<p>conteúdo</p>)
    expect(screen.getByText('ana@example.com')).toBeInTheDocument()
  })

  it('abre o menu e chama signOut ao clicar em "Sair"', async () => {
    useAuthMock.mockReturnValue({
      session: { user: { email: 'ana@example.com', user_metadata: { nome: 'Ana' } } },
    })
    const user = userEvent.setup()
    renderShell(<p>conteúdo</p>)

    await user.click(screen.getByText('Ana'))
    const sairItem = await screen.findByText('Sair')
    await user.click(sairItem)

    expect(signOutMock).toHaveBeenCalled()
  })
})
