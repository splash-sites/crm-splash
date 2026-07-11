import { describe, expect, it } from 'vitest'
import { supabase } from './supabaseClient'

describe('RLS - acesso anônimo', () => {
  it('bloqueia leitura de leads sem sessão autenticada', async () => {
    const { data, error } = await supabase.from('leads').select('*')
    expect(error).toBeNull()
    expect(data).toEqual([])
  })

  it('bloqueia inserção de lead sem sessão autenticada', async () => {
    const { error } = await supabase.from('leads').insert({
      corretor_id: '00000000-0000-0000-0000-000000000000',
      nome: 'teste',
      telefone: '11999999999',
    })
    expect(error).not.toBeNull()
  })

  it('bloqueia leitura de perfis sem sessão autenticada', async () => {
    const { data, error } = await supabase.from('perfis').select('*')
    expect(error).toBeNull()
    expect(data).toEqual([])
  })
})
