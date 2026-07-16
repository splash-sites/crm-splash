import { describe, expect, it, vi, beforeEach } from 'vitest'

function chainable(result: unknown) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'order', 'insert', 'update', 'delete', 'eq', 'single', 'not']
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

const { listLeads, createLead, updateLead, updateLeadPosicao, deleteLead } =
  await import('./leadsService')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('leadsService', () => {
  it('listLeads retorna os leads', async () => {
    fromMock.mockReturnValue(
      chainable({
        data: [{ id: '1', nome_empresa: 'Empresa Ana', nome_contato: 'Ana' }],
        error: null,
      })
    )
    const result = await listLeads()
    expect(fromMock).toHaveBeenCalledWith('leads')
    expect(result).toEqual([{ id: '1', nome_empresa: 'Empresa Ana', nome_contato: 'Ana' }])
  })

  it('listLeads lança erro quando supabase retorna error', async () => {
    fromMock.mockReturnValue(chainable({ data: null, error: new Error('falha') }))
    await expect(listLeads()).rejects.toThrow('falha')
  })

  it('createLead usa o usuário logado como corretor_id', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    const chain = chainable({
      data: { id: '1', nome_empresa: 'Empresa Ana', nome_contato: 'Ana' },
      error: null,
    })
    fromMock.mockReturnValue(chain)

    const result = await createLead({
      nome_empresa: 'Empresa Ana',
      nome_contato: 'Ana',
      telefone: '11999999999',
    })
    expect(fromMock).toHaveBeenCalledWith('leads')
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ corretor_id: 'user-1', nome_empresa: 'Empresa Ana' })
    )
    expect(result).toEqual({ id: '1', nome_empresa: 'Empresa Ana', nome_contato: 'Ana' })
  })

  it('createLead lança erro quando não há usuário logado', async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: null })
    await expect(
      createLead({ nome_empresa: 'Empresa Ana', nome_contato: 'Ana', telefone: '11999999999' })
    ).rejects.toThrow('Usuário não autenticado')
  })

  it('updateLead atualiza os campos do lead', async () => {
    fromMock.mockReturnValue(
      chainable({ data: { id: '1', nome_empresa: 'Empresa Ana Paula' }, error: null })
    )

    const result = await updateLead('1', {
      nome_empresa: 'Empresa Ana Paula',
      nome_contato: 'Ana Paula',
      telefone: '11999999999',
    })
    expect(result).toEqual({ id: '1', nome_empresa: 'Empresa Ana Paula' })
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
})
