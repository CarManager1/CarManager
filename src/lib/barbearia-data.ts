// Dados e regras da Barbearia (serviços, equipa, horário e geração de vagas)

export type Servico = {
  id: string
  nome: string
  descricao: string
  preco: number
  duracao: number // minutos (múltiplo de INTERVALO)
}

export type Barbeiro = {
  id: string
  nome: string
  especialidade: string
  iniciais: string
}

export type Ocupado = {
  barbeiro_id: string
  hora: string // "HH:MM"
  duracao_min: number
}

export const BARBEARIA = {
  nome: 'Navalha & Co.',
  slogan: 'Barbearia clássica, corte moderno.',
  morada: 'Rua Augusta 123, 1100-048 Lisboa',
  telefone: '+351 912 345 678',
  email: 'geral@navalhaeco.pt',
  instagram: '@navalhaeco',
}

export const SERVICOS: Servico[] = [
  { id: 'corte', nome: 'Corte Clássico', descricao: 'Corte à tesoura ou máquina, lavagem e finalização.', preco: 15, duracao: 30 },
  { id: 'fade', nome: 'Skin Fade', descricao: 'Degradê até à pele com acabamento à navalha.', preco: 18, duracao: 30 },
  { id: 'barba', nome: 'Barba Completa', descricao: 'Toalha quente, navalha, óleo e bálsamo.', preco: 12, duracao: 30 },
  { id: 'corte-barba', nome: 'Corte + Barba', descricao: 'O serviço completo para sair impecável.', preco: 25, duracao: 60 },
  { id: 'crianca', nome: 'Corte Criança', descricao: 'Até aos 12 anos.', preco: 10, duracao: 30 },
  { id: 'pigmentacao', nome: 'Pigmentação de Barba', descricao: 'Preenchimento para uma barba mais uniforme.', preco: 20, duracao: 60 },
]

export const BARBEIROS: Barbeiro[] = [
  { id: 'joao', nome: 'João Ferreira', especialidade: 'Cortes clássicos', iniciais: 'JF' },
  { id: 'miguel', nome: 'Miguel Santos', especialidade: 'Fades & design', iniciais: 'MS' },
  { id: 'rui', nome: 'Rui Costa', especialidade: 'Barbas & navalha', iniciais: 'RC' },
]

// Horário por dia da semana (0 = Domingo). null = fechado.
export const HORARIO: Record<number, { abre: string; fecha: string } | null> = {
  0: null,
  1: null,
  2: { abre: '09:00', fecha: '19:00' },
  3: { abre: '09:00', fecha: '19:00' },
  4: { abre: '09:00', fecha: '19:00' },
  5: { abre: '09:00', fecha: '20:00' },
  6: { abre: '09:00', fecha: '14:00' },
}

export const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
export const INTERVALO = 30 // minutos entre vagas
export const DIAS_ANTECEDENCIA = 30 // até quantos dias se pode marcar

export const paraMinutos = (h: string) => {
  const [hh, mm] = h.split(':').map(Number)
  return hh * 60 + mm
}

export const paraHora = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

// Data local em formato YYYY-MM-DD (sem conversão para UTC)
export const dataISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const estaAberto = (d: Date) => HORARIO[d.getDay()] !== null

// Vagas livres para um barbeiro num dia, tendo em conta a duração do serviço
export function vagasDisponiveis(dia: Date, duracao: number, barbeiroId: string, ocupados: Ocupado[]): string[] {
  const horario = HORARIO[dia.getDay()]
  if (!horario) return []

  const inicio = paraMinutos(horario.abre)
  const fim = paraMinutos(horario.fecha)
  const agora = new Date()
  const hoje = dataISO(agora) === dataISO(dia)
  const minAgora = agora.getHours() * 60 + agora.getMinutes()

  const doBarbeiro = ocupados
    .filter(o => o.barbeiro_id === barbeiroId)
    .map(o => ({ ini: paraMinutos(o.hora), fim: paraMinutos(o.hora) + o.duracao_min }))

  const vagas: string[] = []
  for (let m = inicio; m + duracao <= fim; m += INTERVALO) {
    if (hoje && m <= minAgora) continue
    const colide = doBarbeiro.some(o => m < o.fim && m + duracao > o.ini)
    if (!colide) vagas.push(paraHora(m))
  }
  return vagas
}
