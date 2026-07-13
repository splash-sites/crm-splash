import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { FunilItem } from '../types/dashboard'

// Rampa ordinal azul, clara → escura (mesma lógica dos badges de etapa).
const CORES_FUNIL = ['#86b6ef', '#5598e7', '#2a78d6', '#1c5cab', '#104281', '#0d366b']

const config: ChartConfig = {
  count: { label: 'Leads' },
}

type FunilChartProps = { data: FunilItem[] }

export function FunilChart({ data }: FunilChartProps) {
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 16, right: 24 }}>
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={110}
          fontSize={12}
        />
        <XAxis type="number" hide />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" radius={4}>
          {data.map((item, index) => (
            <Cell key={item.etapa} fill={CORES_FUNIL[index % CORES_FUNIL.length]} />
          ))}
          <LabelList dataKey="count" position="right" className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
