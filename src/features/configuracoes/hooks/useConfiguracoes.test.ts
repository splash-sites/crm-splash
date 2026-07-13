import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Perfil } from '@/shared/types/perfil'

const getPerfilMock = vi.fn()
const updatePerfilMock = vi.fn()

vi.mock('@/shared/services/perfilService', () => ({
  getPerfil: (...args: unknown[]) => getPerfilMock(...args),
  updatePerfil: (...args: unknown[]) => updatePerfilMock(...args),
}))

const { useConfiguracoes } = await import('./useConfiguracoes')

const perfilBase: Perfil = {
  id: 'user-1',
  nome: 'Ana',
  telefone: '11999999999',
  dias_para_contato_padrao: 3,
  horario_inicio: 7,
  horario_fim: 20,
  created_at: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useConfiguracoes', () => {
  it('carrega o perfil ao montar', async () => {
    getPerfilMock.mockResolvedValue(perfilBase)
    const { result } = renderHook(() => useConfiguracoes())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.perfil).toEqual(perfilBase)
  })

  it('seta error quando a busca falha', async () => {
    getPerfilMock.mockRejectedValue(new Error('falha ao buscar'))
    const { result } = renderHook(() => useConfiguracoes())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('falha ao buscar')
  })

  it('salvar atualiza o perfil no estado', async () => {
    getPerfilMock.mockResolvedValue(perfilBase)
    const perfilAtualizado = { ...perfilBase, nome: 'Ana Paula' }
    updatePerfilMock.mockResolvedValue(perfilAtualizado)
    const { result } = renderHook(() => useConfiguracoes())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.salvar({ nome: 'Ana Paula' })
    })

    expect(result.current.perfil).toEqual(perfilAtualizado)
  })
})
