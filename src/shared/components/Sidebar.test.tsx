import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Sidebar } from './Sidebar'

describe('Sidebar', () => {
  it('renderiza todos os itens de navegação do CLAUDE.md', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    expect(screen.getByText('Funil de leads')).toBeInTheDocument()
    expect(screen.getByText('Falar hoje')).toBeInTheDocument()
    expect(screen.getByText('Agenda de visitas')).toBeInTheDocument()
    expect(screen.getByText('Conversas')).toBeInTheDocument()
    expect(screen.getByText('Configurações')).toBeInTheDocument()
  })

  it('"Funil de leads" e "Falar hoje" são links navegáveis, resto fica desabilitado', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /Funil de leads/ })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /Falar hoje/ })).toHaveAttribute(
      'href',
      '/falar-hoje'
    )
    expect(screen.queryByRole('link', { name: /Agenda de visitas/ })).not.toBeInTheDocument()
    expect(screen.getByText('Agenda de visitas').closest('span')).toHaveAttribute(
      'aria-disabled',
      'true'
    )
    expect(screen.getByRole('link', { name: /Configurações/ })).toHaveAttribute(
      'href',
      '/configuracoes'
    )
  })
})
