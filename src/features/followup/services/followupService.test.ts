import { describe, expect, it, vi, beforeEach } from 'vitest'

function chainable(result: unknown) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'not', 'order', 'update', 'eq']
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

const { listLeadsAtivos, marcarContatoHoje } = await import('./followupService')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listLeadsAtivos', () => {
  it('busca leads excluindo fechado', async () => {
    fromMock.mockReturnValue(
      chainable({
        data: [{ id: '1', etapa: 'novo' }],
        error: null,
      })
    )
    const result = await listLeadsAtivos()
    expect(fromMock).toHaveBeenCalledWith('leads')
    expect(result).toEqual([{ id: '1', etapa: 'novo' }])
  })

  it('lança erro quando supabase retorna error', async () => {
    fromMock.mockReturnValue(chainable({ data: null, error: new Error('falha') }))
    await expect(listLeadsAtivos()).rejects.toThrow('falha')
  })
})

describe('marcarContatoHoje', () => {
  it('atualiza ultima_interacao e recalcula proximo_contato_em', async () => {
    fromMock.mockReturnValue(chainable({ error: null }))
    await expect(
      marcarContatoHoje({
        id: '1',
        dias_para_contato: 3,
      } as never)
    ).resolves.toBeUndefined()
    expect(fromMock).toHaveBeenCalledWith('leads')
  })
})
