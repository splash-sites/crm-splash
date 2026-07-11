import { describe, expect, it } from 'vitest'
import type { Lead } from '@/shared/types/lead'
import { resolveDrop } from './resolveDrop'

function lead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: '1',
    corretor_id: 'user-1',
    nome: 'Ana',
    telefone: '11999999999',
    email: null,
    origem: null,
    tipo_imovel: null,
    finalidade: null,
    bairros: [],
    faixa_preco: null,
    etapa: 'novo',
    posicao: 0,
    motivo_perda: null,
    ultima_interacao: null,
    dias_para_contato: 3,
    proximo_contato_em: '2026-01-01T00:00:00.000Z',
    observacoes: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('resolveDrop', () => {
  it('retorna null quando não há destino', () => {
    expect(resolveDrop([lead()], '1', null)).toBeNull()
  })

  it('retorna null quando solta em cima de si mesmo', () => {
    expect(resolveDrop([lead()], '1', '1')).toBeNull()
  })

  it('retorna null quando o lead ativo não existe', () => {
    expect(resolveDrop([lead()], 'inexistente', 'novo')).toBeNull()
  })

  it('solto na coluna vazia (etapa), fica com posicao 0', () => {
    const a = lead({ id: '1', etapa: 'novo', posicao: 0 })
    const result = resolveDrop([a], '1', 'em_contato')
    expect(result).toEqual({ etapa: 'em_contato', posicao: 0 })
  })

  it('solto no fim de uma coluna com leads, fica depois do último', () => {
    const a = lead({ id: '1', etapa: 'novo', posicao: 0 })
    const b = lead({ id: '2', etapa: 'em_contato', posicao: 500 })
    const result = resolveDrop([a, b], '1', 'em_contato')
    expect(result).toEqual({ etapa: 'em_contato', posicao: 1500 })
  })

  it('solto em cima de um lead sem anterior, fica antes dele', () => {
    const a = lead({ id: '1', etapa: 'novo', posicao: 0 })
    const b = lead({ id: '2', etapa: 'em_contato', posicao: 500 })
    const result = resolveDrop([a, b], '1', '2')
    expect(result).toEqual({ etapa: 'em_contato', posicao: -500 })
  })

  it('solto entre dois leads, fica na média das posições', () => {
    const a = lead({ id: '1', etapa: 'novo', posicao: 0 })
    const b = lead({ id: '2', etapa: 'em_contato', posicao: 100 })
    const c = lead({ id: '3', etapa: 'em_contato', posicao: 300 })
    const result = resolveDrop([a, b, c], '1', '3')
    expect(result).toEqual({ etapa: 'em_contato', posicao: 200 })
  })

  it('reordena dentro da mesma coluna', () => {
    const a = lead({ id: '1', etapa: 'novo', posicao: 0 })
    const b = lead({ id: '2', etapa: 'novo', posicao: 100 })
    const c = lead({ id: '3', etapa: 'novo', posicao: 200 })
    const result = resolveDrop([a, b, c], '3', '1')
    expect(result).toEqual({ etapa: 'novo', posicao: -1000 })
  })
})
