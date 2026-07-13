import { describe, expect, it, vi, beforeEach } from 'vitest'

function chainable(result: unknown) {
  const chain: Record<string, unknown> = {}
  const methods = ['select']
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

const { listLeadsResumo, listVisitasResumo } = await import('./dashboardService')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listLeadsResumo', () => {
  it('retorna leads resumidos', async () => {
    fromMock.mockReturnValue(
      chainable({
        data: [{ etapa: 'novo', origem: 'instagram', created_at: '2026-01-01', proximo_contato_em: '2026-01-02' }],
        error: null,
      })
    )
    const result = await listLeadsResumo()
    expect(fromMock).toHaveBeenCalledWith('leads')
    expect(result).toHaveLength(1)
  })

  it('lança erro quando supabase retorna error', async () => {
    fromMock.mockReturnValue(chainable({ data: null, error: new Error('falha') }))
    await expect(listLeadsResumo()).rejects.toThrow('falha')
  })
})

describe('listVisitasResumo', () => {
  it('retorna visitas resumidas', async () => {
    fromMock.mockReturnValue(
      chainable({ data: [{ status: 'agendada', data_hora: '2026-01-05T12:00:00.000Z' }], error: null })
    )
    const result = await listVisitasResumo()
    expect(fromMock).toHaveBeenCalledWith('visitas')
    expect(result).toHaveLength(1)
  })
})
