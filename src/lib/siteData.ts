// Dados e configuração do site da barbearia (BRAND, LOCATIONS, PRICING_DATA, FAQS…)

export type Service = {
  id: string
  name: string
  description: string
  price: number
  duration: number // minutos (múltiplo de SLOT_INTERVAL)
}

export type Barber = {
  id: string
  name: string
  specialty: string
  initials: string
}

export type Location = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  mapsUrl: string
}

export type Ocupado = {
  barbeiro_id: string
  hora: string // "HH:MM"
  duracao_min: number
}

export const BRAND = {
  name: 'Navalha & Co.',
  tagline: 'Barbearia clássica, corte moderno.',
  description: 'Cortes, barbas e cuidados à moda antiga, feitos por quem sabe.',
  since: 2015,
  instagram: '@navalhaeco',
  instagramUrl: 'https://instagram.com/navalhaeco',
}

export const LOCATIONS: Location[] = [
  {
    id: 'lisboa',
    name: 'Baixa, Lisboa',
    address: 'Rua Augusta 123, 1100-048 Lisboa',
    phone: '+351 912 345 678',
    email: 'geral@navalhaeco.pt',
    mapsUrl: 'https://maps.google.com/?q=Rua+Augusta+123+Lisboa',
  },
]

// Imagens em public/media (substituir pelas fotos reais da barbearia)
export const HERO_SLIDES = [
  { src: '/media/hero-1.jpg', alt: 'Interior da barbearia' },
  { src: '/media/hero-2.jpg', alt: 'Barbeiro a fazer um corte' },
  { src: '/media/hero-3.jpg', alt: 'Barba feita à navalha' },
]

export const PRICING_DATA: Service[] = [
  { id: 'corte', name: 'Corte Clássico', description: 'Corte à tesoura ou máquina, lavagem e finalização.', price: 15, duration: 30 },
  { id: 'fade', name: 'Skin Fade', description: 'Degradê até à pele com acabamento à navalha.', price: 18, duration: 30 },
  { id: 'barba', name: 'Barba Completa', description: 'Toalha quente, navalha, óleo e bálsamo.', price: 12, duration: 30 },
  { id: 'corte-barba', name: 'Corte + Barba', description: 'O serviço completo para sair impecável.', price: 25, duration: 60 },
  { id: 'crianca', name: 'Corte Criança', description: 'Até aos 12 anos.', price: 10, duration: 30 },
  { id: 'pigmentacao', name: 'Pigmentação de Barba', description: 'Preenchimento para uma barba mais uniforme.', price: 20, duration: 60 },
]

export const BARBERS: Barber[] = [
  { id: 'joao', name: 'João Ferreira', specialty: 'Cortes clássicos', initials: 'JF' },
  { id: 'miguel', name: 'Miguel Santos', specialty: 'Fades & design', initials: 'MS' },
  { id: 'rui', name: 'Rui Costa', specialty: 'Barbas & navalha', initials: 'RC' },
]

export const FAQS = [
  { q: 'Preciso de marcar ou posso aparecer?', a: 'Aceitamos clientes sem marcação quando há vagas, mas recomendamos marcar online para garantir o seu horário.' },
  { q: 'Como desmarco ou altero uma marcação?', a: 'Ligue-nos com a referência da marcação, de preferência com 24 horas de antecedência.' },
  { q: 'Que formas de pagamento aceitam?', a: 'Numerário, multibanco e MB WAY.' },
  { q: 'Quanto tempo demora um corte?', a: 'Cerca de 30 minutos. O Corte + Barba demora cerca de uma hora.' },
  { q: 'Cortam cabelo a crianças?', a: 'Sim, até aos 12 anos temos o Corte Criança com preço reduzido.' },
]

// Horário por dia da semana (0 = Domingo). null = fechado.
export const OPENING_HOURS: Record<number, { open: string; close: string } | null> = {
  0: null,
  1: null,
  2: { open: '09:00', close: '19:00' },
  3: { open: '09:00', close: '19:00' },
  4: { open: '09:00', close: '19:00' },
  5: { open: '09:00', close: '20:00' },
  6: { open: '09:00', close: '14:00' },
}

export const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
export const SLOT_INTERVAL = 30 // minutos entre vagas
export const BOOKING_DAYS_AHEAD = 30 // até quantos dias se pode marcar

export const paraMinutos = (h: string) => {
  const [hh, mm] = h.split(':').map(Number)
  return hh * 60 + mm
}

export const paraHora = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

// Data local em formato YYYY-MM-DD (sem conversão para UTC)
export const dataISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const estaAberto = (d: Date) => OPENING_HOURS[d.getDay()] !== null

// Vagas livres para um barbeiro num dia, tendo em conta a duração do serviço
export function vagasDisponiveis(dia: Date, duracao: number, barbeiroId: string, ocupados: Ocupado[]): string[] {
  const horario = OPENING_HOURS[dia.getDay()]
  if (!horario) return []

  const inicio = paraMinutos(horario.open)
  const fim = paraMinutos(horario.close)
  const agora = new Date()
  const hoje = dataISO(agora) === dataISO(dia)
  const minAgora = agora.getHours() * 60 + agora.getMinutes()

  const doBarbeiro = ocupados
    .filter(o => o.barbeiro_id === barbeiroId)
    .map(o => ({ ini: paraMinutos(o.hora), fim: paraMinutos(o.hora) + o.duracao_min }))

  const vagas: string[] = []
  for (let m = inicio; m + duracao <= fim; m += SLOT_INTERVAL) {
    if (hoje && m <= minAgora) continue
    const colide = doBarbeiro.some(o => m < o.fim && m + duracao > o.ini)
    if (!colide) vagas.push(paraHora(m))
  }
  return vagas
}
