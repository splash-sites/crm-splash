import { describe, expect, it } from 'vitest'
import type { Lead } from '@/shared/types/lead'
import { diasSemUltimoContato, precisaFalarHoje } from './precisaFalarHoje'

function leadBase(overrides: Partial<Lead> = {}): Lead {
  return {
    id: '1',
    corretor_id: 'user-1',
    nome_empresa: 'Empresa Ana',
    nome_contato: 'Ana',
    telefone: '11999999999',
    email: null,
    origem: null,
    produto_interesse: null,
    ticket_estimado: null,
    etapa: 'novo',
    posicao: 0,
    motivo_perda: null,
    ultima_interacao: null,
    dias_para_contato: 3,
    proximo_contato_em: '2026-01-01T00:00:00.000Z',
    observacoes: null,
    created_at: '2025-12-29T00:00:00.000Z',
    updated_at: '2025-12-29T00:00:00.000Z',
    ...overrides,
  }
}

describe('precisaFalarHoje', () => {
  it('true quando proximo_contato_em já passou', () => {
    const lead = leadBase({ proximo_contato_em: '2026-01-01T00:00:00.000Z' })
    expect(precisaFalarHoje(lead, new Date('2026-01-02T00:00:00.000Z'))).toBe(true)
  })

  it('false quando proximo_contato_em ainda não chegou', () => {
    const lead = leadBase({ proximo_contato_em: '2026-01-05T00:00:00.000Z' })
    expect(precisaFalarHoje(lead, new Date('2026-01-02T00:00:00.000Z'))).toBe(false)
  })

  it('false para lead fechado, mesmo com proximo_contato_em vencido', () => {
    const lead = leadBase({ etapa: 'fechado', proximo_contato_em: '2026-01-01T00:00:00.000Z' })
    expect(precisaFalarHoje(lead, new Date('2026-01-02T00:00:00.000Z'))).toBe(false)
  })
})

describe('diasSemUltimoContato', () => {
  it('conta a partir de ultima_interacao quando existe', () => {
    const lead = leadBase({ ultima_interacao: '2026-01-01T00:00:00.000Z' })
    expect(diasSemUltimoContato(lead, new Date('2026-01-04T00:00:00.000Z'))).toBe(3)
  })

  it('conta a partir de created_at quando nunca houve interação', () => {
    const lead = leadBase({ ultima_interacao: null, created_at: '2026-01-01T00:00:00.000Z' })
    expect(diasSemUltimoContato(lead, new Date('2026-01-06T00:00:00.000Z'))).toBe(5)
  })
})
