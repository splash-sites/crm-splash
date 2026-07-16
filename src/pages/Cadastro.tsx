import { Link } from 'react-router-dom'
import { SignUpForm } from '@/features/auth/components/SignUpForm'

export function Cadastro() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-4">
      <img src="/logo.png" alt="Splash" className="h-30 w-auto" />
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-lg">
        <h1 className="text-center text-xl font-medium">Criar conta</h1>
        <div className="mt-6">
          <SignUpForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta? <Link to="/login" className="underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
