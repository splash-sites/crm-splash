import { useCallback, useEffect, useState } from 'react'
import { getPerfil } from '@/shared/services/perfilService'
import {
  createVisita,
  deleteVisita,
  listLeadsParaAgendar,
  listVisitas,
  updateVisitaDataHora,
  updateVisitaStatus,
} from '../services/agendaService'
import type { LeadOption, Visita, VisitaStatus } from '../types/visita'

const HORARIO_PADRAO = { inicio: 7, fim: 20 }

export function useAgenda() {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [leads, setLeads] = useState<LeadOption[]>([])
  const [horarioInicio, setHorarioInicio] = useState(HORARIO_PADRAO.inicio)
  const [horarioFim, setHorarioFim] = useState(HORARIO_PADRAO.fim)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [visitasData, leadsData, perfil] = await Promise.all([
        listVisitas(),
        listLeadsParaAgendar(),
        getPerfil().catch(() => null),
      ])
      setVisitas(visitasData)
      setLeads(leadsData)
      setHorarioInicio(perfil?.horario_inicio ?? HORARIO_PADRAO.inicio)
      setHorarioFim(perfil?.horario_fim ?? HORARIO_PADRAO.fim)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agenda')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function agendar(leadId: string, dataHora: string) {
    await createVisita(leadId, dataHora)
    await refresh()
  }

  async function marcarStatus(id: string, status: VisitaStatus) {
    setVisitas((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)))
    try {
      await updateVisitaStatus(id, status)
    } catch (err) {
      await refresh()
      throw err
    }
  }

  async function remarcar(id: string, dataHora: string) {
    setVisitas((prev) => prev.map((v) => (v.id === id ? { ...v, data_hora: dataHora } : v)))
    try {
      await updateVisitaDataHora(id, dataHora)
    } catch (err) {
      await refresh()
      throw err
    }
  }

  async function remover(id: string) {
    setVisitas((prev) => prev.filter((v) => v.id !== id))
    try {
      await deleteVisita(id)
    } catch (err) {
      await refresh()
      throw err
    }
  }

  return {
    visitas,
    leads,
    horarioInicio,
    horarioFim,
    loading,
    error,
    agendar,
    marcarStatus,
    remarcar,
    remover,
  }
}
