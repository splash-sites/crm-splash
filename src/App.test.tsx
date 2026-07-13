import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('redireciona pra login quando não há sessão', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )
    expect(await screen.findByText('Não tem conta?', { exact: false })).toBeInTheDocument()
  })

  it('mostra página não encontrada pra rota inexistente', async () => {
    render(
      <MemoryRouter initialEntries={['/rota-que-nao-existe']}>
        <App />
      </MemoryRouter>
    )
    expect(await screen.findByText('Página não encontrada')).toBeInTheDocument()
  })

  it('redireciona raiz "/" pra login quando não há sessão', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(await screen.findByText('Não tem conta?', { exact: false })).toBeInTheDocument()
  })
})
