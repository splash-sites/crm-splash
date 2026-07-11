import { supabase } from '@/lib/supabaseClient'
import { toLead, type LeadRow } from '@/shared/lib/leadRow'
import { calcularProximoContato } from '@/shared/lib/proximoContato'
import type { Etapa, Lead, LeadInput } from '@/shared/types/lead'

const DIAS_PARA_CONTATO_PADRAO = 3

async function currentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error('Usuário não autenticado')
  return data.user.id
}

async function syncLeadBairros(
  corretorId: string,
  leadId: string,
  nomes: string[]
): Promise<string[]> {
  const cleaned = [...new Set(nomes.map((nome) => nome.trim()).filter(Boolean))]

  const { error: deleteError } = await supabase
    .from('lead_bairros')
    .delete()
    .eq('lead_id', leadId)
  if (deleteError) throw deleteError

  if (cleaned.length === 0) return []

  const { data: bairrosData, error: upsertError } = await supabase
    .from('bairros')
    .upsert(
      cleaned.map((nome) => ({ corretor_id: corretorId, nome })),
      { onConflict: 'corretor_id,nome' }
    )
    .select('id, nome')
  if (upsertError) throw upsertError

  const rows = (bairrosData as { id: string; nome: string }[]).map((bairro) => ({
    lead_id: leadId,
    bairro_id: bairro.id,
  }))
  const { error: insertError } = await supabase.from('lead_bairros').insert(rows)
  if (insertError) throw insertError

  return cleaned
}

export async function listLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*, lead_bairros(bairros(nome))')
    .order('posicao', { ascending: true })
  if (error) throw error
  return (data as LeadRow[]).map(toLead)
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const corretorId = await currentUserId()
  const { bairros, dias_para_contato, ...leadFields } = input

  const dias = dias_para_contato ?? DIAS_PARA_CONTATO_PADRAO
  const agora = new Date().toISOString()

  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...leadFields,
      corretor_id: corretorId,
      dias_para_contato: dias,
      proximo_contato_em: calcularProximoContato(agora, dias),
      posicao: Date.now(),
    })
    .select()
    .single()
  if (error) throw error

  const savedBairros = await syncLeadBairros(corretorId, data.id, bairros ?? [])
  return { ...(data as Omit<Lead, 'bairros'>), bairros: savedBairros }
}

export async function updateLead(id: string, input: LeadInput): Promise<Lead> {
  const corretorId = await currentUserId()
  const { bairros, dias_para_contato, ...leadFields } = input

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

  const { data, error } = await supabase
    .from('leads')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error

  const savedBairros = await syncLeadBairros(corretorId, id, bairros ?? [])
  return { ...(data as Omit<Lead, 'bairros'>), bairros: savedBairros }
}

export async function updateLeadPosicao(id: string, etapa: Etapa, posicao: number): Promise<void> {
  const { error } = await supabase.from('leads').update({ etapa, posicao }).eq('id', id)
  if (error) throw error
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error
}

export async function listBairros(): Promise<string[]> {
  const { data, error } = await supabase.from('bairros').select('nome').order('nome')
  if (error) throw error
  return (data as { nome: string }[]).map((row) => row.nome)
}
