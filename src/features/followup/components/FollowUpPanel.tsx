import { toast } from 'sonner'
import { DotCalendar } from '@/shared/components/DotCalendar'
import type { Lead } from '@/shared/types/lead'
import { useFollowUp } from '../hooks/useFollowUp'
import { FollowUpItem } from './FollowUpItem'

export function FollowUpPanel() {
  const { leads, diasComLead, diaSelecionado, selecionarDia, loading, error, marcarContatado } =
    useFollowUp()
  const agora = new Date()

  async function handleContatado(lead: Lead) {
    try {
      await marcarContatado(lead)
      toast.success('Lead marcado como contatado.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao marcar lead como contatado.')
    }
  }

  if (loading) return <p className="p-4 text-muted-foreground">Carregando...</p>

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-medium">Falar hoje</h1>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <DotCalendar selected={diaSelecionado} onSelect={selecionarDia} diasMarcados={diasComLead} />
        <div className="flex-1">
          {leads.length === 0 ? (
            <p className="text-muted-foreground">Nenhum lead pra falar nesse dia. 🎉</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {leads.map((lead) => (
                <FollowUpItem
                  key={lead.id}
                  lead={lead}
                  agora={agora}
                  onContatado={handleContatado}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
