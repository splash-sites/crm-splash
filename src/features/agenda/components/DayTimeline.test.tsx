import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Visita } from '../types/visita'
import { DayTimeline } from './DayTimeline'

function visita(overrides: Partial<Visita> = {}): Visita {
  return {
    id: '1',
    lead_id: 'lead-1',
    data_hora: '2026-01-05T12:00:00.000-03:00',
    status: 'agendada',
    lead_nome: 'Ana',
    lead_telefone: '11999999999',
    ...overrides,
  }
}

describe('DayTimeline', () => {
  it('mostra a grade de horários configurada mesmo sem nenhuma visita no dia', () => {
    render(
      <DayTimeline
        dia={new Date(2026, 0, 5)}
        visitas={[]}
        horaInicio={7}
        horaFim={9}
        onMarcarStatus={vi.fn()}
        onEditar={vi.fn()}
        onExcluir={vi.fn()}
      />
    )
    expect(screen.getByText('07:00')).toBeInTheDocument()
    expect(screen.getByText('08:00')).toBeInTheDocument()
    expect(screen.getByText('09:00')).toBeInTheDocument()
    expect(screen.queryByText('10:00')).not.toBeInTheDocument()
  })

  it('mostra a visita no horário certo', () => {
    render(
      <DayTimeline
        dia={new Date(2026, 0, 5)}
        visitas={[visita()]}
        horaInicio={7}
        horaFim={20}
        onMarcarStatus={vi.fn()}
        onEditar={vi.fn()}
        onExcluir={vi.fn()}
      />
    )
    expect(screen.getByText('Ana')).toBeInTheDocument()
  })

  it('chama onEditar ao clicar na visita', async () => {
    const onEditar = vi.fn()
    const user = userEvent.setup()
    const v = visita()
    render(
      <DayTimeline
        dia={new Date(2026, 0, 5)}
        visitas={[v]}
        horaInicio={7}
        horaFim={20}
        onMarcarStatus={vi.fn()}
        onEditar={onEditar}
        onExcluir={vi.fn()}
      />
    )
    await user.click(screen.getByText('Ana'))
    expect(onEditar).toHaveBeenCalledWith(v)
  })

  it('chama onMarcarStatus ao clicar em "Realizada"', async () => {
    const onMarcarStatus = vi.fn()
    const user = userEvent.setup()
    render(
      <DayTimeline
        dia={new Date(2026, 0, 5)}
        visitas={[visita()]}
        horaInicio={7}
        horaFim={20}
        onMarcarStatus={onMarcarStatus}
        onEditar={vi.fn()}
        onExcluir={vi.fn()}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Realizada' }))
    expect(onMarcarStatus).toHaveBeenCalledWith('1', 'realizada')
  })

  it('chama onEditar ao clicar no botão "Editar"', async () => {
    const onEditar = vi.fn()
    const user = userEvent.setup()
    const v = visita()
    render(
      <DayTimeline
        dia={new Date(2026, 0, 5)}
        visitas={[v]}
        horaInicio={7}
        horaFim={20}
        onMarcarStatus={vi.fn()}
        onEditar={onEditar}
        onExcluir={vi.fn()}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Editar' }))
    expect(onEditar).toHaveBeenCalledWith(v)
  })

  it('não mostra botão "Cancelar"', () => {
    render(
      <DayTimeline
        dia={new Date(2026, 0, 5)}
        visitas={[visita()]}
        horaInicio={7}
        horaFim={20}
        onMarcarStatus={vi.fn()}
        onEditar={vi.fn()}
        onExcluir={vi.fn()}
      />
    )
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
  })

  it('pede confirmação antes de excluir', async () => {
    const onExcluir = vi.fn()
    const user = userEvent.setup()
    render(
      <DayTimeline
        dia={new Date(2026, 0, 5)}
        visitas={[visita()]}
        horaInicio={7}
        horaFim={20}
        onMarcarStatus={vi.fn()}
        onEditar={vi.fn()}
        onExcluir={onExcluir}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(onExcluir).not.toHaveBeenCalled()
    const buttons = await screen.findAllByRole('button', { name: 'Excluir' })
    await user.click(buttons[buttons.length - 1])
    expect(onExcluir).toHaveBeenCalledWith('1')
  })
})
