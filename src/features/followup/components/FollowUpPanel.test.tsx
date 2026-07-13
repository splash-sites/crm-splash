import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Lead } from '@/shared/types/lead'

const useFollowUpMock = vi.fn()
vi.mock('../hooks/useFollowUp', () => ({
  useFollowUp: () => useFollowUpMock(),
}))

const toastSuccessMock = vi.fn()
const toastErrorMock = vi.fn()
vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
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

function mockUseFollowUp(overrides: Partial<ReturnType<typeof useFollowUpMock>> = {}) {
  useFollowUpMock.mockReturnValue({
    leads: [],
    diasComLead: [],
    diaSelecionado: new Date(2026, 0, 1),
    selecionarDia: vi.fn(),
    loading: false,
    error: null,
    marcarContatado: vi.fn(),
    ...overrides,
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('FollowUpPanel', () => {
  it('mostra "Carregando" enquanto loading é true', () => {
    mockUseFollowUp({ loading: true })
    render(<FollowUpPanel />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('mostra mensagem de lista vazia', () => {
    mockUseFollowUp()
    render(<FollowUpPanel />)
    expect(screen.getByText('Nenhum lead pra falar nesse dia. 🎉')).toBeInTheDocument()
  })

  it('renderiza um item por lead', () => {
    mockUseFollowUp({
      leads: [leadBase({ id: '1', nome: 'Ana' }), leadBase({ id: '2', nome: 'Bruno' })],
    })
    render(<FollowUpPanel />)
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
  })

  it('renderiza o calendário', () => {
    mockUseFollowUp()
    render(<FollowUpPanel />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('mostra toast ao marcar lead como contatado', async () => {
    const marcarContatado = vi.fn().mockResolvedValue(undefined)
    mockUseFollowUp({ leads: [leadBase()], marcarContatado })
    const user = userEvent.setup()
    render(<FollowUpPanel />)

    await user.click(screen.getByRole('button', { name: 'Marcar como concluído' }))

    expect(marcarContatado).toHaveBeenCalled()
    expect(toastSuccessMock).toHaveBeenCalledWith('Lead marcado como contatado.')
  })

  it('mostra toast de erro quando marcarContatado falha', async () => {
    const marcarContatado = vi.fn().mockRejectedValue(new Error('falhou'))
    mockUseFollowUp({ leads: [leadBase()], marcarContatado })
    const user = userEvent.setup()
    render(<FollowUpPanel />)

    await user.click(screen.getByRole('button', { name: 'Marcar como concluído' }))

    expect(toastErrorMock).toHaveBeenCalledWith('falhou')
  })
})
