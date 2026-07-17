import { describe, expect, it } from 'vitest'
import type { DashboardLead, EtapaHistoricoRow } from '../types/dashboard'
import {
  calcularFunil,
  calcularKpis,
  calcularOrigem,
  calcularProduto,
  calcularTempoPorEtapa,
} from './dashboardMetrics'

function lead(overrides: Partial<DashboardLead> = {}): DashboardLead {
  return {
    id: 'lead-1',
    etapa: 'novo',
    origem: 'instagram',
    produto_interesse: 'software',
    ticket_estimado: null,
    created_at: '2026-01-05T12:00:00.000Z',
    updated_at: '2026-01-05T12:00:00.000Z',
    proximo_contato_em: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('calcularKpis', () => {
  it('conta leads ativos (exclui fechado)', () => {
    const leads = [lead({ etapa: 'novo' }), lead({ etapa: 'fechado' }), lead({ etapa: 'contactado' })]
    const kpis = calcularKpis(leads, [], new Date('2026-01-10'))
    expect(kpis.leadsAtivos).toBe(2)
  })

  it('calcula taxa de conversão como fechados/total', () => {
    const leads = [lead({ etapa: 'fechado' }), lead({ etapa: 'novo' }), lead({ etapa: 'contactado' })]
    const kpis = calcularKpis(leads, [], new Date('2026-01-10'))
    expect(kpis.taxaConversao).toBeCloseTo(1 / 3)
  })

  it('taxa de conversão é 0 quando não há leads', () => {
    const kpis = calcularKpis([], [], new Date('2026-01-10'))
    expect(kpis.taxaConversao).toBe(0)
  })

  it('conta leads vencidos (ativos e com proximo_contato_em no passado)', () => {
    const agora = new Date('2026-01-10T12:00:00.000Z')
    const leads = [
      lead({ id: '1', etapa: 'novo', proximo_contato_em: '2026-01-01T00:00:00.000Z' }),
      lead({ id: '2', etapa: 'novo', proximo_contato_em: '2026-02-01T00:00:00.000Z' }),
      lead({ id: '3', etapa: 'fechado', proximo_contato_em: '2026-01-01T00:00:00.000Z' }),
    ]
    const kpis = calcularKpis(leads, [], agora)
    expect(kpis.leadsVencidos).toBe(1)
  })

  it('conta leads sem interação', () => {
    const leads = [lead({ id: '1' }), lead({ id: '2' }), lead({ id: '3' })]
    const kpis = calcularKpis(leads, ['1', '3'], new Date('2026-01-10'))
    expect(kpis.leadsSemInteracao).toBe(1)
  })

  it('soma pipeline em aberto só com etapas ativas', () => {
    const leads = [
      lead({ etapa: 'novo', ticket_estimado: 1000 }),
      lead({ etapa: 'negociacao', ticket_estimado: 2000 }),
      lead({ etapa: 'fechado', ticket_estimado: 5000 }),
    ]
    const kpis = calcularKpis(leads, [], new Date('2026-01-10'))
    expect(kpis.pipelineAberto).toBe(3000)
  })

  it('soma fechado no mês só com leads fechados atualizados no mês corrente', () => {
    const agora = new Date('2026-01-20T00:00:00.000Z')
    const leads = [
      lead({ etapa: 'fechado', ticket_estimado: 1000, updated_at: '2026-01-15T00:00:00.000Z' }),
      lead({ etapa: 'fechado', ticket_estimado: 2000, updated_at: '2025-12-15T00:00:00.000Z' }),
    ]
    const kpis = calcularKpis(leads, [], agora)
    expect(kpis.fechadoNoMes).toBe(1000)
  })

  it('calcula ticket médio só com leads fechados que têm ticket', () => {
    const leads = [
      lead({ etapa: 'fechado', ticket_estimado: 1000 }),
      lead({ etapa: 'fechado', ticket_estimado: 3000 }),
      lead({ etapa: 'fechado', ticket_estimado: null }),
    ]
    const kpis = calcularKpis(leads, [], new Date('2026-01-10'))
    expect(kpis.ticketMedio).toBe(2000)
  })

  it('calcula tempo médio até fechar em dias', () => {
    const leads = [
      lead({ etapa: 'fechado', created_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-11T00:00:00.000Z' }),
    ]
    const kpis = calcularKpis(leads, [], new Date('2026-01-20'))
    expect(kpis.tempoMedioFechar).toBe(10)
  })
})

describe('calcularFunil', () => {
  it('conta leads por etapa, incluindo etapas com zero', () => {
    const leads = [lead({ etapa: 'novo' }), lead({ etapa: 'novo' }), lead({ etapa: 'proposta' })]
    const funil = calcularFunil(leads)
    expect(funil.find((f) => f.etapa === 'novo')?.count).toBe(2)
    expect(funil.find((f) => f.etapa === 'proposta')?.count).toBe(1)
    expect(funil.find((f) => f.etapa === 'fechado')?.count).toBe(0)
  })
})

describe('calcularOrigem', () => {
  it('conta leads por origem e agrupa sem origem em "Não informado"', () => {
    const leads = [
      lead({ origem: 'instagram' }),
      lead({ origem: 'instagram' }),
      lead({ origem: null }),
    ]
    const origem = calcularOrigem(leads)
    expect(origem.find((o) => o.origem === 'instagram')?.count).toBe(2)
    expect(origem.find((o) => o.origem === 'nao_informado')?.count).toBe(1)
  })

  it('não inclui "Não informado" quando todos têm origem', () => {
    const leads = [lead({ origem: 'instagram' })]
    const origem = calcularOrigem(leads)
    expect(origem.find((o) => o.origem === 'nao_informado')).toBeUndefined()
  })
})

describe('calcularProduto', () => {
  it('conta leads por produto e agrupa sem produto em "Não informado"', () => {
    const leads = [
      lead({ produto_interesse: 'software' }),
      lead({ produto_interesse: 'landing_page' }),
      lead({ produto_interesse: null }),
    ]
    const produto = calcularProduto(leads)
    expect(produto.find((p) => p.produto === 'software')?.count).toBe(1)
    expect(produto.find((p) => p.produto === 'landing_page')?.count).toBe(1)
    expect(produto.find((p) => p.produto === 'nao_informado')?.count).toBe(1)
  })

  it('não inclui "Não informado" quando todos têm produto', () => {
    const leads = [lead({ produto_interesse: 'software' })]
    const produto = calcularProduto(leads)
    expect(produto.find((p) => p.produto === 'nao_informado')).toBeUndefined()
  })
})

describe('calcularTempoPorEtapa', () => {
  function historico(overrides: Partial<EtapaHistoricoRow> = {}): EtapaHistoricoRow {
    return { lead_id: 'lead-1', etapa: 'novo', entrou_em: '2026-01-01T00:00:00.000Z', ...overrides }
  }

  it('calcula dias entre entrada na etapa e transição pra próxima', () => {
    const agora = new Date('2026-02-01T00:00:00.000Z')
    const rows = [
      historico({ lead_id: '1', etapa: 'novo', entrou_em: '2026-01-01T00:00:00.000Z' }),
      historico({ lead_id: '1', etapa: 'contactado', entrou_em: '2026-01-06T00:00:00.000Z' }),
    ]
    const tempo = calcularTempoPorEtapa(rows, agora)
    expect(tempo.find((t) => t.etapa === 'novo')?.diasMedio).toBe(5)
  })

  it('usa agora como fim quando lead ainda está na etapa (sem transição seguinte)', () => {
    const agora = new Date('2026-01-11T00:00:00.000Z')
    const rows = [historico({ lead_id: '1', etapa: 'novo', entrou_em: '2026-01-01T00:00:00.000Z' })]
    const tempo = calcularTempoPorEtapa(rows, agora)
    expect(tempo.find((t) => t.etapa === 'novo')?.diasMedio).toBe(10)
  })

  it('retorna 0 pra etapas sem nenhuma passagem', () => {
    const tempo = calcularTempoPorEtapa([], new Date('2026-01-10'))
    expect(tempo.find((t) => t.etapa === 'fechado')?.diasMedio).toBe(0)
  })

  it('calcula média entre múltiplos leads na mesma etapa', () => {
    const agora = new Date('2026-02-01T00:00:00.000Z')
    const rows = [
      historico({ lead_id: '1', etapa: 'novo', entrou_em: '2026-01-01T00:00:00.000Z' }),
      historico({ lead_id: '1', etapa: 'contactado', entrou_em: '2026-01-05T00:00:00.000Z' }),
      historico({ lead_id: '2', etapa: 'novo', entrou_em: '2026-01-01T00:00:00.000Z' }),
      historico({ lead_id: '2', etapa: 'contactado', entrou_em: '2026-01-11T00:00:00.000Z' }),
    ]
    const tempo = calcularTempoPorEtapa(rows, agora)
    expect(tempo.find((t) => t.etapa === 'novo')?.diasMedio).toBe(7)
  })
})
