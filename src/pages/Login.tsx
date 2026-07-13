import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LoginForm } from '@/features/auth/components/LoginForm'

export function Login() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl shadow-lg lg:min-h-[700px] lg:grid-cols-2">
        <div className="hidden flex-col items-center justify-center gap-4 bg-primary p-12 text-center text-primary-foreground lg:flex">
          <h2 className="text-2xl font-semibold">Bem-vindo de volta!</h2>
          <p className="text-sm text-primary-foreground/80">
            Organize seus leads, follow-ups e visitas em um só lugar.
          </p>
          <Button
            variant="outline"
            className="mt-2 border-white bg-transparent text-white hover:bg-white/10"
            render={<Link to="/cadastro" />}
          >
            Criar conta
          </Button>
        </div>
        <div className="flex flex-col justify-center gap-4 bg-background p-8 sm:p-12">
          <h1 className="text-center text-xl font-medium">Entrar</h1>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground lg:hidden">
            Não tem conta? <Link to="/cadastro" className="underline">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
