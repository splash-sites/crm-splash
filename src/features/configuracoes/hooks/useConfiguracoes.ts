import { useCallback, useEffect, useState } from 'react'
import { getPerfil, updatePerfil } from '@/shared/services/perfilService'
import type { Perfil, PerfilInput } from '@/shared/types/perfil'

export function useConfiguracoes() {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setPerfil(await getPerfil())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function salvar(input: PerfilInput) {
    const atualizado = await updatePerfil(input)
    setPerfil(atualizado)
  }

  return { perfil, loading, error, salvar }
}
