import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatTile } from './StatTile'

describe('StatTile', () => {
  it('renderiza label e valor', () => {
    render(<StatTile label="Leads ativos" value="12" />)
    expect(screen.getByText('Leads ativos')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })
})
