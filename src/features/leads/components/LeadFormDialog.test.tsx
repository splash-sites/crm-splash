import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Lead } from '@/shared/types/lead'

const listBairrosMock = vi.fn()
vi.mock('../services/leadsService', () => ({
  listBairros: (...args: unknown[]) => listBairrosMock(...args),
}))

const { LeadFormDialog } = await import('./LeadFormDialog')

const lead: Lead = {
  id: '1',
  corretor_id: 'user-1',
  nome: 'Ana',
  telefone: '11999999999',
  email: 'ana@example.com',
  origem: 'instagram',
  tipo_imovel: 'apartamento',
  finalidade: 'comprar',
  bairros: ['Centro', 'Zona Sul'],
  faixa_preco: '300k_500k',
  etapa: 'novo',
  posicao: 0,
  motivo_perda: null,
  ultima_interacao: null,
  dias_para_contato: 3,
  proximo_contato_em: '2026-01-01T00:00:00.000Z',
  observacoes: 'cliente exigente',
  created_at: '',
  updated_at: '',
}

beforeEach(() => {
  vi.clearAllMocks()
  listBairrosMock.mockResolvedValue([])
})

describe('LeadFormDialog', () => {
  it('modo criar: campos começam vazios e onSubmit recebe os dados preenchidos', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    expect(screen.getByLabelText('Nome')).toHaveValue('')
    expect(screen.getByLabelText('Telefone')).toHaveValue('')

    await user.type(screen.getByLabelText('Nome'), 'Bruno')
    await user.type(screen.getByLabelText('Telefone'), '11988887777')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ nome: 'Bruno', telefone: '11988887777', etapa: 'novo' })
    )
  })

  it('modo editar: campos vêm pré-preenchidos com os dados do lead', () => {
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={lead} onSubmit={vi.fn()} />)

    expect(screen.getByLabelText('Nome')).toHaveValue('Ana')
    expect(screen.getByLabelText('Telefone')).toHaveValue('(11) 99999-9999')
    expect(screen.getByLabelText('Email')).toHaveValue('ana@example.com')
    expect(screen.getByText('Centro')).toBeInTheDocument()
    expect(screen.getByText('Zona Sul')).toBeInTheDocument()
    expect(screen.getByLabelText('Etapa')).toHaveTextContent('Novo')
    expect(screen.getByLabelText('Faixa de preço')).toHaveTextContent('R$ 300 mil - R$ 500 mil')
    expect(screen.getByLabelText('Observações')).toHaveValue('cliente exigente')
  })

  it('permite cadastrar lead já em etapa avançada', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Bruno')
    await user.type(screen.getByLabelText('Telefone'), '11988887777')
    await user.click(screen.getByLabelText('Etapa'))
    await user.click(await screen.findByRole('option', { name: 'Proposta' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ etapa: 'proposta' }))
  })

  it('bloqueia salvar com nome muito curto e mostra erro no campo', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'A')
    await user.type(screen.getByLabelText('Telefone'), '11988887777')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText(/pelo menos 2 caracteres/)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bloqueia salvar com email inválido e mostra erro no campo', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Bruno')
    await user.type(screen.getByLabelText('Telefone'), '11988887777')
    await user.type(screen.getByLabelText('Email'), 'invalido')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText('Email inválido')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('mostra contador de caracteres em observações', async () => {
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={vi.fn()} />)

    await user.type(screen.getByLabelText('Observações'), 'teste')
    expect(screen.getByText('5/1000')).toBeInTheDocument()
  })

  it('sugere bairros já usados pelo corretor no campo bairro', async () => {
    listBairrosMock.mockResolvedValue(['Centro', 'Zona Sul'])
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={vi.fn()} />)

    await waitFor(() => {
      const options = document.querySelectorAll('#lead-bairros-suggestions option')
      expect(options).toHaveLength(2)
    })
    const values = Array.from(
      document.querySelectorAll('#lead-bairros-suggestions option')
    ).map((option) => option.getAttribute('value'))
    expect(values).toEqual(['Centro', 'Zona Sul'])
  })

  it('adiciona bairro digitado e envia junto no submit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Bruno')
    await user.type(screen.getByLabelText('Telefone'), '11988887777')
    await user.type(screen.getByLabelText('Bairros de interesse'), 'Centro{Enter}')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ bairros: ['Centro'] }))
  })

  it('mostra erro quando onSubmit falha', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('falha ao salvar'))
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Bruno')
    await user.type(screen.getByLabelText('Telefone'), '11988887777')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('falha ao salvar')
  })
})
