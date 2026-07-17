import { useEffect, useState } from 'react'
import {
  calcularFunil,
  calcularKpis,
  calcularOrigem,
  calcularProduto,
  calcularTempoPorEtapa,
} from '../lib/dashboardMetrics'
import {
  listEtapaHistorico,
  listLeadIdsComInteracao,
  listLeadsResumo,
} from '../services/dashboardService'
import type { FunilItem, Kpis, OrigemItem, ProdutoItem, TempoEtapaItem } from '../types/dashboard'

export function useDashboard() {
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [funil, setFunil] = useState<FunilItem[]>([])
  const [origem, setOrigem] = useState<OrigemItem[]>([])
  const [produto, setProduto] = useState<ProdutoItem[]>([])
  const [tempoPorEtapa, setTempoPorEtapa] = useState<TempoEtapaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setError(null)
      try {
        const [leads, leadIdsComInteracao, historico] = await Promise.all([
          listLeadsResumo(),
          listLeadIdsComInteracao(),
          listEtapaHistorico(),
        ])
        const agora = new Date()
        setKpis(calcularKpis(leads, leadIdsComInteracao, agora))
        setFunil(calcularFunil(leads))
        setOrigem(calcularOrigem(leads))
        setProduto(calcularProduto(leads))
        setTempoPorEtapa(calcularTempoPorEtapa(historico, agora))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  return { kpis, funil, origem, produto, tempoPorEtapa, loading, error }
}
