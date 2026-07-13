import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { LeadOption, Visita } from '../types/visita'

const useAgendaMock = vi.fn()
vi.mock('../hooks/useAgenda', () => ({
  useAgenda: () => useAgendaMock(),
}))

const toastErrorMock = vi.fn()
const toastSuccessMock = vi.fn()
vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => toastErrorMock(...args),
    success: (...args: unknown[]) => toastSuccessMock(...args),
  },
}))

const { AgendaPanel } = await import('./AgendaPanel')

const leads: LeadOption[] = [{ id: 'lead-1', nome: 'Ana', telefone: '11999999999' }]
const hoje = new Date()
hoje.setHours(9, 0, 0, 0)
const visitaBase: Visita = {
  id: '1',
  lead_id: 'lead-1',
  data_hora: hoje.toISOString(),
  status: 'agendada',
  lead_nome: 'Ana',
  lead_telefone: '11999999999',
}

function mockUseAgenda(overrides: Partial<ReturnType<typeof useAgendaMock>> = {}) {
  useAgendaMock.mockReturnValue({
    visitas: [visitaBase],
    leads,
    horarioInicio: 7,
    horarioFim: 20,
    loading: false,
    error: null,
    agendar: vi.fn(),
    marcarStatus: vi.fn(),
    remarcar: vi.fn(),
    remover: vi.fn(),
    ...overrides,
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('AgendaPanel', () => {
  it('mostra "Carregando" enquanto loading é true', () => {
    mockUseAgenda({ loading: true })
    render(<AgendaPanel />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('renderiza calendário e a linha do tempo', () => {
    mockUseAgenda()
    render(<AgendaPanel />)
    expect(screen.getByText('Agenda de visitas')).toBeInTheDocument()
  })

  it('abre modal de criação vazio ao clicar em "Nova visita"', async () => {
    mockUseAgenda()
    const user = userEvent.setup()
    render(<AgendaPanel />)
    await user.click(screen.getByRole('button', { name: 'Nova visita' }))
    expect(screen.getByText('Nova visita', { selector: '[data-slot="dialog-title"]' })).toBeInTheDocument()
  })

  it('mostra toast e não abre modal ao clicar em "Nova visita" sem leads cadastrados', async () => {
    mockUseAgenda({ leads: [] })
    const user = userEvent.setup()
    render(<AgendaPanel />)

    await user.click(screen.getByRole('button', { name: 'Nova visita' }))

    expect(toastErrorMock).toHaveBeenCalledWith(
      'Você deve ter pelo menos 1 lead cadastrado para cadastrar uma visita.'
    )
    expect(screen.queryByText('Nova visita', { selector: '[data-slot="dialog-title"]' })).not.toBeInTheDocument()
  })

  it('chama agendar ao salvar uma nova visita', async () => {
    const agendar = vi.fn().mockResolvedValue(undefined)
    mockUseAgenda({ agendar })
    const user = userEvent.setup()
    render(<AgendaPanel />)

    await user.click(screen.getByRole('button', { name: 'Nova visita' }))
    await user.click(screen.getByLabelText('Lead'))
    await user.click(await screen.findByRole('option', { name: 'Ana' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(agendar).toHaveBeenCalledWith('lead-1', expect.any(String))
    expect(toastSuccessMock).toHaveBeenCalledWith('Visita agendada com sucesso.')
  })

  it('mostra toast ao marcar visita como realizada', async () => {
    const marcarStatus = vi.fn().mockResolvedValue(undefined)
    mockUseAgenda({ marcarStatus })
    const user = userEvent.setup()
    render(<AgendaPanel />)

    await user.click(screen.getByRole('button', { name: 'Realizada' }))

    expect(marcarStatus).toHaveBeenCalledWith('1', 'realizada')
    expect(toastSuccessMock).toHaveBeenCalledWith('Visita marcada como realizada.')
  })

  it('abre modal de edição ao clicar em "Editar"', async () => {
    mockUseAgenda()
    const user = userEvent.setup()
    render(<AgendaPanel />)

    await user.click(screen.getByRole('button', { name: 'Editar' }))

    expect(screen.getByText('Editar visita', { selector: '[data-slot="dialog-title"]' })).toBeInTheDocument()
  })

  it('mostra toast de erro quando marcarStatus falha', async () => {
    const marcarStatus = vi.fn().mockRejectedValue(new Error('falhou'))
    mockUseAgenda({ marcarStatus })
    const user = userEvent.setup()
    render(<AgendaPanel />)

    await user.click(screen.getByRole('button', { name: 'Realizada' }))

    expect(toastErrorMock).toHaveBeenCalledWith('falhou')
  })

  it('mostra toast ao excluir visita', async () => {
    const remover = vi.fn().mockResolvedValue(undefined)
    mockUseAgenda({ remover })
    const user = userEvent.setup()
    render(<AgendaPanel />)

    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    const buttons = await screen.findAllByRole('button', { name: 'Excluir' })
    await user.click(buttons[buttons.length - 1])

    expect(remover).toHaveBeenCalledWith('1')
    expect(toastSuccessMock).toHaveBeenCalledWith('Visita excluída.')
  })
})
