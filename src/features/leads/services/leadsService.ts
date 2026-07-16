import { supabase } from '@/lib/supabaseClient'
import { calcularProximoContato } from '@/shared/lib/proximoContato'
import type { Etapa, Lead, LeadInput } from '@/shared/types/lead'

const DIAS_PARA_CONTATO_PADRAO = 3

async function currentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error('Usuário não autenticado')
  return data.user.id
}

export async function listLeads(): Promise<Lead[]> {
  const { data, error } = await supabase.from('leads').select('*').order('posicao', { ascending: true })
  if (error) throw error
  return data as Lead[]
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const corretorId = await currentUserId()
  const dias = input.dias_para_contato ?? DIAS_PARA_CONTATO_PADRAO
  const agora = new Date().toISOString()

  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...input,
      corretor_id: corretorId,
      dias_para_contato: dias,
      proximo_contato_em: calcularProximoContato(agora, dias),
      posicao: Date.now(),
    })
    .select()
    .single()
  if (error) throw error
  return data as Lead
}

export async function updateLead(id: string, input: LeadInput): Promise<Lead> {
  const { dias_para_contato, ...leadFields } = input

  const updatePayload: Record<string, unknown> = { ...leadFields }
  if (dias_para_contato !== undefined) {
    const { data: current, error: fetchError } = await supabase
      .from('leads')
      .select('ultima_interacao, created_at')
      .eq('id', id)
      .single()
    if (fetchError) throw fetchError

    updatePayload.dias_para_contato = dias_para_contato
    updatePayload.proximo_contato_em = calcularProximoContato(
      current.ultima_interacao ?? current.created_at,
      dias_para_contato
    )
  }

  const { data, error } = await supabase.from('leads').update(updatePayload).eq('id', id).select().single()
  if (error) throw error
  return data as Lead
}

export async function updateLeadPosicao(id: string, etapa: Etapa, posicao: number): Promise<void> {
  const { error } = await supabase.from('leads').update({ etapa, posicao }).eq('id', id)
  if (error) throw error
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error
}
