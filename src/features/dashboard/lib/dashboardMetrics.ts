import { ETAPA_LABELS } from '@/shared/lib/leadLabels'
import { ETAPAS, ORIGENS } from '@/shared/types/lead'
import type { DashboardLead, FunilItem, Kpis, OrigemItem, TendenciaItem } from '../types/dashboard'

const ETAPAS_ATIVAS: readonly string[] = ETAPAS.filter((etapa) => etapa !== 'fechado')

const ORIGEM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  indicacao: 'Indicação',
  whatsapp: 'WhatsApp',
  prospeccao: 'Prospecção',
}

function inicioDaSemana(data: Date): Date {
  const d = new Date(data)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

export function calcularKpis(leads: DashboardLead[], agora: Date): Kpis {
  const leadsAtivos = leads.filter((lead) => ETAPAS_ATIVAS.includes(lead.etapa)).length
  const fechados = leads.filter((lead) => lead.etapa === 'fechado').length
  const taxaConversao = leads.length > 0 ? fechados / leads.length : 0

  const leadsVencidos = leads.filter(
    (lead) => ETAPAS_ATIVAS.includes(lead.etapa) && new Date(lead.proximo_contato_em) <= agora
  ).length

  return { leadsAtivos, taxaConversao, leadsVencidos }
}

export function calcularFunil(leads: DashboardLead[]): FunilItem[] {
  return ETAPAS.map((etapa) => ({
    etapa,
    label: ETAPA_LABELS[etapa],
    count: leads.filter((lead) => lead.etapa === etapa).length,
  }))
}

export function calcularOrigem(leads: DashboardLead[]): OrigemItem[] {
  const itens: OrigemItem[] = ORIGENS.map((origem) => ({
    origem,
    label: ORIGEM_LABELS[origem],
    count: leads.filter((lead) => lead.origem === origem).length,
  }))

  const semOrigem = leads.filter((lead) => !lead.origem).length
  if (semOrigem > 0) {
    itens.push({ origem: 'nao_informado', label: 'Não informado', count: semOrigem })
  }

  return itens
}

export function calcularTendencia(
  leads: DashboardLead[],
  agora: Date,
  semanas = 8
): TendenciaItem[] {
  const inicioUltimaSemana = inicioDaSemana(agora)
  const inicio = new Date(inicioUltimaSemana)
  inicio.setDate(inicioUltimaSemana.getDate() - (semanas - 1) * 7)

  const buckets: TendenciaItem[] = []
  for (let i = 0; i < semanas; i++) {
    const inicioSemana = new Date(inicio)
    inicioSemana.setDate(inicio.getDate() + i * 7)
    const fimSemana = new Date(inicioSemana)
    fimSemana.setDate(inicioSemana.getDate() + 7)

    const count = leads.filter((lead) => {
      const d = new Date(lead.created_at)
      return d >= inicioSemana && d < fimSemana
    }).length

    const dia = String(inicioSemana.getDate()).padStart(2, '0')
    const mes = String(inicioSemana.getMonth() + 1).padStart(2, '0')
    buckets.push({ semana: `${dia}/${mes}`, count })
  }
  return buckets
}
