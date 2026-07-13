import { describe, expect, it } from 'vitest'
import { buildWhatsAppLink } from './whatsapp'

describe('buildWhatsAppLink', () => {
  it('monta link wa.me com DDI 55 e só dígitos', () => {
    expect(buildWhatsAppLink('(51) 99172-6861')).toBe('https://wa.me/5551991726861')
  })

  it('ignora formatação e caracteres não numéricos', () => {
    expect(buildWhatsAppLink('11 98888-7777')).toBe('https://wa.me/5511988887777')
  })
})
