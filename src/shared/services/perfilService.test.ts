import { describe, expect, it, vi, beforeEach } from 'vitest'

function chainable(result: unknown) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'eq', 'single', 'update']
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

const { getDiasParaContatoPadrao, getPerfil, updatePerfil } = await import('./perfilService')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getDiasParaContatoPadrao', () => {
  it('retorna o padrão configurado no perfil do usuário logado', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    fromMock.mockReturnValue(
      chainable({ data: { dias_para_contato_padrao: 5 }, error: null })
    )
    const result = await getDiasParaContatoPadrao()
    expect(fromMock).toHaveBeenCalledWith('perfis')
    expect(result).toBe(5)
  })

  it('lança erro quando não há usuário logado', async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: null })
    await expect(getDiasParaContatoPadrao()).rejects.toThrow('Usuário não autenticado')
  })
})

describe('getPerfil', () => {
  it('retorna o perfil do usuário logado', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    fromMock.mockReturnValue(
      chainable({
        data: { id: 'user-1', nome: 'Ana', telefone: '11999999999', dias_para_contato_padrao: 3 },
        error: null,
      })
    )
    const result = await getPerfil()
    expect(fromMock).toHaveBeenCalledWith('perfis')
    expect(result).toEqual({
      id: 'user-1',
      nome: 'Ana',
      telefone: '11999999999',
      dias_para_contato_padrao: 3,
    })
  })
})

describe('updatePerfil', () => {
  it('atualiza e retorna o perfil', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    fromMock.mockReturnValue(
      chainable({ data: { id: 'user-1', nome: 'Ana Paula' }, error: null })
    )
    const result = await updatePerfil({ nome: 'Ana Paula' })
    expect(fromMock).toHaveBeenCalledWith('perfis')
    expect(result).toEqual({ id: 'user-1', nome: 'Ana Paula' })
  })
})
