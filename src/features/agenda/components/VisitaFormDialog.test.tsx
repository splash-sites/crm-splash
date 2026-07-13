import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { LeadOption, Visita } from '../types/visita'
import { VisitaFormDialog } from './VisitaFormDialog'

const leads: LeadOption[] = [
  { id: 'lead-1', nome: 'Ana', telefone: '11999999999' },
  { id: 'lead-2', nome: 'Bruno', telefone: '21999999999' },
]

describe('VisitaFormDialog', () => {
  it('modo criar: exige lead selecionado', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(
      <VisitaFormDialog
        open
        onOpenChange={vi.fn()}
        leads={leads}
        visita={null}
        dataInicial={new Date(2026, 0, 5)}
        horaInicio={7}
        horaFim={20}
        onSubmit={onSubmit}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Selecione um lead')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('modo criar: já vem com horário padrão selecionado e envia lead + data/hora', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(
      <VisitaFormDialog
        open
        onOpenChange={vi.fn()}
        leads={leads}
        visita={null}
        dataInicial={new Date(2026, 0, 5)}
        horaInicio={7}
        horaFim={20}
        onSubmit={onSubmit}
      />
    )

    expect(screen.getByLabelText('Horário')).toHaveTextContent('07:00')

    await user.click(screen.getByLabelText('Lead'))
    await user.click(await screen.findByRole('option', { name: 'Ana' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onSubmit).toHaveBeenCalledWith('lead-1', expect.any(String))
    const [, dataHoraISO] = onSubmit.mock.calls[0]
    const enviado = new Date(dataHoraISO)
    expect(enviado.getHours()).toBe(7)
    expect(enviado.getMinutes()).toBe(0)
  })

  it('permite trocar o horário entre as opções configuradas', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(
      <VisitaFormDialog
        open
        onOpenChange={vi.fn()}
        leads={leads}
        visita={null}
        dataInicial={new Date(2026, 0, 5)}
        horaInicio={7}
        horaFim={9}
        onSubmit={onSubmit}
      />
    )

    await user.click(screen.getByLabelText('Lead'))
    await user.click(await screen.findByRole('option', { name: 'Ana' }))
    await user.click(screen.getByLabelText('Horário'))
    await user.click(await screen.findByRole('option', { name: '08:30' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    const [, dataHoraISO] = onSubmit.mock.calls[0]
    const enviado = new Date(dataHoraISO)
    expect(enviado.getHours()).toBe(8)
    expect(enviado.getMinutes()).toBe(30)
  })

  it('modo editar: campo de lead vem desabilitado e horário pré-preenchido', () => {
    const visita: Visita = {
      id: '1',
      lead_id: 'lead-1',
      data_hora: '2026-01-05T09:30:00.000-03:00',
      status: 'agendada',
      lead_nome: 'Ana',
      lead_telefone: '11999999999',
    }
    render(
      <VisitaFormDialog
        open
        onOpenChange={vi.fn()}
        leads={leads}
        visita={visita}
        dataInicial={new Date(2026, 0, 5)}
        horaInicio={7}
        horaFim={20}
        onSubmit={vi.fn()}
      />
    )
    expect(screen.getByText('Editar visita')).toBeInTheDocument()
    expect(screen.getByLabelText('Lead')).toBeDisabled()
    expect(screen.getByLabelText('Horário')).toHaveTextContent('09:30')
  })

  it('mostra erro quando onSubmit falha', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('falha ao salvar'))
    const user = userEvent.setup()
    render(
      <VisitaFormDialog
        open
        onOpenChange={vi.fn()}
        leads={leads}
        visita={null}
        dataInicial={new Date(2026, 0, 5)}
        horaInicio={7}
        horaFim={20}
        onSubmit={onSubmit}
      />
    )

    await user.click(screen.getByLabelText('Lead'))
    await user.click(await screen.findByRole('option', { name: 'Ana' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('falha ao salvar')
  })
})
