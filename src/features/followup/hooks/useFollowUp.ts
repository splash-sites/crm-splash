import { useCallback, useEffect, useState } from 'react'
import type { Lead } from '@/shared/types/lead'
import { precisaFalarHoje } from '../lib/precisaFalarHoje'
import { listLeadsAtivos, marcarContatoHoje } from '../services/followupService'

export function useFollowUp() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const ativos = await listLeadsAtivos()
      const agora = new Date()
      setLeads(ativos.filter((lead) => precisaFalarHoje(lead, agora)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar leads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function marcarContatado(lead: Lead) {
    setLeads((prev) => prev.filter((l) => l.id !== lead.id))
    try {
      await marcarContatoHoje(lead)
    } catch (err) {
      await refresh()
      throw err
    }
  }

  return { leads, loading, error, marcarContatado }
}
