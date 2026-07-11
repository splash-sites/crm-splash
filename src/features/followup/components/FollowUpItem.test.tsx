import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Lead } from '@/shared/types/lead'
import { FollowUpItem } from './FollowUpItem'

function leadBase(overrides: Partial<Lead> = {}): Lead {
  return {
    id: '1',
    corretor_id: 'user-1',
    nome: 'Ana',
    telefone: '11999999999',
    email: null,
    origem: null,
    tipo_imovel: null,
    finalidade: null,
    bairros: ['Centro', 'Zona Sul'],
    faixa_preco: '300k_500k',
    etapa: 'novo',
    posicao: 0,
    motivo_perda: null,
    ultima_interacao: null,
    dias_para_contato: 3,
    proximo_contato_em: '2026-01-01T00:00:00.000Z',
    observacoes: 'Cliente quer fechar rápido, já visitou 2 imóveis na região.',
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

  it('mostra bairros e faixa de preço', () => {
    render(<FollowUpItem lead={leadBase()} agora={new Date()} onContatado={vi.fn()} />)
    expect(screen.getByText('Centro')).toBeInTheDocument()
    expect(screen.getByText('Zona Sul')).toBeInTheDocument()
    expect(screen.getByText('R$ 300 mil - R$ 500 mil')).toBeInTheDocument()
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

  it('não mostra bloco de tags quando não há bairros nem faixa de preço', () => {
    render(
      <FollowUpItem
        lead={leadBase({ bairros: [], faixa_preco: null, observacoes: null })}
        agora={new Date()}
        onContatado={vi.fn()}
      />
    )
    expect(screen.queryByText('R$ 300 mil - R$ 500 mil')).not.toBeInTheDocument()
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
