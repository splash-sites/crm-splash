import { describe, expect, it } from 'vitest'
import type { DashboardLead, DashboardVisita } from '../types/dashboard'
import { calcularFunil, calcularKpis, calcularOrigem, calcularTendencia } from './dashboardMetrics'

function lead(overrides: Partial<DashboardLead> = {}): DashboardLead {
  return {
    etapa: 'novo',
    origem: 'instagram',
    created_at: '2026-01-05T12:00:00.000Z',
    proximo_contato_em: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

function visita(overrides: Partial<DashboardVisita> = {}): DashboardVisita {
  return {
    status: 'agendada',
    data_hora: '2026-01-05T12:00:00.000Z',
    ...overrides,
  }
}

describe('calcularKpis', () => {
  it('conta leads ativos (exclui fechado/perdido)', () => {
    const leads = [lead({ etapa: 'novo' }), lead({ etapa: 'fechado' }), lead({ etapa: 'perdido' })]
    const kpis = calcularKpis(leads, [], new Date('2026-01-10'))
    expect(kpis.leadsAtivos).toBe(1)
  })

  it('calcula taxa de conversão como fechados/total', () => {
    const leads = [lead({ etapa: 'fechado' }), lead({ etapa: 'novo' }), lead({ etapa: 'perdido' })]
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
      lead({ etapa: 'novo', proximo_contato_em: '2026-01-01T00:00:00.000Z' }),
      lead({ etapa: 'novo', proximo_contato_em: '2026-02-01T00:00:00.000Z' }),
      lead({ etapa: 'fechado', proximo_contato_em: '2026-01-01T00:00:00.000Z' }),
    ]
    const kpis = calcularKpis(leads, [], agora)
    expect(kpis.leadsVencidos).toBe(1)
  })

  it('conta só visitas agendadas dentro da semana atual', () => {
    const agora = new Date('2026-01-07T12:00:00.000Z') // quarta-feira
    const visitas = [
      visita({ status: 'agendada', data_hora: '2026-01-08T09:00:00.000Z' }),
      visita({ status: 'realizada', data_hora: '2026-01-08T09:00:00.000Z' }),
      visita({ status: 'agendada', data_hora: '2026-02-01T09:00:00.000Z' }),
    ]
    const kpis = calcularKpis([], visitas, agora)
    expect(kpis.visitasSemana).toBe(1)
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

describe('calcularTendencia', () => {
  it('retorna um bucket por semana', () => {
    const agora = new Date('2026-01-10T12:00:00.000Z')
    const result = calcularTendencia([], agora, 4)
    expect(result).toHaveLength(4)
  })

  it('conta leads criados na semana certa', () => {
    const agora = new Date('2026-01-14T12:00:00.000Z') // quarta-feira
    const leads = [lead({ created_at: '2026-01-13T09:00:00.000Z' })]
    const result = calcularTendencia(leads, agora, 2)
    const total = result.reduce((soma, item) => soma + item.count, 0)
    expect(total).toBe(1)
    expect(result[result.length - 1].count).toBe(1)
  })
})
