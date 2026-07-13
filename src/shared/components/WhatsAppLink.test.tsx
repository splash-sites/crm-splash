import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WhatsAppLink } from './WhatsAppLink'

describe('WhatsAppLink', () => {
  it('renderiza o telefone mascarado como link pro wa.me, abrindo em nova aba', () => {
    render(<WhatsAppLink telefone="51991726861" />)
    const link = screen.getByRole('link', { name: /\(51\) 99172-6861/ })
    expect(link).toHaveAttribute('href', 'https://wa.me/5551991726861')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveTextContent('(51) 99172-6861')
  })
})
