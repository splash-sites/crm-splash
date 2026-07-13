import { useCallback, useEffect, useState } from 'react'
import { mesmaData } from '@/shared/lib/dates'
import type { Lead } from '@/shared/types/lead'
import { diasComFollowUp, leadsDoDia } from '../lib/followupHelpers'
import { precisaFalarHoje } from '../lib/precisaFalarHoje'
import { listLeadsAtivos, marcarContatoHoje } from '../services/followupService'

export function useFollowUp() {
  const [ativos, setAtivos] = useState<Lead[]>([])
  const [diaSelecionado, setDiaSelecionado] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setAtivos(await listLeadsAtivos())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar leads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const agora = new Date()
  const diasComLead = diasComFollowUp(ativos)
  const leads = mesmaData(diaSelecionado, agora)
    ? ativos.filter((lead) => precisaFalarHoje(lead, agora))
    : leadsDoDia(ativos, diaSelecionado)

  async function marcarContatado(lead: Lead) {
    setAtivos((prev) => prev.filter((l) => l.id !== lead.id))
    try {
      await marcarContatoHoje(lead)
    } catch (err) {
      await refresh()
      throw err
    }
  }

  return {
    leads,
    diasComLead,
    diaSelecionado,
    selecionarDia: setDiaSelecionado,
    loading,
    error,
    marcarContatado,
  }
}
