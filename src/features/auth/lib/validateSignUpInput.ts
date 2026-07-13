export type SignUpInput = {
  nome: string
  email: string
  password: string
  confirmarSenha: string
}

export type SignUpInputErrors = Partial<Record<keyof SignUpInput, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const SIGNUP_LIMITS = {
  nome: { max: 100 },
  email: { max: 255 },
  // 72: limite prático do bcrypt (Supabase Auth) — senha maior é truncada/rejeitada.
  senha: { min: 6, max: 72 },
} as const

export function validateSignUpInput(input: SignUpInput): SignUpInputErrors {
  const errors: SignUpInputErrors = {}

  const nome = input.nome.trim()
  if (nome.length > SIGNUP_LIMITS.nome.max) {
    errors.nome = `Nome pode ter no máximo ${SIGNUP_LIMITS.nome.max} caracteres`
  }

  const email = input.email.trim()
  if (!EMAIL_RE.test(email)) {
    errors.email = 'Email inválido'
  } else if (email.length > SIGNUP_LIMITS.email.max) {
    errors.email = `Email pode ter no máximo ${SIGNUP_LIMITS.email.max} caracteres`
  }

  if (input.password.length < SIGNUP_LIMITS.senha.min) {
    errors.password = `Senha precisa ter pelo menos ${SIGNUP_LIMITS.senha.min} caracteres`
  } else if (input.password.length > SIGNUP_LIMITS.senha.max) {
    errors.password = `Senha pode ter no máximo ${SIGNUP_LIMITS.senha.max} caracteres`
  } else if (input.password !== input.confirmarSenha) {
    errors.confirmarSenha = 'As senhas não coincidem.'
  }

  return errors
}
