import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/shared/components/PasswordInput'
import { signUp } from '../services/authService'
import { SIGNUP_LIMITS, validateSignUpInput, type SignUpInputErrors } from '../lib/validateSignUpInput'

export function SignUpForm() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [fieldErrors, setFieldErrors] = useState<SignUpInputErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    const errors = validateSignUpInput({ nome, email, password, confirmarSenha })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      const data = await signUp(email, password, nome || undefined)
      if (data.session) {
        navigate('/dashboard')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return <p role="status">Cadastro feito. Confira seu email para confirmar a conta.</p>
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-nome">Nome</Label>
        <Input
          id="signup-nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={SIGNUP_LIMITS.nome.max}
          aria-invalid={Boolean(fieldErrors.nome)}
          aria-describedby={fieldErrors.nome ? 'signup-nome-error' : undefined}
        />
        {fieldErrors.nome && (
          <p id="signup-nome-error" role="alert" className="text-xs text-destructive">
            {fieldErrors.nome}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={SIGNUP_LIMITS.email.max}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
          required
        />
        {fieldErrors.email && (
          <p id="signup-email-error" role="alert" className="text-xs text-destructive">
            {fieldErrors.email}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-password">Senha</Label>
        <PasswordInput
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={SIGNUP_LIMITS.senha.max}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? 'signup-password-error' : undefined}
          required
        />
        {fieldErrors.password && (
          <p id="signup-password-error" role="alert" className="text-xs text-destructive">
            {fieldErrors.password}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-confirmar-senha">Confirmar senha</Label>
        <PasswordInput
          id="signup-confirmar-senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          maxLength={SIGNUP_LIMITS.senha.max}
          aria-invalid={Boolean(fieldErrors.confirmarSenha)}
          aria-describedby={fieldErrors.confirmarSenha ? 'signup-confirmar-senha-error' : undefined}
          required
        />
        {fieldErrors.confirmarSenha && (
          <p id="signup-confirmar-senha-error" role="alert" className="text-xs text-destructive">
            {fieldErrors.confirmarSenha}
          </p>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Cadastrando...' : 'Cadastrar'}
      </Button>
    </form>
  )
}
