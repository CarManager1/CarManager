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
  { href: '/#3-meses', label: 'Carta em 3 meses' },
  { href: '/#servicos', label: 'Serviços' },
  { href: '/horarios', label: 'Horários' },
  { href: '/sobre-nos', label: 'Sobre nós' },
  { href: '/contactos', label: 'Contactos' },
]

// Carta em 3 meses (destaque no Início)
export const CARTA_3_MESES = {
  pontos: [
    { titulo: '6 aulas', texto: 'por semana, num curso intensivo' },
    { titulo: 'Exames no privado', texto: 'sem esperas' },
    { titulo: 'Até 10x', texto: 'sem juros' },
    { titulo: 'Reprovas?', texto: 'Não pagas*' },
  ],
  nota: '*Válido apenas para 1 reprovação no exame de código ou condução.',
}

// Serviços principais (cartões grandes no Início)
export const SERVICOS = [
  {
    titulo: 'Carta de carro',
    sigla: 'Categoria B',
    texto: 'Pronto pagamento ou até 10 prestações.',
    imagem: '/escola/carro-lisboa.jpg',
  },
  {
    titulo: 'Carta de mota',
    sigla: 'A1 · A2 · A · B1',
    texto: 'Pronto pagamento ou até 6 prestações.',
    imagem: '/escola/mota.jpg',
  },
  {
    titulo: 'Carro + mota',
    sigla: 'Categoria A + B',
    texto: 'As duas cartas de uma vez.',
    imagem: '/escola/aluno-2.jpg',
  },
  {
    titulo: 'Aulas de treino',
    sigla: 'Encartados',
    texto: 'Pacotes de 1, 5 ou 10 lições.',
    imagem: '/escola/carro-traseira.jpg',
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
