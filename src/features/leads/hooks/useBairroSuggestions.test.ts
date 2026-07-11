import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const listBairrosMock = vi.fn()
vi.mock('../services/leadsService', () => ({
  listBairros: (...args: unknown[]) => listBairrosMock(...args),
}))

const { useBairroSuggestions } = await import('./useBairroSuggestions')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useBairroSuggestions', () => {
  it('busca bairros quando enabled é true', async () => {
    listBairrosMock.mockResolvedValue(['Centro', 'Zona Sul'])
    const { result } = renderHook(() => useBairroSuggestions(true))
    await waitFor(() => expect(result.current).toEqual(['Centro', 'Zona Sul']))
  })

  it('não busca quando enabled é false', () => {
    renderHook(() => useBairroSuggestions(false))
    expect(listBairrosMock).not.toHaveBeenCalled()
  })

  it('retorna lista vazia se a busca falhar', async () => {
    listBairrosMock.mockRejectedValue(new Error('falha'))
    const { result } = renderHook(() => useBairroSuggestions(true))
    await waitFor(() => expect(listBairrosMock).toHaveBeenCalled())
    expect(result.current).toEqual([])
  })
})
