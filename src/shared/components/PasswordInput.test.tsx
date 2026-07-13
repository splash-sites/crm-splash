import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Label } from '@/components/ui/label'
import { PasswordInput } from './PasswordInput'

describe('PasswordInput', () => {
  it('começa como type password e alterna pra text ao clicar no olho', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Label htmlFor="senha">Senha</Label>
        <PasswordInput id="senha" value="123456" onChange={() => {}} />
      </>
    )

    const input = screen.getByLabelText('Senha')
    expect(input).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(input).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: 'Ocultar senha' }))
    expect(input).toHaveAttribute('type', 'password')
  })
})
