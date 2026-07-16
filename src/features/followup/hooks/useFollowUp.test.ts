import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Lead } from '@/shared/types/lead'

const listLeadsAtivosMock = vi.fn()
const marcarContatoHojeMock = vi.fn()

vi.mock('../services/followupService', () => ({
  listLeadsAtivos: (...args: unknown[]) => listLeadsAtivosMock(...args),
  marcarContatoHoje: (...args: unknown[]) => marcarContatoHojeMock(...args),
}))

const { useFollowUp } = await import('./useFollowUp')

function leadBase(overrides: Partial<Lead> = {}): Lead {
  return {
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
    proximo_contato_em: '2020-01-01T00:00:00.000Z',
    observacoes: null,
    created_at: '2019-12-01T00:00:00.000Z',
    updated_at: '2019-12-01T00:00:00.000Z',
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useFollowUp', () => {
  it('carrega e filtra só leads que precisam falar hoje', async () => {
    const vencido = leadBase({ id: '1', proximo_contato_em: '2020-01-01T00:00:00.000Z' })
    const futuro = leadBase({
      id: '2',
      proximo_contato_em: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    })
    listLeadsAtivosMock.mockResolvedValue([vencido, futuro])

    const { result } = renderHook(() => useFollowUp())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.leads).toEqual([vencido])
  })

  it('ao selecionar um dia futuro, mostra só leads que vencem naquele dia exato', async () => {
    const amanha = new Date()
    amanha.setDate(amanha.getDate() + 1)
    const depoisDeAmanha = new Date()
    depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 2)

    const venceAmanha = leadBase({ id: '1', proximo_contato_em: amanha.toISOString() })
    const venceDepois = leadBase({ id: '2', proximo_contato_em: depoisDeAmanha.toISOString() })
    listLeadsAtivosMock.mockResolvedValue([venceAmanha, venceDepois])

    const { result } = renderHook(() => useFollowUp())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.selecionarDia(amanha))

    expect(result.current.leads.map((l) => l.id)).toEqual(['1'])
  })

  it('diasComLead retorna um dia por proximo_contato_em distinto', async () => {
    const leads = [
      leadBase({ id: '1', proximo_contato_em: '2020-01-01T09:00:00.000Z' }),
      leadBase({ id: '2', proximo_contato_em: '2020-01-01T20:00:00.000Z' }),
      leadBase({ id: '3', proximo_contato_em: '2020-01-02T09:00:00.000Z' }),
    ]
    listLeadsAtivosMock.mockResolvedValue(leads)

    const { result } = renderHook(() => useFollowUp())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.diasComLead).toHaveLength(2)
  })

  it('marcarContatado remove o lead da lista e chama o service', async () => {
    const lead = leadBase()
    listLeadsAtivosMock.mockResolvedValue([lead])
    marcarContatoHojeMock.mockResolvedValue(undefined)

    const { result } = renderHook(() => useFollowUp())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.marcarContatado(lead)
    })

    expect(result.current.leads).toEqual([])
    expect(marcarContatoHojeMock).toHaveBeenCalledWith(lead)
  })
})
