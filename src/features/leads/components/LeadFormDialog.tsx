import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useDefaultDiasParaContato } from '@/shared/hooks/useDefaultDiasParaContato'
import { BairroTagInput } from './BairroTagInput'
import { useBairroSuggestions } from '../hooks/useBairroSuggestions'
import { onlyDigits, maskTelefone, TELEFONE_MASKED_MAX_LENGTH } from '@/shared/lib/telefoneMask'
import { ETAPA_LABELS, FAIXA_PRECO_LABELS } from '@/shared/lib/leadLabels'
import { LEAD_LIMITS, validateLeadInput, type LeadInputErrors } from '../lib/validateLeadInput'
import {
  ETAPAS,
  FAIXAS_PRECO,
  FINALIDADES,
  ORIGENS,
  TIPOS_IMOVEL,
  type Etapa,
  type Lead,
  type LeadInput,
} from '@/shared/types/lead'

const ORIGEM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  indicacao: 'Indicação',
  portal: 'Portal',
  placa: 'Placa',
  whatsapp: 'WhatsApp',
  outro: 'Outro',
}

const TIPO_IMOVEL_LABELS: Record<string, string> = {
  apartamento: 'Apartamento',
  casa: 'Casa',
  terreno: 'Terreno',
  comercial: 'Comercial',
}

const FINALIDADE_LABELS: Record<string, string> = {
  comprar: 'Comprar',
  alugar: 'Alugar',
  investir: 'Investir',
}

function emptyForm(diasPadrao: number): LeadInput {
  return {
    nome: '',
    telefone: '',
    email: '',
    origem: null,
    tipo_imovel: null,
    finalidade: null,
    bairros: [],
    faixa_preco: null,
    etapa: 'novo',
    dias_para_contato: diasPadrao,
    observacoes: '',
  }
}

function fromLead(lead: Lead): LeadInput {
  return {
    nome: lead.nome,
    telefone: lead.telefone,
    email: lead.email ?? '',
    origem: lead.origem,
    tipo_imovel: lead.tipo_imovel,
    finalidade: lead.finalidade,
    bairros: lead.bairros,
    faixa_preco: lead.faixa_preco,
    etapa: lead.etapa,
    dias_para_contato: lead.dias_para_contato,
    observacoes: lead.observacoes ?? '',
  }
}

type LeadFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null
  onSubmit: (input: LeadInput) => Promise<void>
}

export function LeadFormDialog({ open, onOpenChange, lead, onSubmit }: LeadFormDialogProps) {
  const diasPadrao = useDefaultDiasParaContato(open && !lead)
  const [form, setForm] = useState<LeadInput>(lead ? fromLead(lead) : emptyForm(diasPadrao))
  const [fieldErrors, setFieldErrors] = useState<LeadInputErrors>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const bairros = useBairroSuggestions(open)

  useEffect(() => {
    if (open) {
      setForm(lead ? fromLead(lead) : emptyForm(diasPadrao))
      setFieldErrors({})
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lead])

  useEffect(() => {
    if (open && !lead) field('dias_para_contato', diasPadrao)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diasPadrao])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const errors = validateLeadInput(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit(form)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar lead')
    } finally {
      setSubmitting(false)
    }
  }

  function field<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lead ? 'Editar lead' : 'Novo lead'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor="lead-nome">Nome</Label>
              <Input
                id="lead-nome"
                value={form.nome}
                onChange={(e) => field('nome', e.target.value)}
                maxLength={LEAD_LIMITS.nome.max}
                aria-invalid={Boolean(fieldErrors.nome)}
                aria-describedby={fieldErrors.nome ? 'lead-nome-error' : undefined}
                required
              />
              {fieldErrors.nome && (
                <p id="lead-nome-error" role="alert" className="text-xs text-destructive">
                  {fieldErrors.nome}
                </p>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor="lead-telefone">Telefone</Label>
              <Input
                id="lead-telefone"
                value={maskTelefone(form.telefone)}
                onChange={(e) => field('telefone', onlyDigits(e.target.value))}
                placeholder="(XX) XXXXX-XXXX"
                maxLength={TELEFONE_MASKED_MAX_LENGTH}
                aria-invalid={Boolean(fieldErrors.telefone)}
                aria-describedby={fieldErrors.telefone ? 'lead-telefone-error' : undefined}
                required
              />
              {fieldErrors.telefone && (
                <p id="lead-telefone-error" role="alert" className="text-xs text-destructive">
                  {fieldErrors.telefone}
                </p>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                value={form.email ?? ''}
                onChange={(e) => field('email', e.target.value)}
                maxLength={LEAD_LIMITS.email.max}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'lead-email-error' : undefined}
              />
              {fieldErrors.email && (
                <p id="lead-email-error" role="alert" className="text-xs text-destructive">
                  {fieldErrors.email}
                </p>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor="lead-etapa">Etapa</Label>
              <Select
                value={form.etapa}
                onValueChange={(value) => field('etapa', value as LeadInput['etapa'])}
              >
                <SelectTrigger id="lead-etapa" className="w-full">
                  <SelectValue placeholder="Selecione">
                    {(value: Etapa | null) => (value ? ETAPA_LABELS[value] : 'Selecione')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ETAPAS.map((etapa) => (
                    <SelectItem key={etapa} value={etapa}>
                      {ETAPA_LABELS[etapa]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor="lead-bairros">Bairros de interesse</Label>
              <BairroTagInput
                id="lead-bairros"
                value={form.bairros ?? []}
                onChange={(value) => field('bairros', value)}
                suggestions={bairros}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor="lead-origem">Origem</Label>
              <Select
                value={form.origem ?? undefined}
                onValueChange={(value) => field('origem', value as LeadInput['origem'])}
              >
                <SelectTrigger id="lead-origem" className="w-full">
                  <SelectValue placeholder="Selecione">
                    {(value: string | null) => (value ? ORIGEM_LABELS[value] : 'Selecione')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ORIGENS.map((origem) => (
                    <SelectItem key={origem} value={origem}>
                      {ORIGEM_LABELS[origem]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor="lead-tipo-imovel">Tipo de imóvel</Label>
              <Select
                value={form.tipo_imovel ?? undefined}
                onValueChange={(value) => field('tipo_imovel', value as LeadInput['tipo_imovel'])}
              >
                <SelectTrigger id="lead-tipo-imovel" className="w-full">
                  <SelectValue placeholder="Selecione">
                    {(value: string | null) => (value ? TIPO_IMOVEL_LABELS[value] : 'Selecione')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_IMOVEL.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {TIPO_IMOVEL_LABELS[tipo]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor="lead-finalidade">Finalidade</Label>
              <Select
                value={form.finalidade ?? undefined}
                onValueChange={(value) => field('finalidade', value as LeadInput['finalidade'])}
              >
                <SelectTrigger id="lead-finalidade" className="w-full">
                  <SelectValue placeholder="Selecione">
                    {(value: string | null) => (value ? FINALIDADE_LABELS[value] : 'Selecione')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {FINALIDADES.map((finalidade) => (
                    <SelectItem key={finalidade} value={finalidade}>
                      {FINALIDADE_LABELS[finalidade]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor="lead-faixa-preco">Faixa de preço</Label>
              <Select
                value={form.faixa_preco ?? undefined}
                onValueChange={(value) => field('faixa_preco', value as LeadInput['faixa_preco'])}
              >
                <SelectTrigger id="lead-faixa-preco" className="w-full">
                  <SelectValue placeholder="Selecione">
                    {(value: string | null) => (value ? FAIXA_PRECO_LABELS[value] : 'Selecione')}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {FAIXAS_PRECO.map((faixa) => (
                    <SelectItem key={faixa} value={faixa}>
                      {FAIXA_PRECO_LABELS[faixa]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor="lead-dias-contato">Dias para o próximo contato</Label>
              <Input
                id="lead-dias-contato"
                type="number"
                min={1}
                max={365}
                value={form.dias_para_contato ?? ''}
                onChange={(e) => field('dias_para_contato', Number(e.target.value))}
                aria-invalid={Boolean(fieldErrors.dias_para_contato)}
                aria-describedby={
                  fieldErrors.dias_para_contato ? 'lead-dias-contato-error' : undefined
                }
              />
              {fieldErrors.dias_para_contato && (
                <p id="lead-dias-contato-error" role="alert" className="text-xs text-destructive">
                  {fieldErrors.dias_para_contato}
                </p>
              )}
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="lead-observacoes">Observações</Label>
            <Textarea
              id="lead-observacoes"
              value={form.observacoes ?? ''}
              onChange={(e) => field('observacoes', e.target.value)}
              maxLength={LEAD_LIMITS.observacoes.max}
              aria-invalid={Boolean(fieldErrors.observacoes)}
              aria-describedby={fieldErrors.observacoes ? 'lead-observacoes-error' : undefined}
              className="field-sizing-fixed min-h-24 max-h-48 resize-none [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {fieldErrors.observacoes ? (
                <p id="lead-observacoes-error" role="alert" className="text-destructive">
                  {fieldErrors.observacoes}
                </p>
              ) : (
                <span />
              )}
              <span>
                {(form.observacoes ?? '').length}/{LEAD_LIMITS.observacoes.max}
              </span>
            </div>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
