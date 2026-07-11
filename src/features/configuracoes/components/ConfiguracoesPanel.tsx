import { useConfiguracoes } from '../hooks/useConfiguracoes'
import { ConfiguracoesForm } from './ConfiguracoesForm'

export function ConfiguracoesPanel() {
  const { perfil, loading, error, salvar } = useConfiguracoes()

  if (loading) return <p className="p-4 text-muted-foreground">Carregando...</p>

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-medium">Configurações</h1>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {perfil && <ConfiguracoesForm perfil={perfil} onSave={salvar} />}
    </div>
  )
}
