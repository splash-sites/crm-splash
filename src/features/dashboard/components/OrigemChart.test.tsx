import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { OrigemItem } from '../types/dashboard'
import { OrigemChart } from './OrigemChart'

const data: OrigemItem[] = [
  { origem: 'instagram', label: 'Instagram', count: 4 },
  { origem: 'indicacao', label: 'Indicação', count: 2 },
]

describe('OrigemChart', () => {
  it('renderiza uma barra por origem', () => {
    const { container } = render(<OrigemChart data={data} />)
    expect(container.querySelectorAll('.recharts-bar-rectangle')).toHaveLength(data.length)
  })
})
