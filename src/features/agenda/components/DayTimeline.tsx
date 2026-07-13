import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { WhatsAppLink } from '@/shared/components/WhatsAppLink'
import { visitasDoDia } from '../lib/agendaHelpers'
import { VISITA_STATUS_LABELS, type Visita, type VisitaStatus } from '../types/visita'

type DayTimelineProps = {
  dia: Date
  visitas: Visita[]
  horaInicio: number
  horaFim: number
  onMarcarStatus: (id: string, status: VisitaStatus) => void
  onEditar: (visita: Visita) => void
  onExcluir: (id: string) => void
}

export function DayTimeline({
  dia,
  visitas,
  horaInicio,
  horaFim,
  onMarcarStatus,
  onEditar,
  onExcluir,
}: DayTimelineProps) {
  const doDia = visitasDoDia(visitas, dia)
  const HORAS = Array.from({ length: horaFim - horaInicio + 1 }, (_, i) => i + horaInicio)

  return (
    <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {HORAS.map((hora) => {
        const doHorario = doDia.filter((visita) => new Date(visita.data_hora).getHours() === hora)
        return (
          <div key={hora} className="flex min-h-16 gap-3 p-2">
            <span className="w-14 shrink-0 pt-1 text-xs text-muted-foreground">
              {String(hora).padStart(2, '0')}:00
            </span>
            <div className="flex flex-1 flex-col gap-1.5">
              {doHorario.map((visita) => (
                <div
                  key={visita.id}
                  className="flex items-center justify-between gap-2 rounded-md bg-muted/60 p-2 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      className="block w-full cursor-pointer text-left"
                      onClick={() => onEditar(visita)}
                    >
                      <p className="truncate font-medium">{visita.lead_nome}</p>
                    </button>
                    <p className="text-xs text-muted-foreground">
                      <WhatsAppLink telefone={visita.lead_telefone} className="hover:text-foreground" />{' '}
                      ·{' '}
                      {new Date(visita.data_hora).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      · {VISITA_STATUS_LABELS[visita.status]}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {visita.status === 'agendada' && (
                      <>
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          onClick={() => onMarcarStatus(visita.id, 'realizada')}
                        >
                          Realizada
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant="ghost"
                          onClick={() => onEditar(visita)}
                        >
                          Editar
                        </Button>
                      </>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          />
                        }
                      >
                        Excluir
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir visita?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Remove a visita de {visita.lead_nome}. Não pode ser desfeito.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => onExcluir(visita.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
