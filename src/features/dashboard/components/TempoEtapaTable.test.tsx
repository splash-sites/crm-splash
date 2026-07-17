import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { TempoEtapaItem } from '../types/dashboard'
import { TempoEtapaTable } from './TempoEtapaTable'

const data: TempoEtapaItem[] = [
  { etapa: 'novo', label: 'Novo', diasMedio: 3.5 },
  { etapa: 'contactado', label: 'Contactado', diasMedio: 1 },
]

describe('TempoEtapaTable', () => {
  it('renderiza uma linha por etapa com o rótulo e os dias médio', () => {
    render(<TempoEtapaTable data={data} />)
    expect(screen.getByText('Novo')).toBeInTheDocument()
    expect(screen.getByText('3.5')).toBeInTheDocument()
    expect(screen.getByText('Contactado')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
