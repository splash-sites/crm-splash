export function calcularProximoContato(baseISO: string, diasParaContato: number): string {
  const base = new Date(baseISO)
  base.setDate(base.getDate() + diasParaContato)
  return base.toISOString()
}
