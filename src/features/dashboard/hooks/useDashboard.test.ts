import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const listLeadsResumoMock = vi.fn()

vi.mock('../services/dashboardService', () => ({
  listLeadsResumo: (...args: unknown[]) => listLeadsResumoMock(...args),
}))

const { useDashboard } = await import('./useDashboard')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useDashboard', () => {
  it('carrega kpis, funil, origem e tendência ao montar', async () => {
    listLeadsResumoMock.mockResolvedValue([
      {
        etapa: 'novo',
        origem: 'instagram',
        created_at: '2026-01-05T00:00:00.000Z',
        proximo_contato_em: '2026-01-01T00:00:00.000Z',
      },
    ])

    const { result } = renderHook(() => useDashboard())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.kpis).not.toBeNull()
    expect(result.current.funil.length).toBeGreaterThan(0)
    expect(result.current.origem.length).toBeGreaterThan(0)
    expect(result.current.tendencia.length).toBeGreaterThan(0)
  })

  it('seta error quando a busca falha', async () => {
    listLeadsResumoMock.mockRejectedValue(new Error('falha ao buscar'))

    const { result } = renderHook(() => useDashboard())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('falha ao buscar')
  })
})
