import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Perfil } from '@/shared/types/perfil'

const useConfiguracoesMock = vi.fn()
vi.mock('../hooks/useConfiguracoes', () => ({
  useConfiguracoes: () => useConfiguracoesMock(),
}))

const { ConfiguracoesPanel } = await import('./ConfiguracoesPanel')

const perfil: Perfil = {
  id: 'user-1',
  nome: 'Ana',
  telefone: '11999999999',
  dias_para_contato_padrao: 3,
  created_at: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ConfiguracoesPanel', () => {
  it('mostra "Carregando" enquanto loading é true', () => {
    useConfiguracoesMock.mockReturnValue({
      perfil: null,
      loading: true,
      error: null,
      salvar: vi.fn(),
    })
    render(<ConfiguracoesPanel />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('mostra o form quando o perfil carrega', () => {
    useConfiguracoesMock.mockReturnValue({
      perfil,
      loading: false,
      error: null,
      salvar: vi.fn(),
    })
    render(<ConfiguracoesPanel />)
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana')
  })

  it('mostra erro quando a busca falha', () => {
    useConfiguracoesMock.mockReturnValue({
      perfil: null,
      loading: false,
      error: 'falha ao carregar',
      salvar: vi.fn(),
    })
    render(<ConfiguracoesPanel />)
    expect(screen.getByRole('alert')).toHaveTextContent('falha ao carregar')
  })
})
