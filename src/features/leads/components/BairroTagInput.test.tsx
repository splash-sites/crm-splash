import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BairroTagInput } from './BairroTagInput'

describe('BairroTagInput', () => {
  it('adiciona bairro ao apertar Enter', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<BairroTagInput id="bairros" value={[]} onChange={onChange} suggestions={[]} />)

    await user.type(screen.getByRole('combobox'), 'Centro{Enter}')
    expect(onChange).toHaveBeenCalledWith(['Centro'])
  })

  it('não duplica bairro já adicionado (case-insensitive)', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <BairroTagInput id="bairros" value={['Centro']} onChange={onChange} suggestions={[]} />
    )

    await user.type(screen.getByRole('combobox'), 'centro{Enter}')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('remove bairro ao clicar no x', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <BairroTagInput
        id="bairros"
        value={['Centro', 'Zona Sul']}
        onChange={onChange}
        suggestions={[]}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Remover Centro' }))
    expect(onChange).toHaveBeenCalledWith(['Zona Sul'])
  })

  it('remove último bairro com Backspace quando input vazio', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <BairroTagInput id="bairros" value={['Centro']} onChange={onChange} suggestions={[]} />
    )

    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{Backspace}')
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('adiciona bairro ao perder o foco (blur) com texto digitado', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<BairroTagInput id="bairros" value={[]} onChange={onChange} suggestions={[]} />)

    await user.type(screen.getByRole('combobox'), 'Centro')
    await user.tab()
    expect(onChange).toHaveBeenCalledWith(['Centro'])
  })
})
