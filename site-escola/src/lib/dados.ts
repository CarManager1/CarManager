// ============================================================
//  DADOS DA ESCOLA — edite aqui e o site todo atualiza sozinho
// ============================================================

export const ESCOLA = {
  nome: 'S. Cristóvão',
  nomeCompleto: 'S. Cristóvão — Escola de Condução',
  slogan: 'Contigo em todas as estradas',

  email: 'geral@ecsaocristovao.com',

  // Telefones como aparecem no site e em formato internacional para os links
  telefones: [
    { texto: '218 485 715', link: '+351218485715' },
    { texto: '926 889 955', link: '+351926889955' },
  ],

  // WhatsApp em formato internacional, só dígitos
  whatsapp: '351926889955',

  morada: 'Av. João XXI, n.º 9, 1.º andar',
  codigoPostal: 'Lisboa · Junto ao Metro Areeiro',

  // Mapa (Google Maps)
  mapa: 'https://www.google.com/maps?q=Av.+Jo%C3%A3o+XXI+9,+Lisboa&output=embed',
  comoChegar: 'https://www.google.com/maps/search/?api=1&query=Av.+Jo%C3%A3o+XXI+9,+Lisboa',

  instagram: '', // opcional, ex: 'https://instagram.com/ecsaocristovao'
  facebook: '', // opcional
}

// Plataforma de ensino à distância (aulas de código online)
export const ENSINO_DISTANCIA = 'https://ensinoadistancia.segurancarodoviaria.pt/ensino_a_distancia/login.html'

// Horário de funcionamento
export const HORARIO = [
  { titulo: 'Secretaria', dias: 'Segunda a Sexta', horas: '09:00 – 13:00 e 14:00 – 20:00' },
  { titulo: 'Aulas de condução', dias: 'Segunda a Sexta', horas: '08:00 – 20:00' },
  { titulo: 'Sábado e Domingo', dias: '', horas: 'Encerrado' },
]

// Menu principal
export const MENU = [
  { href: '/#carta-3-meses', label: 'Carta em 3 meses' },
  { href: '/#servicos', label: 'Serviços' },
  { href: '/aulas-de-treino', label: 'Aulas de treino' },
  { href: '/horarios', label: 'Horários' },
  { href: '/sobre-nos', label: 'Sobre nós' },
  { href: '/contactos', label: 'Contactos' },
]

// As duas opções para tirar a carta (Início)
export const OPCOES = [
  {
    titulo: 'Regime normal',
    numero: 'Até 3',
    unidade: 'aulas por semana',
    pontos: ['Horários à tua medida', 'Exames em centros privados ou públicos'],
    mensagem: 'Olá! Quero tirar a carta no regime normal.',
    destaque: false,
  },
  {
    titulo: 'Carta em 3 meses',
    numero: '6',
    unidade: 'aulas por semana',
    pontos: ['Curso intensivo', 'Exames no privado, sem esperas'],
    mensagem: 'Olá! Quero tirar a carta em 3 meses.',
    destaque: true,
  },
]

// Serviços principais (cartões grandes no Início)
export const SERVICOS = [
  {
    titulo: 'Carta de carro',
    sigla: 'Categoria B',
    texto: 'Regime normal ou carta em 3 meses.',
    imagem: '/escola/carro-lisboa.jpg',
    href: '/contactos',
  },
  {
    titulo: 'Carta de mota',
    sigla: 'A1 · A2 · A · B1',
    texto: 'Categorias A1, A2, A e B1.',
    imagem: '/escola/mota.jpg',
    href: '/contactos',
  },
  {
    titulo: 'Aulas de treino',
    sigla: 'Encartados',
    texto: 'Pacotes de 1, 5 ou 10 lições.',
    imagem: '/escola/carro-traseira.jpg',
    href: '/aulas-de-treino',
  },
]

// Outros serviços (lista curta no Início)
export const OUTROS_SERVICOS = [
  'Renovação de carta',
  'Atestado médico',
  'Exame psicotécnico',
  'Exames teórico e prático',
  'Aluguer de viatura para exame',
  'Aulas extra para alunos',
  'Livro de código',
]
