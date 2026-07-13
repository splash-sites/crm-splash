import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { TendenciaItem } from '../types/dashboard'

const config: ChartConfig = {
  count: { label: 'Novos leads', color: '#2a78d6' },
}

type TendenciaChartProps = { data: TendenciaItem[] }

export function TendenciaChart({ data }: TendenciaChartProps) {
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <LineChart data={data} margin={{ left: 8, right: 16 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="semana" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="var(--color-count)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--color-count)' }}
        />
      </LineChart>
    </ChartContainer>
  )
}
