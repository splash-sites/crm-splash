import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Kpis } from '../types/dashboard'

const useDashboardMock = vi.fn()
vi.mock('../hooks/useDashboard', () => ({
  useDashboard: () => useDashboardMock(),
}))

const { DashboardPanel } = await import('./DashboardPanel')

const kpis: Kpis = { leadsAtivos: 10, taxaConversao: 0.25, leadsVencidos: 2 }

function mockUseDashboard(overrides: Partial<ReturnType<typeof useDashboardMock>> = {}) {
  useDashboardMock.mockReturnValue({
    kpis,
    funil: [{ etapa: 'novo', label: 'Novo', count: 3 }],
    origem: [{ origem: 'instagram', label: 'Instagram', count: 3 }],
    tendencia: [{ semana: '05/01', count: 3 }],
    loading: false,
    error: null,
    ...overrides,
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('DashboardPanel', () => {
  it('mostra "Carregando" enquanto loading é true', () => {
    mockUseDashboard({ loading: true })
    render(<DashboardPanel />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('renderiza os KPIs e os gráficos', () => {
    mockUseDashboard()
    render(<DashboardPanel />)
    expect(screen.getByText('Leads ativos')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('Funil de leads')).toBeInTheDocument()
    expect(screen.getByText('Leads por origem')).toBeInTheDocument()
    expect(screen.getByText('Novos leads por semana')).toBeInTheDocument()
  })

  it('mostra mensagem de erro quando presente', () => {
    mockUseDashboard({ error: 'Erro ao carregar dashboard' })
    render(<DashboardPanel />)
    expect(screen.getByRole('alert')).toHaveTextContent('Erro ao carregar dashboard')
  })
})
