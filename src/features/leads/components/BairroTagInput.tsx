import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'

type BairroTagInputProps = {
  id: string
  value: string[]
  onChange: (bairros: string[]) => void
  suggestions: string[]
}

export function BairroTagInput({ id, value, onChange, suggestions }: BairroTagInputProps) {
  const [draft, setDraft] = useState('')

  function commitDraft() {
    const nome = draft.trim()
    setDraft('')
    if (!nome) return
    const jaExiste = value.some((bairro) => bairro.toLowerCase() === nome.toLowerCase())
    if (jaExiste) return
    onChange([...value, nome])
  }

  function removeBairro(nome: string) {
    onChange(value.filter((bairro) => bairro !== nome))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      commitDraft()
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      removeBairro(value[value.length - 1])
    }
  }

  const suggestionsFiltradas = suggestions.filter(
    (bairro) => !value.some((v) => v.toLowerCase() === bairro.toLowerCase())
  )

  return (
    <div className="flex min-h-8 flex-wrap items-center gap-1.5 rounded-lg border border-input px-2 py-1.5">
      {value.map((bairro) => (
        <span
          key={bairro}
          className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
        >
          {bairro}
          <button
            type="button"
            aria-label={`Remover ${bairro}`}
            onClick={() => removeBairro(bairro)}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <Input
        id={id}
        list={`${id}-suggestions`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={value.length === 0 ? 'Digite e aperte Enter' : ''}
        className="h-6 flex-1 border-none p-0 shadow-none focus-visible:ring-0"
      />
      <datalist id={`${id}-suggestions`}>
        {suggestionsFiltradas.map((bairro) => (
          <option key={bairro} value={bairro} />
        ))}
      </datalist>
    </div>
  )
}
