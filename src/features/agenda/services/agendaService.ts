import { supabase } from '@/lib/supabaseClient'
import type { LeadOption, Visita, VisitaStatus } from '../types/visita'

type VisitaRow = {
  id: string
  lead_id: string
  data_hora: string
  status: VisitaStatus
  leads: { nome: string; telefone: string } | null
}

function toVisita(row: VisitaRow): Visita {
  return {
    id: row.id,
    lead_id: row.lead_id,
    data_hora: row.data_hora,
    status: row.status,
    lead_nome: row.leads?.nome ?? '',
    lead_telefone: row.leads?.telefone ?? '',
  }
}

export async function listVisitas(): Promise<Visita[]> {
  const { data, error } = await supabase
    .from('visitas')
    .select('id, lead_id, data_hora, status, leads(nome, telefone)')
    .order('data_hora', { ascending: true })
  if (error) throw error
  return (data as unknown as VisitaRow[]).map(toVisita)
}

export async function listLeadsParaAgendar(): Promise<LeadOption[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('id, nome, telefone')
    .order('nome', { ascending: true })
  if (error) throw error
  return data as LeadOption[]
}

export async function createVisita(leadId: string, dataHora: string): Promise<void> {
  const { error } = await supabase
    .from('visitas')
    .insert({ lead_id: leadId, data_hora: dataHora })
  if (error) throw error
}

export async function updateVisitaStatus(id: string, status: VisitaStatus): Promise<void> {
  const { error } = await supabase.from('visitas').update({ status }).eq('id', id)
  if (error) throw error
}

export async function updateVisitaDataHora(id: string, dataHora: string): Promise<void> {
  const { error } = await supabase.from('visitas').update({ data_hora: dataHora }).eq('id', id)
  if (error) throw error
}

export async function deleteVisita(id: string): Promise<void> {
  const { error } = await supabase.from('visitas').delete().eq('id', id)
  if (error) throw error
}
