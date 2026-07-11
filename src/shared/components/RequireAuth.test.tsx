import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { RequireAuth } from './RequireAuth'

const useAuthMock = vi.fn()
vi.mock('@/shared/hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}))

function renderWithRoutes() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/login" element={<p>tela de login</p>} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <p>conteúdo protegido</p>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('RequireAuth', () => {
  it('não renderiza nada enquanto carrega a sessão', () => {
    useAuthMock.mockReturnValue({ session: null, loading: true })
    renderWithRoutes()
    expect(screen.queryByText('conteúdo protegido')).not.toBeInTheDocument()
    expect(screen.queryByText('tela de login')).not.toBeInTheDocument()
  })

  it('redireciona pra login quando não há sessão', () => {
    useAuthMock.mockReturnValue({ session: null, loading: false })
    renderWithRoutes()
    expect(screen.getByText('tela de login')).toBeInTheDocument()
  })

  it('renderiza os filhos quando há sessão', () => {
    useAuthMock.mockReturnValue({ session: { user: { id: '1' } }, loading: false })
    renderWithRoutes()
    expect(screen.getByText('conteúdo protegido')).toBeInTheDocument()
  })
})
