import { useCallback, useEffect, useState } from 'react'
import { createLead, deleteLead, listLeads, updateLead, updateLeadPosicao } from '../services/leadsService'
import type { Etapa, Lead, LeadInput } from '@/shared/types/lead'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setLeads(await listLeads())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar leads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function addLead(input: LeadInput) {
    const lead = await createLead(input)
    setLeads((prev) => [...prev, lead])
  }

  async function editLead(id: string, input: LeadInput) {
    const lead = await updateLead(id, input)
    setLeads((prev) => prev.map((l) => (l.id === id ? lead : l)))
  }

  async function reorderLead(id: string, etapa: Etapa, posicao: number) {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, etapa, posicao } : lead)))
    try {
      await updateLeadPosicao(id, etapa, posicao)
    } catch (err) {
      await refresh()
      throw err
    }
  }

  async function removeLead(id: string) {
    setLeads((prev) => prev.filter((lead) => lead.id !== id))
    try {
      await deleteLead(id)
    } catch (err) {
      await refresh()
      throw err
    }
  }

  return { leads, loading, error, addLead, editLead, reorderLead, removeLead }
}
