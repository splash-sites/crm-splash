import type { TempoEtapaItem } from '../types/dashboard'

type TempoEtapaTableProps = { data: TempoEtapaItem[] }

export function TempoEtapaTable({ data }: TempoEtapaTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-muted-foreground">
          <th className="pb-2 font-medium">Etapa</th>
          <th className="pb-2 font-medium">Dias médio parado</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.etapa} className="border-t border-border">
            <td className="py-2">{item.label}</td>
            <td className="py-2">{item.diasMedio}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
