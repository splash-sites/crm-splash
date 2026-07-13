import { ptBR } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'

type DotCalendarProps = {
  selected: Date
  onSelect: (date: Date) => void
  diasMarcados: Date[]
}

export function DotCalendar({ selected, onSelect, diasMarcados }: DotCalendarProps) {
  return (
    <Calendar
      mode="single"
      locale={ptBR}
      selected={selected}
      onSelect={(date) => date && onSelect(date)}
      modifiers={{ marcado: diasMarcados }}
      modifiersClassNames={{
        marcado:
          "after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary after:content-['']",
      }}
      className="rounded-lg border border-border"
    />
  )
}
