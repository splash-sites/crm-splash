import { describe, expect, it, vi, beforeEach } from 'vitest'

function chainable(result: unknown) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'order', 'insert', 'update', 'delete', 'eq', 'single', 'upsert', 'not']
  for (const method of methods) {
    chain[method] = vi.fn(() => chain)
  }
  chain.then = (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve)
  return chain
}

const fromMock = vi.fn()
const getUserMock = vi.fn()

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
    auth: {
      getUser: (...args: unknown[]) => getUserMock(...args),
    },
  },
}))

const { listLeads, createLead, updateLead, updateLeadPosicao, deleteLead, listBairros } =
  await import('./leadsService')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('leadsService', () => {
  it('listLeads retorna os leads com bairros achatados', async () => {
    fromMock.mockReturnValue(
      chainable({
        data: [
          {
            id: '1',
            nome: 'Ana',
            lead_bairros: [{ bairros: { nome: 'Centro' } }, { bairros: { nome: 'Zona Sul' } }],
          },
        ],
        error: null,
      })
    )
    const result = await listLeads()
    expect(fromMock).toHaveBeenCalledWith('leads')
    expect(result).toEqual([{ id: '1', nome: 'Ana', bairros: ['Centro', 'Zona Sul'] }])
  })

  it('listLeads lança erro quando supabase retorna error', async () => {
    fromMock.mockReturnValue(chainable({ data: null, error: new Error('falha') }))
    await expect(listLeads()).rejects.toThrow('falha')
  })

  it('createLead usa o usuário logado como corretor_id e sincroniza bairros', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    const chains: Record<string, ReturnType<typeof chainable>> = {
      leads: chainable({ data: { id: '1', nome: 'Ana' }, error: null }),
      lead_bairros: chainable({ error: null }),
      bairros: chainable({
        data: [{ id: 'b1', nome: 'Centro' }],
        error: null,
      }),
    }
    fromMock.mockImplementation((table: string) => chains[table])

    const result = await createLead({ nome: 'Ana', telefone: '11999999999', bairros: ['Centro'] })
    expect(result).toEqual({ id: '1', nome: 'Ana', bairros: ['Centro'] })
  })

  it('createLead lança erro quando não há usuário logado', async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: null })
    await expect(createLead({ nome: 'Ana', telefone: '11999999999' })).rejects.toThrow(
      'Usuário não autenticado'
    )
  })

  it('updateLead atualiza os campos do lead e sincroniza bairros', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    const chains: Record<string, ReturnType<typeof chainable>> = {
      leads: chainable({ data: { id: '1', nome: 'Ana Paula' }, error: null }),
      lead_bairros: chainable({ error: null }),
      bairros: chainable({ data: [], error: null }),
    }
    fromMock.mockImplementation((table: string) => chains[table])

    const result = await updateLead('1', { nome: 'Ana Paula', telefone: '11999999999' })
    expect(result).toEqual({ id: '1', nome: 'Ana Paula', bairros: [] })
  })

  it('updateLeadPosicao atualiza etapa e posição do lead', async () => {
    fromMock.mockReturnValue(chainable({ error: null }))
    await expect(updateLeadPosicao('1', 'proposta', 500)).resolves.toBeUndefined()
    expect(fromMock).toHaveBeenCalledWith('leads')
  })

  it('deleteLead remove o lead', async () => {
    fromMock.mockReturnValue(chainable({ error: null }))
    await expect(deleteLead('1')).resolves.toBeUndefined()
    expect(fromMock).toHaveBeenCalledWith('leads')
  })

  it('listBairros retorna nomes de bairros do corretor', async () => {
    fromMock.mockReturnValue(
      chainable({ data: [{ nome: 'Centro' }, { nome: 'Zona Sul' }], error: null })
    )
    const result = await listBairros()
    expect(fromMock).toHaveBeenCalledWith('bairros')
    expect(result).toEqual(['Centro', 'Zona Sul'])
  })
})
