import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Visita } from '../types/visita'
import { AgendaCalendar } from './AgendaCalendar'

function visita(overrides: Partial<Visita> = {}): Visita {
  return {
    id: '1',
    lead_id: 'lead-1',
    data_hora: '2026-01-05T12:00:00.000Z',
    status: 'agendada',
    lead_nome: 'Ana',
    lead_telefone: '11999999999',
    ...overrides,
  }
}

describe('AgendaCalendar', () => {
  it('chama onSelect ao clicar em um dia', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <AgendaCalendar visitas={[visita()]} selected={new Date(2026, 0, 5)} onSelect={onSelect} />
    )

    await user.click(screen.getByRole('button', { name: /15/ }))
    expect(onSelect).toHaveBeenCalled()
  })
})
