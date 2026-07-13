import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Perfil } from '@/shared/types/perfil'
import { ConfiguracoesForm } from './ConfiguracoesForm'

const perfil: Perfil = {
  id: 'user-1',
  nome: 'Ana',
  telefone: '11999999999',
  dias_para_contato_padrao: 3,
  horario_inicio: 7,
  horario_fim: 20,
  created_at: '2026-01-01T00:00:00.000Z',
}

describe('ConfiguracoesForm', () => {
  it('carrega os campos com os dados do perfil', () => {
    render(<ConfiguracoesForm perfil={perfil} onSave={vi.fn()} />)
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana')
    expect(screen.getByLabelText('Telefone')).toHaveValue('(11) 99999-9999')
    expect(screen.getByLabelText('Dias padrão pro próximo contato')).toHaveValue(3)
    expect(screen.getByLabelText('Horário inicial')).toHaveValue(7)
    expect(screen.getByLabelText('Horário final')).toHaveValue(20)
  })

  it('bloqueia salvar com horário final antes do inicial', async () => {
    const onSave = vi.fn()
    const user = userEvent.setup()
    render(<ConfiguracoesForm perfil={perfil} onSave={onSave} />)

    const fimInput = screen.getByLabelText('Horário final')
    await user.clear(fimInput)
    await user.type(fimInput, '5')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText(/depois do horário inicial/)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('salva os campos alterados', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<ConfiguracoesForm perfil={perfil} onSave={onSave} />)

    await user.clear(screen.getByLabelText('Nome'))
    await user.type(screen.getByLabelText('Nome'), 'Ana Paula')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ nome: 'Ana Paula', telefone: '11999999999' })
    )
    expect(await screen.findByText('Salvo.')).toBeInTheDocument()
  })

  it('bloqueia salvar com telefone inválido', async () => {
    const onSave = vi.fn()
    const user = userEvent.setup()
    render(<ConfiguracoesForm perfil={perfil} onSave={onSave} />)

    await user.clear(screen.getByLabelText('Telefone'))
    await user.type(screen.getByLabelText('Telefone'), '119999')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText(/DDD \+ 9 dígitos/)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('bloqueia salvar com dias_para_contato_padrao fora do intervalo', async () => {
    const onSave = vi.fn()
    const user = userEvent.setup()
    render(<ConfiguracoesForm perfil={perfil} onSave={onSave} />)

    const diasInput = screen.getByLabelText('Dias padrão pro próximo contato')
    await user.clear(diasInput)
    await user.type(diasInput, '400')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText(/entre 1 e 365/)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('mostra erro quando onSave falha', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('falha ao salvar'))
    const user = userEvent.setup()
    render(<ConfiguracoesForm perfil={perfil} onSave={onSave} />)

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('falha ao salvar')
  })
})
