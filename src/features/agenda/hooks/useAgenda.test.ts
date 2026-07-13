import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Visita } from '../types/visita'

const listVisitasMock = vi.fn()
const listLeadsParaAgendarMock = vi.fn()
const createVisitaMock = vi.fn()
const updateVisitaStatusMock = vi.fn()
const updateVisitaDataHoraMock = vi.fn()
const deleteVisitaMock = vi.fn()

vi.mock('../services/agendaService', () => ({
  listVisitas: (...args: unknown[]) => listVisitasMock(...args),
  listLeadsParaAgendar: (...args: unknown[]) => listLeadsParaAgendarMock(...args),
  createVisita: (...args: unknown[]) => createVisitaMock(...args),
  updateVisitaStatus: (...args: unknown[]) => updateVisitaStatusMock(...args),
  updateVisitaDataHora: (...args: unknown[]) => updateVisitaDataHoraMock(...args),
  deleteVisita: (...args: unknown[]) => deleteVisitaMock(...args),
}))

const getPerfilMock = vi.fn()
vi.mock('@/shared/services/perfilService', () => ({
  getPerfil: (...args: unknown[]) => getPerfilMock(...args),
}))

const { useAgenda } = await import('./useAgenda')

const visitaBase: Visita = {
  id: '1',
  lead_id: 'lead-1',
  data_hora: '2026-01-05T12:00:00.000Z',
  status: 'agendada',
  lead_nome: 'Ana',
  lead_telefone: '11999999999',
}

beforeEach(() => {
  vi.clearAllMocks()
  listLeadsParaAgendarMock.mockResolvedValue([])
  getPerfilMock.mockResolvedValue({
    id: 'user-1',
    nome: 'Ana',
    telefone: null,
    dias_para_contato_padrao: 3,
    horario_inicio: 8,
    horario_fim: 18,
    created_at: '2026-01-01T00:00:00.000Z',
  })
})

describe('useAgenda', () => {
  it('carrega visitas e leads ao montar', async () => {
    listVisitasMock.mockResolvedValue([visitaBase])
    const { result } = renderHook(() => useAgenda())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.visitas).toEqual([visitaBase])
  })

  it('carrega o horário configurado no perfil', async () => {
    listVisitasMock.mockResolvedValue([])
    const { result } = renderHook(() => useAgenda())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.horarioInicio).toBe(8)
    expect(result.current.horarioFim).toBe(18)
  })

  it('usa horário padrão 7-20 se não conseguir buscar o perfil', async () => {
    listVisitasMock.mockResolvedValue([])
    getPerfilMock.mockRejectedValue(new Error('falha'))
    const { result } = renderHook(() => useAgenda())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.horarioInicio).toBe(7)
    expect(result.current.horarioFim).toBe(20)
  })

  it('agendar chama createVisita e recarrega', async () => {
    listVisitasMock.mockResolvedValueOnce([]).mockResolvedValueOnce([visitaBase])
    createVisitaMock.mockResolvedValue(undefined)
    const { result } = renderHook(() => useAgenda())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.agendar('lead-1', '2026-01-05T12:00:00.000Z')
    })

    expect(createVisitaMock).toHaveBeenCalledWith('lead-1', '2026-01-05T12:00:00.000Z')
    expect(result.current.visitas).toEqual([visitaBase])
  })

  it('marcarStatus atualiza otimisticamente', async () => {
    listVisitasMock.mockResolvedValue([visitaBase])
    updateVisitaStatusMock.mockResolvedValue(undefined)
    const { result } = renderHook(() => useAgenda())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.marcarStatus('1', 'realizada')
    })

    expect(result.current.visitas[0].status).toBe('realizada')
    expect(updateVisitaStatusMock).toHaveBeenCalledWith('1', 'realizada')
  })

  it('remover remove a visita do estado', async () => {
    listVisitasMock.mockResolvedValue([visitaBase])
    deleteVisitaMock.mockResolvedValue(undefined)
    const { result } = renderHook(() => useAgenda())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.remover('1')
    })

    expect(result.current.visitas).toEqual([])
  })
})
