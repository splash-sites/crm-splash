import { useEffect, useState, type FormEvent } from 'react'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { opcoesDeHorario } from '../lib/agendaHelpers'
import type { LeadOption, Visita } from '../types/visita'

type VisitaFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  leads: LeadOption[]
  visita?: Visita | null
  dataInicial: Date
  horaInicio: number
  horaFim: number
  onSubmit: (leadId: string, dataHoraISO: string) => Promise<void>
}

function horaMinutoDe(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function meiaNoite(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function VisitaFormDialog({
  open,
  onOpenChange,
  leads,
  visita,
  dataInicial,
  horaInicio,
  horaFim,
  onSubmit,
}: VisitaFormDialogProps) {
  const [leadId, setLeadId] = useState('')
  const [data, setData] = useState<Date>(dataInicial)
  const [hora, setHora] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const horarios = opcoesDeHorario(horaInicio, horaFim)

  useEffect(() => {
    if (open) {
      setLeadId(visita?.lead_id ?? '')
      const base = visita ? new Date(visita.data_hora) : dataInicial
      setData(meiaNoite(base))
      setHora(visita ? horaMinutoDe(base) : (horarios[0] ?? ''))
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, visita, dataInicial])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    if (!leadId) {
      setError('Selecione um lead')
      return
    }
    if (!hora) {
      setError('Selecione um horário')
      return
    }
    const [h, m] = hora.split(':').map(Number)
    const dataHora = new Date(data.getFullYear(), data.getMonth(), data.getDate(), h, m)

    setSubmitting(true)
    try {
      await onSubmit(leadId, dataHora.toISOString())
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar visita')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{visita ? 'Editar visita' : 'Nova visita'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="visita-lead">Lead</Label>
            <Select
              value={leadId || undefined}
              onValueChange={(value) => setLeadId(value ?? '')}
              disabled={Boolean(visita)}
            >
              <SelectTrigger id="visita-lead" className="w-full">
                <SelectValue placeholder="Selecione um lead">
                  {(value: string | null) =>
                    leads.find((lead) => lead.id === value)?.nome ?? 'Selecione um lead'
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Data</Label>
            <Calendar
              mode="single"
              locale={ptBR}
              selected={data}
              onSelect={(date) => date && setData(date)}
              className="mx-auto w-fit rounded-lg border border-border p-2"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="visita-horario">Horário</Label>
            <Select value={hora || undefined} onValueChange={(value) => setHora(value ?? '')}>
              <SelectTrigger id="visita-horario" className="w-full">
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                {horarios.map((opcao) => (
                  <SelectItem key={opcao} value={opcao}>
                    {opcao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
