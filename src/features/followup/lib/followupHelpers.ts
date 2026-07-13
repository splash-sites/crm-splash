import { mesmaData } from '@/shared/lib/dates'
import type { Lead } from '@/shared/types/lead'

export function leadsDoDia(leads: Lead[], dia: Date): Lead[] {
  return leads
    .filter((lead) => mesmaData(new Date(lead.proximo_contato_em), dia))
    .sort((a, b) => new Date(a.proximo_contato_em).getTime() - new Date(b.proximo_contato_em).getTime())
}

export function diasComFollowUp(leads: Lead[]): Date[] {
  const vistos = new Set<string>()
  const dias: Date[] = []
  for (const lead of leads) {
    const d = new Date(lead.proximo_contato_em)
    const chave = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (!vistos.has(chave)) {
      vistos.add(chave)
      dias.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
    }
  }
  return dias
}
