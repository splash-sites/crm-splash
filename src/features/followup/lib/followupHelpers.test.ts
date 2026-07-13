import { describe, expect, it } from 'vitest'
import type { Lead } from '@/shared/types/lead'
import { diasComFollowUp, leadsDoDia } from './followupHelpers'

function lead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: '1',
    corretor_id: 'corretor-1',
    nome: 'Ana',
    telefone: '11999999999',
    email: null,
    origem: null,
    tipo_imovel: null,
    finalidade: null,
    faixa_preco: null,
    etapa: 'novo',
    motivo_perda: null,
    ultima_interacao: null,
    proximo_contato_em: '2026-01-05T12:00:00.000Z',
    dias_para_contato: 3,
    observacoes: null,
    posicao: 0,
    bairros: [],
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('leadsDoDia', () => {
  it('filtra leads cujo proximo_contato_em cai no dia informado', () => {
    const leads = [
      lead({ id: '1', proximo_contato_em: '2026-01-05T09:00:00.000Z' }),
      lead({ id: '2', proximo_contato_em: '2026-01-06T09:00:00.000Z' }),
    ]
    const result = leadsDoDia(leads, new Date(2026, 0, 5))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('ordena por proximo_contato_em crescente', () => {
    const leads = [
      lead({ id: '1', proximo_contato_em: '2026-01-05T18:00:00.000Z' }),
      lead({ id: '2', proximo_contato_em: '2026-01-05T09:00:00.000Z' }),
    ]
    const result = leadsDoDia(leads, new Date(2026, 0, 5))
    expect(result.map((l) => l.id)).toEqual(['2', '1'])
  })
})

describe('diasComFollowUp', () => {
  it('retorna um dia por data distinta de proximo_contato_em', () => {
    const leads = [
      lead({ id: '1', proximo_contato_em: '2026-01-05T09:00:00.000Z' }),
      lead({ id: '2', proximo_contato_em: '2026-01-05T20:00:00.000Z' }),
      lead({ id: '3', proximo_contato_em: '2026-01-06T09:00:00.000Z' }),
    ]
    const dias = diasComFollowUp(leads)
    expect(dias).toHaveLength(2)
  })
})
