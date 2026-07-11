import { describe, expect, it } from 'vitest'
import { calcularProximoContato } from './proximoContato'

describe('calcularProximoContato', () => {
  it('soma os dias à data base', () => {
    const base = '2026-01-01T10:00:00.000Z'
    const result = calcularProximoContato(base, 3)
    expect(new Date(result).toISOString()).toBe('2026-01-04T10:00:00.000Z')
  })

  it('funciona com 0 dias (mesma data)', () => {
    const base = '2026-01-01T10:00:00.000Z'
    expect(calcularProximoContato(base, 0)).toBe(base)
  })

  it('cruza virada de mês corretamente', () => {
    const base = '2026-01-30T10:00:00.000Z'
    const result = calcularProximoContato(base, 5)
    expect(new Date(result).toISOString()).toBe('2026-02-04T10:00:00.000Z')
  })
})
