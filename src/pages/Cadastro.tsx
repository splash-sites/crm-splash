import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SignUpForm } from '@/features/auth/components/SignUpForm'

export function Cadastro() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl shadow-lg lg:min-h-[700px] lg:grid-cols-2">
        <div className="hidden flex-col items-center justify-center gap-4 bg-primary p-12 text-center text-primary-foreground lg:flex">
          <h2 className="text-2xl font-semibold">Já tem conta?</h2>
          <p className="text-sm text-primary-foreground/80">
            Entre pra continuar organizando seus leads e visitas.
          </p>
          <Button
            variant="outline"
            className="mt-2 border-white bg-transparent text-white hover:bg-white/10"
            render={<Link to="/login" />}
          >
            Entrar
          </Button>
        </div>
        <div className="flex flex-col justify-center gap-4 bg-background p-8 sm:p-12">
          <h1 className="text-center text-xl font-medium">Criar conta</h1>
          <SignUpForm />
          <p className="text-center text-sm text-muted-foreground lg:hidden">
            Já tem conta? <Link to="/login" className="underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
