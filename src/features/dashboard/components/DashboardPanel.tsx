import { useDashboard } from '../hooks/useDashboard'
import { FunilChart } from './FunilChart'
import { OrigemChart } from './OrigemChart'
import { ProdutoChart } from './ProdutoChart'
import { StatTile } from './StatTile'
import { TempoEtapaTable } from './TempoEtapaTable'

function formatMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function DashboardPanel() {
  const { kpis, funil, origem, produto, tempoPorEtapa, loading, error } = useDashboard()

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Leads ativos" value={String(kpis.leadsAtivos)} />
          <StatTile label="Taxa de conversão" value={`${Math.round(kpis.taxaConversao * 100)}%`} />
          <StatTile label="Leads vencidos" value={String(kpis.leadsVencidos)} />
          <StatTile label="Leads sem interação" value={String(kpis.leadsSemInteracao)} />
          <StatTile label="Pipeline em aberto" value={formatMoeda(kpis.pipelineAberto)} />
          <StatTile label="Fechado no mês" value={formatMoeda(kpis.fechadoNoMes)} />
          <StatTile label="Ticket médio" value={formatMoeda(kpis.ticketMedio)} />
          <StatTile label="Tempo médio até fechar" value={`${kpis.tempoMedioFechar} dias`} />
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
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Leads por produto</h2>
          <ProdutoChart data={produto} />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Tempo médio por etapa</h2>
          <TempoEtapaTable data={tempoPorEtapa} />
        </div>
      </div>
    </div>
  )
}
