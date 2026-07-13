import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAgenda } from '../hooks/useAgenda'
import type { Visita, VisitaStatus } from '../types/visita'
import { AgendaCalendar } from './AgendaCalendar'
import { DayTimeline } from './DayTimeline'
import { VisitaFormDialog } from './VisitaFormDialog'

export function AgendaPanel() {
  const {
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
  } = useAgenda()
  const [diaSelecionado, setDiaSelecionado] = useState(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [visitaEditando, setVisitaEditando] = useState<Visita | null>(null)

  function abrirNova() {
    if (leads.length === 0) {
      toast.error('Você deve ter pelo menos 1 lead cadastrado para cadastrar uma visita.')
      return
    }
    setVisitaEditando(null)
    setDialogOpen(true)
  }

  function abrirEdicao(visita: Visita) {
    setVisitaEditando(visita)
    setDialogOpen(true)
  }

  async function salvar(leadId: string, dataHoraISO: string) {
    if (visitaEditando) {
      await remarcar(visitaEditando.id, dataHoraISO)
      toast.success('Visita remarcada com sucesso.')
    } else {
      await agendar(leadId, dataHoraISO)
      toast.success('Visita agendada com sucesso.')
    }
  }

  async function handleMarcarStatus(id: string, status: VisitaStatus) {
    try {
      await marcarStatus(id, status)
      toast.success(status === 'realizada' ? 'Visita marcada como realizada.' : 'Visita cancelada.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar visita.')
    }
  }

  async function handleExcluir(id: string) {
    try {
      await remover(id)
      toast.success('Visita excluída.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir visita.')
    }
  }

  if (loading) return <p className="p-4 text-muted-foreground">Carregando...</p>

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Agenda de visitas</h1>
        <Button onClick={abrirNova}>Nova visita</Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <AgendaCalendar visitas={visitas} selected={diaSelecionado} onSelect={setDiaSelecionado} />
        <div className="flex-1">
          <DayTimeline
            dia={diaSelecionado}
            visitas={visitas}
            horaInicio={horarioInicio}
            horaFim={horarioFim}
            onMarcarStatus={handleMarcarStatus}
            onEditar={abrirEdicao}
            onExcluir={handleExcluir}
          />
        </div>
      </div>
      <VisitaFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        leads={leads}
        visita={visitaEditando}
        dataInicial={diaSelecionado}
        horaInicio={horarioInicio}
        horaFim={horarioFim}
        onSubmit={salvar}
      />
    </div>
  )
}
