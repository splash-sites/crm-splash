import { supabase } from '@/lib/supabaseClient'
import { calcularProximoContato } from '@/shared/lib/proximoContato'
import type { Lead } from '@/shared/types/lead'

export async function listLeadsAtivos(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .not('etapa', 'in', '(fechado)')
    .order('proximo_contato_em', { ascending: true })
  if (error) throw error
  return data as Lead[]
}

export async function marcarContatoHoje(lead: Lead): Promise<void> {
  const agora = new Date().toISOString()
  const { error } = await supabase
    .from('leads')
    .update({
      ultima_interacao: agora,
      proximo_contato_em: calcularProximoContato(agora, lead.dias_para_contato),
    })
    .eq('id', lead.id)
  if (error) throw error
}
