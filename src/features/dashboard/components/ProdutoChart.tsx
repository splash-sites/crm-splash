import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { ProdutoItem } from '../types/dashboard'

// Paleta categórica fixa (ordem nunca ciclada).
const CORES_CATEGORICAS = ['#2a78d6', '#1baf7a', '#eda100']

const config: ChartConfig = {
  count: { label: 'Leads' },
}

type ProdutoChartProps = { data: ProdutoItem[] }

export function ProdutoChart({ data }: ProdutoChartProps) {
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ top: 16 }}>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
        />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" radius={4}>
          {data.map((item, index) => (
            <Cell key={item.produto} fill={CORES_CATEGORICAS[index % CORES_CATEGORICAS.length]} />
          ))}
          <LabelList dataKey="count" position="top" className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
