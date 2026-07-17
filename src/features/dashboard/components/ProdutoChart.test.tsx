import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ProdutoItem } from '../types/dashboard'
import { ProdutoChart } from './ProdutoChart'

const data: ProdutoItem[] = [
  { produto: 'software', label: 'Software', count: 4 },
  { produto: 'landing_page', label: 'Landing Page', count: 2 },
]

describe('ProdutoChart', () => {
  it('renderiza uma barra por produto', () => {
    const { container } = render(<ProdutoChart data={data} />)
    expect(container.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(data.length)
  })
})
