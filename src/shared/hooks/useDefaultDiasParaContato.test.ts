import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const getDiasParaContatoPadraoMock = vi.fn()
vi.mock('../services/perfilService', () => ({
  getDiasParaContatoPadrao: (...args: unknown[]) => getDiasParaContatoPadraoMock(...args),
}))

const { useDefaultDiasParaContato } = await import('./useDefaultDiasParaContato')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useDefaultDiasParaContato', () => {
  it('busca o padrão quando enabled é true', async () => {
    getDiasParaContatoPadraoMock.mockResolvedValue(7)
    const { result } = renderHook(() => useDefaultDiasParaContato(true))
    await waitFor(() => expect(result.current).toBe(7))
  })

  it('não busca quando enabled é false, mantém fallback 3', () => {
    const { result } = renderHook(() => useDefaultDiasParaContato(false))
    expect(getDiasParaContatoPadraoMock).not.toHaveBeenCalled()
    expect(result.current).toBe(3)
  })

  it('usa fallback 3 se a busca falhar', async () => {
    getDiasParaContatoPadraoMock.mockRejectedValue(new Error('falha'))
    const { result } = renderHook(() => useDefaultDiasParaContato(true))
    await waitFor(() => expect(getDiasParaContatoPadraoMock).toHaveBeenCalled())
    expect(result.current).toBe(3)
  })
})
