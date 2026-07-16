import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Lead } from '@/shared/types/lead'

const listLeadsMock = vi.fn()
const createLeadMock = vi.fn()
const updateLeadMock = vi.fn()
const updateLeadPosicaoMock = vi.fn()
const deleteLeadMock = vi.fn()

vi.mock('../services/leadsService', () => ({
  listLeads: (...args: unknown[]) => listLeadsMock(...args),
  createLead: (...args: unknown[]) => createLeadMock(...args),
  updateLead: (...args: unknown[]) => updateLeadMock(...args),
  updateLeadPosicao: (...args: unknown[]) => updateLeadPosicaoMock(...args),
  deleteLead: (...args: unknown[]) => deleteLeadMock(...args),
}))

const { useLeads } = await import('./useLeads')

const leadBase: Lead = {
  id: '1',
  corretor_id: 'user-1',
  nome_empresa: 'Empresa Ana',
  nome_contato: 'Ana',
  telefone: '11999999999',
  email: null,
  origem: null,
  produto_interesse: null,
  ticket_estimado: null,
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

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useLeads', () => {
  it('carrega leads ao montar', async () => {
    listLeadsMock.mockResolvedValue([leadBase])
    const { result } = renderHook(() => useLeads())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.leads).toEqual([leadBase])
  })

  it('addLead adiciona o lead retornado ao estado', async () => {
    listLeadsMock.mockResolvedValue([])
    createLeadMock.mockResolvedValue(leadBase)
    const { result } = renderHook(() => useLeads())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.addLead({
        nome_empresa: 'Empresa Ana',
        nome_contato: 'Ana',
        telefone: '11999999999',
      })
    })

    expect(result.current.leads).toEqual([leadBase])
  })

  it('editLead atualiza o lead no estado', async () => {
    const leadEditado = { ...leadBase, nome_contato: 'Ana Paula' }
    listLeadsMock.mockResolvedValue([leadBase])
    updateLeadMock.mockResolvedValue(leadEditado)
    const { result } = renderHook(() => useLeads())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.editLead('1', {
        nome_empresa: 'Empresa Ana',
        nome_contato: 'Ana Paula',
        telefone: '11999999999',
      })
    })

    expect(result.current.leads).toEqual([leadEditado])
  })

  it('reorderLead atualiza etapa e posicao otimisticamente', async () => {
    listLeadsMock.mockResolvedValue([leadBase])
    updateLeadPosicaoMock.mockResolvedValue(undefined)
    const { result } = renderHook(() => useLeads())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.reorderLead('1', 'proposta', 500)
    })

    expect(result.current.leads[0].etapa).toBe('proposta')
    expect(result.current.leads[0].posicao).toBe(500)
    expect(updateLeadPosicaoMock).toHaveBeenCalledWith('1', 'proposta', 500)
  })

  it('removeLead remove o lead do estado', async () => {
    listLeadsMock.mockResolvedValue([leadBase])
    deleteLeadMock.mockResolvedValue(undefined)
    const { result } = renderHook(() => useLeads())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.removeLead('1')
    })

    expect(result.current.leads).toEqual([])
  })
})
