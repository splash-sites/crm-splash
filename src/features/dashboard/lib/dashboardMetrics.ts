import { ETAPA_LABELS } from '@/shared/lib/leadLabels'
import { ETAPAS, ORIGENS, PRODUTOS_INTERESSE } from '@/shared/types/lead'
import type {
  DashboardLead,
  EtapaHistoricoRow,
  FunilItem,
  Kpis,
  OrigemItem,
  ProdutoItem,
  TempoEtapaItem,
} from '../types/dashboard'

const ETAPAS_ATIVAS: readonly string[] = ETAPAS.filter((etapa) => etapa !== 'fechado')
const MS_POR_DIA = 1000 * 60 * 60 * 24

const ORIGEM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  indicacao: 'Indicação',
  whatsapp: 'WhatsApp',
  prospeccao: 'Prospecção',
}

const PRODUTO_LABELS: Record<string, string> = {
  software: 'Software',
  landing_page: 'Landing Page',
}

function arredondar(valor: number): number {
  return Math.round(valor * 10) / 10
}

export function calcularKpis(
  leads: DashboardLead[],
  leadIdsComInteracao: string[],
  agora: Date
): Kpis {
  const leadsAtivos = leads.filter((lead) => ETAPAS_ATIVAS.includes(lead.etapa)).length
  const fechados = leads.filter((lead) => lead.etapa === 'fechado')
  const taxaConversao = leads.length > 0 ? fechados.length / leads.length : 0

  const leadsVencidos = leads.filter(
    (lead) => ETAPAS_ATIVAS.includes(lead.etapa) && new Date(lead.proximo_contato_em) <= agora
  ).length

  const idsComInteracao = new Set(leadIdsComInteracao)
  const leadsSemInteracao = leads.filter((lead) => !idsComInteracao.has(lead.id)).length

  const pipelineAberto = leads
    .filter((lead) => ETAPAS_ATIVAS.includes(lead.etapa))
    .reduce((soma, lead) => soma + (lead.ticket_estimado ?? 0), 0)

  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)
  const fechadoNoMes = fechados
    .filter((lead) => new Date(lead.updated_at) >= inicioMes)
    .reduce((soma, lead) => soma + (lead.ticket_estimado ?? 0), 0)

  const fechadosComTicket = fechados.filter((lead) => lead.ticket_estimado != null)
  const ticketMedio =
    fechadosComTicket.length > 0
      ? fechadosComTicket.reduce((soma, lead) => soma + (lead.ticket_estimado ?? 0), 0) /
        fechadosComTicket.length
      : 0

  const tempoMedioFechar =
    fechados.length > 0
      ? fechados.reduce((soma, lead) => {
          const dias = (new Date(lead.updated_at).getTime() - new Date(lead.created_at).getTime()) / MS_POR_DIA
          return soma + dias
        }, 0) / fechados.length
      : 0

  return {
    leadsAtivos,
    taxaConversao,
    leadsVencidos,
    leadsSemInteracao,
    pipelineAberto,
    fechadoNoMes,
    ticketMedio: arredondar(ticketMedio),
    tempoMedioFechar: arredondar(tempoMedioFechar),
  }
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

export function calcularProduto(leads: DashboardLead[]): ProdutoItem[] {
  const itens: ProdutoItem[] = PRODUTOS_INTERESSE.map((produto) => ({
    produto,
    label: PRODUTO_LABELS[produto],
    count: leads.filter((lead) => lead.produto_interesse === produto).length,
  }))

  const semProduto = leads.filter((lead) => !lead.produto_interesse).length
  if (semProduto > 0) {
    itens.push({ produto: 'nao_informado', label: 'Não informado', count: semProduto })
  }

  return itens
}

export function calcularTempoPorEtapa(historico: EtapaHistoricoRow[], agora: Date): TempoEtapaItem[] {
  const porLead = new Map<string, EtapaHistoricoRow[]>()
  for (const row of historico) {
    const lista = porLead.get(row.lead_id) ?? []
    lista.push(row)
    porLead.set(row.lead_id, lista)
  }

  const duracoesPorEtapa = new Map<string, number[]>()
  for (const lista of porLead.values()) {
    const ordenada = [...lista].sort(
      (a, b) => new Date(a.entrou_em).getTime() - new Date(b.entrou_em).getTime()
    )
    for (let i = 0; i < ordenada.length; i++) {
      const atual = ordenada[i]
      const fim = i + 1 < ordenada.length ? new Date(ordenada[i + 1].entrou_em) : agora
      const dias = (fim.getTime() - new Date(atual.entrou_em).getTime()) / MS_POR_DIA
      const duracoes = duracoesPorEtapa.get(atual.etapa) ?? []
      duracoes.push(dias)
      duracoesPorEtapa.set(atual.etapa, duracoes)
    }
  }

  return ETAPAS.map((etapa) => {
    const duracoes = duracoesPorEtapa.get(etapa) ?? []
    const media = duracoes.length > 0 ? duracoes.reduce((soma, d) => soma + d, 0) / duracoes.length : 0
    return { etapa, label: ETAPA_LABELS[etapa], diasMedio: arredondar(media) }
  })
}
