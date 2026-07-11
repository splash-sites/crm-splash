export const TELEFONE_DIGITS = 11
export const TELEFONE_MASKED_MAX_LENGTH = '(XX) XXXXX-XXXX'.length

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, TELEFONE_DIGITS)
}

export function maskTelefone(rawDigits: string): string {
  const digits = onlyDigits(rawDigits)
  if (digits.length === 0) return ''
  const ddd = digits.slice(0, 2)
  if (digits.length <= 2) return `(${ddd}`
  const primeiraParte = digits.slice(2, 7)
  if (digits.length <= 7) return `(${ddd}) ${primeiraParte}`
  const segundaParte = digits.slice(7, 11)
  return `(${ddd}) ${primeiraParte}-${segundaParte}`
}
