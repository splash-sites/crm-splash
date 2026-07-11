import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-medium">Página não encontrada</h1>
      <p className="text-muted-foreground">Esse endereço não existe ou foi movido.</p>
      <Button render={<Link to="/" />}>Voltar para o início</Button>
    </div>
  )
}
