import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from '@/shared/hooks/useTheme'
import { ThemeToggle } from './ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('ThemeToggle', () => {
  it('alterna o tema ao clicar e atualiza o aria-label', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: 'Ativar modo escuro' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ativar modo escuro' }))

    expect(screen.getByRole('button', { name: 'Ativar modo claro' })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
