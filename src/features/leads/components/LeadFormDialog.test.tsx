import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Lead } from '@/shared/types/lead'

const { LeadFormDialog } = await import('./LeadFormDialog')

const lead: Lead = {
  id: '1',
  corretor_id: 'user-1',
  nome_empresa: 'Empresa Ana',
  nome_contato: 'Ana',
  telefone: '11999999999',
  email: 'ana@example.com',
  origem: 'instagram',
  produto_interesse: 'software',
  ticket_estimado: 15000,
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
})

describe('LeadFormDialog', () => {
  it('modo criar: campos começam vazios e onSubmit recebe os dados preenchidos', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    expect(screen.getByLabelText('Nome da empresa')).toHaveValue('')
    expect(screen.getByLabelText('Nome do contato')).toHaveValue('')
    expect(screen.getByLabelText('Telefone')).toHaveValue('')

    await user.type(screen.getByLabelText('Nome da empresa'), 'Empresa Bruno')
    await user.type(screen.getByLabelText('Nome do contato'), 'Bruno')
    await user.type(screen.getByLabelText('Telefone'), '11988887777')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        nome_empresa: 'Empresa Bruno',
        nome_contato: 'Bruno',
        telefone: '11988887777',
        etapa: 'novo',
      })
    )
  })

  it('modo editar: campos vêm pré-preenchidos com os dados do lead', () => {
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={lead} onSubmit={vi.fn()} />)

    expect(screen.getByLabelText('Nome da empresa')).toHaveValue('Empresa Ana')
    expect(screen.getByLabelText('Nome do contato')).toHaveValue('Ana')
    expect(screen.getByLabelText('Telefone')).toHaveValue('(11) 99999-9999')
    expect(screen.getByLabelText('Email')).toHaveValue('ana@example.com')
    expect(screen.getByLabelText('Etapa')).toHaveTextContent('Novo')
    expect(screen.getByLabelText('Origem')).toHaveTextContent('Instagram')
    expect(screen.getByLabelText('Produto de interesse')).toHaveTextContent('Software')
    expect(screen.getByLabelText('Ticket estimado (R$)')).toHaveValue(15000)
    expect(screen.getByLabelText('Observações')).toHaveValue('cliente exigente')
  })

  it('permite cadastrar lead já em etapa avançada', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome da empresa'), 'Empresa Bruno')
    await user.type(screen.getByLabelText('Nome do contato'), 'Bruno')
    await user.type(screen.getByLabelText('Telefone'), '11988887777')
    await user.click(screen.getByLabelText('Etapa'))
    await user.click(await screen.findByRole('option', { name: 'Proposta' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ etapa: 'proposta' }))
  })

  it('bloqueia salvar com nome da empresa muito curto e mostra erro no campo', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome da empresa'), 'A')
    await user.type(screen.getByLabelText('Nome do contato'), 'Bruno')
    await user.type(screen.getByLabelText('Telefone'), '11988887777')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText(/pelo menos 2 caracteres/)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('bloqueia salvar com email inválido e mostra erro no campo', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome da empresa'), 'Empresa Bruno')
    await user.type(screen.getByLabelText('Nome do contato'), 'Bruno')
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

  it('envia produto de interesse e ticket estimado preenchidos', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome da empresa'), 'Empresa Bruno')
    await user.type(screen.getByLabelText('Nome do contato'), 'Bruno')
    await user.type(screen.getByLabelText('Telefone'), '11988887777')
    await user.click(screen.getByLabelText('Produto de interesse'))
    await user.click(await screen.findByRole('option', { name: 'Landing Page' }))
    await user.type(screen.getByLabelText('Ticket estimado (R$)'), '5000')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ produto_interesse: 'landing_page', ticket_estimado: 5000 })
    )
  })

  it('mostra erro quando onSubmit falha', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('falha ao salvar'))
    const user = userEvent.setup()
    render(<LeadFormDialog open onOpenChange={vi.fn()} lead={null} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome da empresa'), 'Empresa Bruno')
    await user.type(screen.getByLabelText('Nome do contato'), 'Bruno')
    await user.type(screen.getByLabelText('Telefone'), '11988887777')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('falha ao salvar')
  })
})
