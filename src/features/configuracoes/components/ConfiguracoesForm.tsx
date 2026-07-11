import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { maskTelefone, onlyDigits, TELEFONE_MASKED_MAX_LENGTH } from '@/shared/lib/telefoneMask'
import type { Perfil, PerfilInput } from '@/shared/types/perfil'
import {
  CONFIG_LIMITS,
  validateConfiguracoes,
  type ConfiguracoesErrors,
} from '../lib/validateConfiguracoes'

type ConfiguracoesFormProps = {
  perfil: Perfil
  onSave: (input: PerfilInput) => Promise<void>
}

function fromPerfil(perfil: Perfil): PerfilInput {
  return {
    nome: perfil.nome ?? '',
    telefone: perfil.telefone ?? '',
    dias_para_contato_padrao: perfil.dias_para_contato_padrao,
  }
}

export function ConfiguracoesForm({ perfil, onSave }: ConfiguracoesFormProps) {
  const [form, setForm] = useState<PerfilInput>(fromPerfil(perfil))
  const [fieldErrors, setFieldErrors] = useState<ConfiguracoesErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm(fromPerfil(perfil))
  }, [perfil])

  function field<K extends keyof PerfilInput>(key: K, value: PerfilInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
    setSuccess(false)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    const errors = validateConfiguracoes(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await onSave(form)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="config-nome">Nome</Label>
        <Input
          id="config-nome"
          value={form.nome ?? ''}
          onChange={(e) => field('nome', e.target.value)}
          maxLength={CONFIG_LIMITS.nome.max}
          aria-invalid={Boolean(fieldErrors.nome)}
          aria-describedby={fieldErrors.nome ? 'config-nome-error' : undefined}
        />
        {fieldErrors.nome && (
          <p id="config-nome-error" role="alert" className="text-xs text-destructive">
            {fieldErrors.nome}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="config-telefone">Telefone</Label>
        <Input
          id="config-telefone"
          value={maskTelefone(form.telefone ?? '')}
          onChange={(e) => field('telefone', onlyDigits(e.target.value))}
          placeholder="(XX) XXXXX-XXXX"
          maxLength={TELEFONE_MASKED_MAX_LENGTH}
          aria-invalid={Boolean(fieldErrors.telefone)}
          aria-describedby={fieldErrors.telefone ? 'config-telefone-error' : undefined}
        />
        {fieldErrors.telefone && (
          <p id="config-telefone-error" role="alert" className="text-xs text-destructive">
            {fieldErrors.telefone}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="config-dias">Dias padrão pro próximo contato</Label>
        <Input
          id="config-dias"
          type="number"
          min={CONFIG_LIMITS.diasParaContatoPadrao.min}
          max={CONFIG_LIMITS.diasParaContatoPadrao.max}
          value={form.dias_para_contato_padrao ?? ''}
          onChange={(e) => field('dias_para_contato_padrao', Number(e.target.value))}
          aria-invalid={Boolean(fieldErrors.dias_para_contato_padrao)}
          aria-describedby={
            fieldErrors.dias_para_contato_padrao ? 'config-dias-error' : undefined
          }
        />
        <p className="text-xs text-muted-foreground">
          Usado como ponto de partida ao cadastrar um lead novo. Pode ser ajustado por lead.
        </p>
        {fieldErrors.dias_para_contato_padrao && (
          <p id="config-dias-error" role="alert" className="text-xs text-destructive">
            {fieldErrors.dias_para_contato_padrao}
          </p>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-sm text-green-700">
          Salvo.
        </p>
      )}
      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  )
}
