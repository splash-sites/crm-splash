import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Lead } from '@/shared/types/lead'

const useFollowUpMock = vi.fn()
vi.mock('../hooks/useFollowUp', () => ({
  useFollowUp: () => useFollowUpMock(),
}))

const { FollowUpPanel } = await import('./FollowUpPanel')

function leadBase(overrides: Partial<Lead> = {}): Lead {
  return {
    id: '1',
    corretor_id: 'user-1',
    nome: 'Ana',
    telefone: '11999999999',
    email: null,
    origem: null,
    tipo_imovel: null,
    finalidade: null,
    bairros: [],
    faixa_preco: null,
    etapa: 'novo',
    posicao: 0,
    motivo_perda: null,
    ultima_interacao: null,
    dias_para_contato: 3,
    proximo_contato_em: '2026-01-01T00:00:00.000Z',
    observacoes: null,
    created_at: '2025-12-29T00:00:00.000Z',
    updated_at: '2025-12-29T00:00:00.000Z',
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('FollowUpPanel', () => {
  it('mostra "Carregando" enquanto loading é true', () => {
    useFollowUpMock.mockReturnValue({
      leads: [],
      loading: true,
      error: null,
      marcarContatado: vi.fn(),
    })
    render(<FollowUpPanel />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('mostra mensagem de lista vazia', () => {
    useFollowUpMock.mockReturnValue({
      leads: [],
      loading: false,
      error: null,
      marcarContatado: vi.fn(),
    })
    render(<FollowUpPanel />)
    expect(screen.getByText('Nenhum lead pra falar hoje. 🎉')).toBeInTheDocument()
  })

  it('renderiza um item por lead', () => {
    useFollowUpMock.mockReturnValue({
      leads: [leadBase({ id: '1', nome: 'Ana' }), leadBase({ id: '2', nome: 'Bruno' })],
      loading: false,
      error: null,
      marcarContatado: vi.fn(),
    })
    render(<FollowUpPanel />)
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
  })
})
