import { DotCalendar } from '@/shared/components/DotCalendar'
import { diasComVisita } from '../lib/agendaHelpers'
import type { Visita } from '../types/visita'

type AgendaCalendarProps = {
  visitas: Visita[]
  selected: Date
  onSelect: (date: Date) => void
}

export function AgendaCalendar({ visitas, selected, onSelect }: AgendaCalendarProps) {
  return <DotCalendar selected={selected} onSelect={onSelect} diasMarcados={diasComVisita(visitas)} />
}
