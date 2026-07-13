import { onlyDigits } from './telefoneMask'

export function buildWhatsAppLink(telefone: string): string {
  return `https://wa.me/55${onlyDigits(telefone)}`
}
