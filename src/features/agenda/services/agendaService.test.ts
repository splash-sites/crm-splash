import { describe, expect, it, vi, beforeEach } from 'vitest'

function chainable(result: unknown) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'order', 'insert', 'update', 'delete', 'eq']
  for (const method of methods) {
    chain[method] = vi.fn(() => chain)
  }
  chain.then = (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve)
  return chain
}

const fromMock = vi.fn()

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}))

const {
  listVisitas,
  listLeadsParaAgendar,
  createVisita,
  updateVisitaStatus,
  updateVisitaDataHora,
  deleteVisita,
} = await import('./agendaService')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listVisitas', () => {
  it('retorna visitas com nome/telefone do lead achatados', async () => {
    fromMock.mockReturnValue(
      chainable({
        data: [
          {
            id: '1',
            lead_id: 'lead-1',
            data_hora: '2026-01-05T12:00:00.000Z',
            status: 'agendada',
            leads: { nome: 'Ana', telefone: '11999999999' },
          },
        ],
        error: null,
      })
    )
    const result = await listVisitas()
    expect(fromMock).toHaveBeenCalledWith('visitas')
    expect(result).toEqual([
      {
        id: '1',
        lead_id: 'lead-1',
        data_hora: '2026-01-05T12:00:00.000Z',
        status: 'agendada',
        lead_nome: 'Ana',
        lead_telefone: '11999999999',
      },
    ])
  })

  it('lança erro quando supabase retorna error', async () => {
    fromMock.mockReturnValue(chainable({ data: null, error: new Error('falha') }))
    await expect(listVisitas()).rejects.toThrow('falha')
  })
})

describe('listLeadsParaAgendar', () => {
  it('retorna leads ordenados por nome', async () => {
    fromMock.mockReturnValue(
      chainable({ data: [{ id: '1', nome: 'Ana', telefone: '11999999999' }], error: null })
    )
    const result = await listLeadsParaAgendar()
    expect(fromMock).toHaveBeenCalledWith('leads')
    expect(result).toEqual([{ id: '1', nome: 'Ana', telefone: '11999999999' }])
  })
})

describe('createVisita', () => {
  it('insere a visita com lead_id e data_hora', async () => {
    fromMock.mockReturnValue(chainable({ error: null }))
    await expect(createVisita('lead-1', '2026-01-05T12:00:00.000Z')).resolves.toBeUndefined()
    expect(fromMock).toHaveBeenCalledWith('visitas')
  })
})

describe('updateVisitaStatus', () => {
  it('atualiza o status da visita', async () => {
    fromMock.mockReturnValue(chainable({ error: null }))
    await expect(updateVisitaStatus('1', 'realizada')).resolves.toBeUndefined()
    expect(fromMock).toHaveBeenCalledWith('visitas')
  })
})

describe('updateVisitaDataHora', () => {
  it('atualiza a data/hora da visita', async () => {
    fromMock.mockReturnValue(chainable({ error: null }))
    await expect(
      updateVisitaDataHora('1', '2026-01-06T12:00:00.000Z')
    ).resolves.toBeUndefined()
    expect(fromMock).toHaveBeenCalledWith('visitas')
  })
})

describe('deleteVisita', () => {
  it('remove a visita', async () => {
    fromMock.mockReturnValue(chainable({ error: null }))
    await expect(deleteVisita('1')).resolves.toBeUndefined()
    expect(fromMock).toHaveBeenCalledWith('visitas')
  })
})
