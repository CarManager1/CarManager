import { supabase } from '@/lib/supabase'

export type EstadoAtestado = 'Marcado' | 'Realizado' | 'Faltou' | 'Cancelado'

export type Medico = {
  id: number
  workshop_id: number
  nome: string
  valor_atestado: number
  ativo: boolean
}

export type Atestado = {
  id: number
  workshop_id: number
  medico_id: number | null
  data: string
  hora: string | null
  nome_aluno: string
  documento: string | null
  telemovel: string | null
  categoria: string | null
  tipo: string | null
  estado: EstadoAtestado
  valor_medico: number
  valor_aluno: number
  pago_medico: boolean
  observacoes: string | null
}

export const ESTADOS: EstadoAtestado[] = ['Marcado', 'Realizado', 'Faltou', 'Cancelado']

export const ESTADO_CORES: Record<EstadoAtestado, string> = {
  Marcado: 'bg-blue-50 text-blue-700 border-blue-200',
  Realizado: 'bg-green-50 text-green-700 border-green-200',
  Faltou: 'bg-orange-50 text-orange-700 border-orange-200',
  Cancelado: 'bg-zinc-100 text-zinc-500 border-zinc-200',
}

export const CATEGORIAS = ['AM', 'A1', 'A2', 'A', 'B1', 'B', 'BE', 'C1', 'C', 'CE', 'D1', 'D', 'DE', 'T']

export const TIPOS = ['Novo título', 'Revalidação', 'Grupo 2', 'Averbamento', 'Outro']

// Datas em formato local (evita o desvio de um dia do toISOString em Portugal no verão)
export const dataISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const formatarData = (iso: string) => {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

export const formatarHora = (hora: string | null) => (hora ? hora.slice(0, 5) : '--:--')

export const euros = (v: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Number(v) || 0)

// Descobre a escola do utilizador (dono -> oficinas, funcionário -> mecanicos)
export async function carregarEscola() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const role: string = user.user_metadata?.role || 'owner'

  if (role === 'mechanic') {
    const { data: mec } = await supabase.from('mecanicos').select('workshop_id').eq('email', user.email).single()
    return mec ? { escolaId: mec.workshop_id as number, role, nomeEscola: '' } : null
  }

  const { data: ofi } = await supabase.from('oficinas').select('*').eq('user_id', user.id).single()
  return ofi ? { escolaId: ofi.id as number, role, nomeEscola: (ofi.nome_oficina as string) || '' } : null
}
