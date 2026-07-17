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

const { listEtapaHistorico, listLeadIdsComInteracao, listLeadsResumo } = await import('./dashboardService')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listLeadsResumo', () => {
  it('retorna leads resumidos', async () => {
    fromMock.mockReturnValue(
      chainable({
        data: [
          {
            id: '1',
            etapa: 'novo',
            origem: 'instagram',
            produto_interesse: 'software',
            ticket_estimado: 1000,
            created_at: '2026-01-01',
            updated_at: '2026-01-01',
            proximo_contato_em: '2026-01-02',
          },
        ],
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

describe('listLeadIdsComInteracao', () => {
  it('retorna ids únicos de leads com interação', async () => {
    fromMock.mockReturnValue(
      chainable({ data: [{ lead_id: '1' }, { lead_id: '1' }, { lead_id: '2' }], error: null })
    )
    const result = await listLeadIdsComInteracao()
    expect(fromMock).toHaveBeenCalledWith('interacoes')
    expect(result).toEqual(['1', '2'])
  })

  it('lança erro quando supabase retorna error', async () => {
    fromMock.mockReturnValue(chainable({ data: null, error: new Error('falha') }))
    await expect(listLeadIdsComInteracao()).rejects.toThrow('falha')
  })
})

describe('listEtapaHistorico', () => {
  it('retorna histórico de etapas', async () => {
    fromMock.mockReturnValue(
      chainable({
        data: [{ lead_id: '1', etapa: 'novo', entrou_em: '2026-01-01T00:00:00.000Z' }],
        error: null,
      })
    )
    const result = await listEtapaHistorico()
    expect(fromMock).toHaveBeenCalledWith('etapa_historico')
    expect(result).toHaveLength(1)
  })

  it('lança erro quando supabase retorna error', async () => {
    fromMock.mockReturnValue(chainable({ data: null, error: new Error('falha') }))
    await expect(listEtapaHistorico()).rejects.toThrow('falha')
  })
})
