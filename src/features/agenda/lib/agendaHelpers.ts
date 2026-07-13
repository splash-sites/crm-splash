import { mesmaData } from '@/shared/lib/dates'
import type { Visita } from '../types/visita'

export { mesmaData }

export function visitasDoDia(visitas: Visita[], dia: Date): Visita[] {
  return visitas
    .filter((visita) => mesmaData(new Date(visita.data_hora), dia))
    .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime())
}

export function opcoesDeHorario(
  horaInicio: number,
  horaFim: number,
  passoMinutos = 30
): string[] {
  const opcoes: string[] = []
  for (let h = horaInicio; h <= horaFim; h++) {
    for (let m = 0; m < 60; m += passoMinutos) {
      if (h === horaFim && m > 0) break
      opcoes.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return opcoes
}

export function diasComVisita(visitas: Visita[]): Date[] {
  const vistos = new Set<string>()
  const dias: Date[] = []
  for (const visita of visitas) {
    const d = new Date(visita.data_hora)
    const chave = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (!vistos.has(chave)) {
      vistos.add(chave)
      dias.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()))
    }
  }
  return dias
}
