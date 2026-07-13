import { useEffect, useState } from 'react'
import {
  calcularFunil,
  calcularKpis,
  calcularOrigem,
  calcularTendencia,
} from '../lib/dashboardMetrics'
import { listLeadsResumo, listVisitasResumo } from '../services/dashboardService'
import type { FunilItem, Kpis, OrigemItem, TendenciaItem } from '../types/dashboard'

export function useDashboard() {
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [funil, setFunil] = useState<FunilItem[]>([])
  const [origem, setOrigem] = useState<OrigemItem[]>([])
  const [tendencia, setTendencia] = useState<TendenciaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setError(null)
      try {
        const [leads, visitas] = await Promise.all([listLeadsResumo(), listVisitasResumo()])
        const agora = new Date()
        setKpis(calcularKpis(leads, visitas, agora))
        setFunil(calcularFunil(leads))
        setOrigem(calcularOrigem(leads))
        setTendencia(calcularTendencia(leads, agora))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  return { kpis, funil, origem, tendencia, loading, error }
}
