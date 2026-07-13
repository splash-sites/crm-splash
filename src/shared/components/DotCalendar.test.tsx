import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DotCalendar } from './DotCalendar'

describe('DotCalendar', () => {
  it('chama onSelect ao clicar em um dia', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <DotCalendar selected={new Date(2026, 0, 5)} onSelect={onSelect} diasMarcados={[]} />
    )

    await user.click(screen.getByRole('button', { name: /15/ }))
    expect(onSelect).toHaveBeenCalled()
  })
})
