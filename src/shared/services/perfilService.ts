import { supabase } from '@/lib/supabaseClient'
import type { Perfil, PerfilInput } from '@/shared/types/perfil'

async function currentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error('Usuário não autenticado')
  return data.user.id
}

export async function getDiasParaContatoPadrao(): Promise<number> {
  const id = await currentUserId()
  const { data, error } = await supabase
    .from('perfis')
    .select('dias_para_contato_padrao')
    .eq('id', id)
    .single()
  if (error) throw error
  return data.dias_para_contato_padrao
}

export async function getPerfil(): Promise<Perfil> {
  const id = await currentUserId()
  const { data, error } = await supabase.from('perfis').select('*').eq('id', id).single()
  if (error) throw error
  return data as Perfil
}

export async function updatePerfil(input: PerfilInput): Promise<Perfil> {
  const id = await currentUserId()
  const { data, error } = await supabase
    .from('perfis')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Perfil
}
