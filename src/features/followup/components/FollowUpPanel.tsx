import { useFollowUp } from '../hooks/useFollowUp'
import { FollowUpItem } from './FollowUpItem'

export function FollowUpPanel() {
  const { leads, loading, error, marcarContatado } = useFollowUp()
  const agora = new Date()

  if (loading) return <p className="p-4 text-muted-foreground">Carregando...</p>

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-medium">Falar hoje</h1>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {leads.length === 0 ? (
        <p className="text-muted-foreground">Nenhum lead pra falar hoje. 🎉</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {leads.map((lead) => (
            <FollowUpItem key={lead.id} lead={lead} agora={agora} onContatado={marcarContatado} />
          ))}
        </ul>
      )}
    </div>
  )
}
