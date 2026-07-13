import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { FunilItem } from '../types/dashboard'
import { FunilChart } from './FunilChart'

const data: FunilItem[] = [
  { etapa: 'novo', label: 'Novo', count: 3 },
  { etapa: 'fechado', label: 'Fechado', count: 1 },
]

describe('FunilChart', () => {
  it('renderiza uma barra por etapa', () => {
    const { container } = render(<FunilChart data={data} />)
    expect(container.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(data.length)
  })
})
