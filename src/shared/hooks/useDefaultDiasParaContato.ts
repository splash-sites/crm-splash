import { useEffect, useState } from 'react'
import { getDiasParaContatoPadrao } from '../services/perfilService'

const FALLBACK = 3

export function useDefaultDiasParaContato(enabled: boolean) {
  const [dias, setDias] = useState(FALLBACK)

  useEffect(() => {
    if (!enabled) return
    getDiasParaContatoPadrao()
      .then(setDias)
      .catch(() => setDias(FALLBACK))
  }, [enabled])

  return dias
}
