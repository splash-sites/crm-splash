import { describe, expect, it } from 'vitest'
import type { Visita } from '../types/visita'
import { diasComVisita, mesmaData, opcoesDeHorario, visitasDoDia } from './agendaHelpers'

function visita(overrides: Partial<Visita> = {}): Visita {
  return {
    id: '1',
    lead_id: 'lead-1',
    data_hora: '2026-01-05T12:00:00.000Z',
    status: 'agendada',
    lead_nome: 'Ana',
    lead_telefone: '11999999999',
    ...overrides,
  }
}

describe('mesmaData', () => {
  it('true pro mesmo dia, horários diferentes', () => {
    expect(mesmaData(new Date(2026, 0, 5, 9, 0), new Date(2026, 0, 5, 18, 0))).toBe(true)
  })

  it('false pra dias diferentes', () => {
    expect(mesmaData(new Date(2026, 0, 5), new Date(2026, 0, 6))).toBe(false)
  })
})

describe('visitasDoDia', () => {
  it('filtra só as visitas do dia informado, ordenadas por horário', () => {
    const v1 = visita({ id: '1', data_hora: '2026-01-05T15:00:00.000-03:00' })
    const v2 = visita({ id: '2', data_hora: '2026-01-05T09:00:00.000-03:00' })
    const v3 = visita({ id: '3', data_hora: '2026-01-06T09:00:00.000-03:00' })
    const result = visitasDoDia([v1, v2, v3], new Date(2026, 0, 5))
    expect(result.map((v) => v.id)).toEqual(['2', '1'])
  })
})

describe('diasComVisita', () => {
  it('retorna um Date por dia único que tem visita', () => {
    const v1 = visita({ id: '1', data_hora: '2026-01-05T15:00:00.000-03:00' })
    const v2 = visita({ id: '2', data_hora: '2026-01-05T09:00:00.000-03:00' })
    const v3 = visita({ id: '3', data_hora: '2026-01-06T09:00:00.000-03:00' })
    const result = diasComVisita([v1, v2, v3])
    expect(result).toHaveLength(2)
  })
})

describe('opcoesDeHorario', () => {
  it('gera horários de 30 em 30 minutos dentro do intervalo', () => {
    expect(opcoesDeHorario(7, 9)).toEqual([
      '07:00',
      '07:30',
      '08:00',
      '08:30',
      '09:00',
    ])
  })

  it('aceita passo customizado', () => {
    expect(opcoesDeHorario(9, 10, 60)).toEqual(['09:00', '10:00'])
  })
})
