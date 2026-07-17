import { supabase } from '@/lib/supabaseClient'
import type { DashboardLead, EtapaHistoricoRow } from '../types/dashboard'

export async function listLeadsResumo(): Promise<DashboardLead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('id, etapa, origem, produto_interesse, ticket_estimado, created_at, updated_at, proximo_contato_em')
  if (error) throw error
  return data as DashboardLead[]
}

export async function listLeadIdsComInteracao(): Promise<string[]> {
  const { data, error } = await supabase.from('interacoes').select('lead_id')
  if (error) throw error
  return [...new Set((data as { lead_id: string }[]).map((row) => row.lead_id))]
}

export async function listEtapaHistorico(): Promise<EtapaHistoricoRow[]> {
  const { data, error } = await supabase.from('etapa_historico').select('lead_id, etapa, entrou_em')
  if (error) throw error
  return data as EtapaHistoricoRow[]
}
