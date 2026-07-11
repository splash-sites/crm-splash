export type Perfil = {
  id: string
  nome: string | null
  telefone: string | null
  dias_para_contato_padrao: number
  created_at: string
}

export type PerfilInput = {
  nome?: string | null
  telefone?: string | null
  dias_para_contato_padrao?: number
}
