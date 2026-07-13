import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { NotFound } from './NotFound'

describe('NotFound', () => {
  it('mostra mensagem e link de volta pro início', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(screen.getByText('Página não encontrada')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar para o início' })).toHaveAttribute(
      'href',
      '/dashboard'
    )
  })
})
