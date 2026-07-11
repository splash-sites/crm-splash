import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Lead } from '@/shared/types/lead'

const useLeadsMock = vi.fn()
vi.mock('../hooks/useLeads', () => ({
  useLeads: () => useLeadsMock(),
}))

vi.mock('../services/leadsService', () => ({
  listBairros: vi.fn().mockResolvedValue([]),
}))

const { KanbanBoard } = await import('./KanbanBoard')

const lead: Lead = {
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
  created_at: '',
  updated_at: '',
}

function mockUseLeads(overrides: Partial<ReturnType<typeof useLeadsMock>> = {}) {
  useLeadsMock.mockReturnValue({
    leads: [lead],
    loading: false,
    error: null,
    addLead: vi.fn(),
    editLead: vi.fn(),
    reorderLead: vi.fn(),
    removeLead: vi.fn(),
    ...overrides,
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('KanbanBoard', () => {
  it('mostra "Carregando" enquanto loading é true', () => {
    mockUseLeads({ leads: [], loading: true })
    render(<KanbanBoard />)
    expect(screen.getByText('Carregando leads...')).toBeInTheDocument()
  })

  it('renderiza as 6 colunas e o lead na coluna correta', () => {
    mockUseLeads()
    render(<KanbanBoard />)
    expect(screen.getByTestId('kanban-column-novo')).toContainElement(
      screen.getByTestId('lead-card-1')
    )
    expect(screen.getByTestId('kanban-column-em_contato')).toBeInTheDocument()
    expect(screen.getByTestId('kanban-column-perdido')).toBeInTheDocument()
  })

  it('ordena os leads da coluna por posicao, não pela ordem do array', () => {
    const primeiro = { ...lead, id: '1', nome: 'Segundo na tela', posicao: 100 }
    const segundo = { ...lead, id: '2', nome: 'Primeiro na tela', posicao: 10 }
    mockUseLeads({ leads: [primeiro, segundo] })
    render(<KanbanBoard />)

    const coluna = screen.getByTestId('kanban-column-novo')
    const cards = coluna.querySelectorAll('[data-testid^="lead-card-"]')
    expect(cards[0]).toHaveAttribute('data-testid', 'lead-card-2')
    expect(cards[1]).toHaveAttribute('data-testid', 'lead-card-1')
  })

  it('pede confirmação e só chama removeLead depois de confirmar', async () => {
    const removeLead = vi.fn()
    mockUseLeads({ removeLead })
    const user = userEvent.setup()
    render(<KanbanBoard />)
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(removeLead).not.toHaveBeenCalled()
    expect(await screen.findByText('Excluir lead?')).toBeInTheDocument()

    const buttons = screen.getAllByRole('button', { name: 'Excluir' })
    await user.click(buttons[buttons.length - 1])
    expect(removeLead).toHaveBeenCalledWith('1')
  })

  it('cancela exclusão sem chamar removeLead', async () => {
    const removeLead = vi.fn()
    mockUseLeads({ removeLead })
    const user = userEvent.setup()
    render(<KanbanBoard />)
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    await user.click(await screen.findByRole('button', { name: 'Cancelar' }))
    expect(removeLead).not.toHaveBeenCalled()
  })

  it('abre modal de criação vazio ao clicar em "Novo lead"', async () => {
    mockUseLeads()
    const user = userEvent.setup()
    render(<KanbanBoard />)
    await user.click(screen.getByRole('button', { name: 'Novo Lead' }))
    expect(screen.getByText('Novo lead', { selector: '[data-slot="dialog-title"]' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toHaveValue('')
  })

  it('abre modal de edição pré-preenchido ao clicar no lead', async () => {
    mockUseLeads()
    const user = userEvent.setup()
    render(<KanbanBoard />)
    await user.click(screen.getByRole('button', { name: 'Editar Ana' }))
    expect(screen.getByText('Editar lead')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana')
  })

  it('chama editLead ao salvar edição', async () => {
    const editLead = vi.fn().mockResolvedValue(undefined)
    mockUseLeads({ editLead })
    const user = userEvent.setup()
    render(<KanbanBoard />)
    await user.click(screen.getByRole('button', { name: 'Editar Ana' }))
    await user.clear(screen.getByLabelText('Nome'))
    await user.type(screen.getByLabelText('Nome'), 'Ana Paula')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(editLead).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ nome: 'Ana Paula', telefone: '11999999999' })
    )
  })
})
