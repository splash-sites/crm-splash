import { supabase } from '@/lib/supabaseClient'
import type { DashboardLead } from '../types/dashboard'

export async function listLeadsResumo(): Promise<DashboardLead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('etapa, origem, created_at, proximo_contato_em')
  if (error) throw error
  return data as DashboardLead[]
}
