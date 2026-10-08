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

  // Morada (deixe vazio para não aparecer no site)
  morada: '',
  codigoPostal: '',

  // Link "Partilhar > Incorporar mapa" do Google Maps (só o endereço dentro de src="...")
  mapa: '',

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
  { href: '/#servicos', label: 'Serviços' },
  { href: '/horarios', label: 'Horários' },
  { href: '/sobre-nos', label: 'Sobre nós' },
  { href: '/contactos', label: 'Contactos' },
]

// Serviços principais (cartões grandes no Início)
export const SERVICOS = [
  {
    titulo: 'Carta de carro',
    sigla: 'Categoria B',
    texto: 'Pronto pagamento ou até 10 prestações.',
    imagem: '/escola/aluno-1.jpg',
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
