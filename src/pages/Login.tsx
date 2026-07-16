import { Link } from 'react-router-dom'
import { LoginForm } from '@/features/auth/components/LoginForm'

export function Login() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-4">
      <img src="/logo.png" alt="Splash" className="h-30 w-auto" />
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-lg">
        <h1 className="text-center text-xl font-medium">Entrar</h1>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Não tem conta? <Link to="/cadastro" className="underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
