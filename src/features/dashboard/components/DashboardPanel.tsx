import { useDashboard } from '../hooks/useDashboard'
import { FunilChart } from './FunilChart'
import { OrigemChart } from './OrigemChart'
import { StatTile } from './StatTile'
import { TendenciaChart } from './TendenciaChart'

export function DashboardPanel() {
  const { kpis, funil, origem, tendencia, loading, error } = useDashboard()

  if (loading) return <p className="p-4 text-muted-foreground">Carregando...</p>

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-medium">Dashboard</h1>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {kpis && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="Leads ativos" value={String(kpis.leadsAtivos)} />
          <StatTile label="Taxa de conversão" value={`${Math.round(kpis.taxaConversao * 100)}%`} />
          <StatTile label="Leads vencidos" value={String(kpis.leadsVencidos)} />
          <StatTile label="Visitas na semana" value={String(kpis.visitasSemana)} />
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Funil de leads</h2>
          <FunilChart data={funil} />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Leads por origem</h2>
          <OrigemChart data={origem} />
        </div>
        <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Novos leads por semana</h2>
          <TendenciaChart data={tendencia} />
        </div>
      </div>
    </div>
  )
}
