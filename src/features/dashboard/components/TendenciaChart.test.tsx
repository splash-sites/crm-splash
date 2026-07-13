import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { TendenciaItem } from '../types/dashboard'
import { TendenciaChart } from './TendenciaChart'

const data: TendenciaItem[] = [
  { semana: '05/01', count: 2 },
  { semana: '12/01', count: 5 },
]

describe('TendenciaChart', () => {
  it('renderiza uma linha com os pontos da tendência', () => {
    const { container } = render(<TendenciaChart data={data} />)
    expect(container.querySelector('.recharts-line')).toBeInTheDocument()
  })
})
