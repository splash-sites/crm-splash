import { useEffect, useState } from 'react'
import { listBairros } from '../services/leadsService'

export function useBairroSuggestions(enabled: boolean) {
  const [bairros, setBairros] = useState<string[]>([])

  useEffect(() => {
    if (!enabled) return
    listBairros()
      .then(setBairros)
      .catch(() => setBairros([]))
  }, [enabled])

  return bairros
}
