import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Lead } from '@/shared/types/lead'
import { FollowUpItem } from './FollowUpItem'

function leadBase(overrides: Partial<Lead> = {}): Lead {
  return {
    id: '1',
    corretor_id: 'user-1',
    nome_empresa: 'Empresa Ana',
    nome_contato: 'Ana',
    telefone: '11999999999',
    email: null,
    origem: null,
    produto_interesse: 'software',
    ticket_estimado: 15000,
    etapa: 'novo',
    posicao: 0,
    motivo_perda: null,
    ultima_interacao: null,
    dias_para_contato: 3,
    proximo_contato_em: '2026-01-01T00:00:00.000Z',
    observacoes: 'Cliente quer fechar rápido, já viu proposta de outro fornecedor.',
    created_at: '2025-12-29T00:00:00.000Z',
    updated_at: '2025-12-29T00:00:00.000Z',
    ...overrides,
  }
}

describe('FollowUpItem', () => {
  it('mostra a etapa do lead', () => {
    render(
      <FollowUpItem lead={leadBase({ etapa: 'proposta' })} agora={new Date()} onContatado={vi.fn()} />
    )
    expect(screen.getByText('Proposta')).toBeInTheDocument()
  })

  it('mostra produto de interesse e ticket estimado', () => {
    render(<FollowUpItem lead={leadBase()} agora={new Date()} onContatado={vi.fn()} />)
    expect(screen.getByText('Software')).toBeInTheDocument()
    expect(screen.getByText('R$ 15.000,00')).toBeInTheDocument()
  })

  it('trunca observações e expande ao clicar em "ver mais"', async () => {
    const user = userEvent.setup()
    render(<FollowUpItem lead={leadBase()} agora={new Date()} onContatado={vi.fn()} />)

    const texto = screen.getByText(/Cliente quer fechar rápido/)
    expect(texto).toHaveClass('truncate')

    await user.click(screen.getByRole('button', { name: 'ver mais' }))
    expect(texto).not.toHaveClass('truncate')
    expect(screen.getByRole('button', { name: 'ver menos' })).toBeInTheDocument()
  })

  it('não mostra bloco de tags quando não há produto nem ticket estimado', () => {
    render(
      <FollowUpItem
        lead={leadBase({ produto_interesse: null, ticket_estimado: null, observacoes: null })}
        agora={new Date()}
        onContatado={vi.fn()}
      />
    )
    expect(screen.queryByText('Software')).not.toBeInTheDocument()
  })

  it('chama onContatado ao clicar em "Marcar como concluído"', async () => {
    const onContatado = vi.fn()
    const user = userEvent.setup()
    const lead = leadBase()
    render(<FollowUpItem lead={lead} agora={new Date()} onContatado={onContatado} />)

    await user.click(screen.getByRole('button', { name: 'Marcar como concluído' }))
    expect(onContatado).toHaveBeenCalledWith(lead)
  })
})
