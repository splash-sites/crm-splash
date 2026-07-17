import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const listLeadsResumoMock = vi.fn()
const listLeadIdsComInteracaoMock = vi.fn()
const listEtapaHistoricoMock = vi.fn()

vi.mock('../services/dashboardService', () => ({
  listLeadsResumo: (...args: unknown[]) => listLeadsResumoMock(...args),
  listLeadIdsComInteracao: (...args: unknown[]) => listLeadIdsComInteracaoMock(...args),
  listEtapaHistorico: (...args: unknown[]) => listEtapaHistoricoMock(...args),
}))

const { useDashboard } = await import('./useDashboard')

beforeEach(() => {
  vi.clearAllMocks()
  listLeadIdsComInteracaoMock.mockResolvedValue([])
  listEtapaHistoricoMock.mockResolvedValue([])
})

describe('useDashboard', () => {
  it('carrega kpis, funil, origem e produto ao montar', async () => {
    listLeadsResumoMock.mockResolvedValue([
      {
        id: '1',
        etapa: 'novo',
        origem: 'instagram',
        produto_interesse: 'software',
        ticket_estimado: 1000,
        created_at: '2026-01-05T00:00:00.000Z',
        updated_at: '2026-01-05T00:00:00.000Z',
        proximo_contato_em: '2026-01-01T00:00:00.000Z',
      },
    ])

    const { result } = renderHook(() => useDashboard())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.kpis).not.toBeNull()
    expect(result.current.funil.length).toBeGreaterThan(0)
    expect(result.current.origem.length).toBeGreaterThan(0)
    expect(result.current.produto.length).toBeGreaterThan(0)
    expect(result.current.tempoPorEtapa.length).toBeGreaterThan(0)
  })

  it('seta error quando a busca falha', async () => {
    listLeadsResumoMock.mockRejectedValue(new Error('falha ao buscar'))

    const { result } = renderHook(() => useDashboard())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('falha ao buscar')
  })
})
