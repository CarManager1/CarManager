// ============================================================
//  DADOS DA ESCOLA — edite aqui e o site todo atualiza sozinho
// ============================================================
// Os campos marcados com "PREENCHER" ainda não foram confirmados.
// Substitua pelo valor verdadeiro (mantenha as aspas).
// Os preços estão em src/lib/precos.ts e as regras do simulador em src/lib/renovacao.ts

export const ESCOLA = {
  nome: 'S. Cristóvão',
  nomeCompleto: 'S. Cristóvão — Escola de Condução',
  slogan: 'Contigo em todas as estradas',

  // Telefone como aparece no site, e em formato internacional para os links
  telefone: '21X XXX XXX', // PREENCHER
  telefoneLink: '+351210000000', // PREENCHER (sem espaços)

  // Número de WhatsApp em formato internacional, só dígitos (ex: 351912345678)
  whatsapp: '351910000000', // PREENCHER

  email: 'geral@ecsaocristovao.com', // PREENCHER / confirmar
  site: 'www.ecsaocristovao.com',

  morada: 'Rua Exemplo, n.º 00', // PREENCHER
  codigoPostal: '0000-000 Lisboa', // PREENCHER

  // Link "Partilhar > Incorporar mapa" do Google Maps (só o endereço dentro de src="...")
  mapa: '', // PREENCHER (opcional)

  instagram: '', // opcional, ex: 'https://instagram.com/ecsaocristovao'
  facebook: '', // opcional
}

// Plataforma de ensino à distância (aulas de código online)
export const ENSINO_DISTANCIA = 'https://ensinoadistancia.segurancarodoviaria.pt/ensino_a_distancia/login.html'

// ------------------------------------------------------------
//  HORÁRIOS — PREENCHER com os horários verdadeiros
// ------------------------------------------------------------
export const HORARIOS = {
  secretaria: [
    { dias: 'Segunda a Sexta', horas: '09:00 – 13:00 · 14:00 – 20:00' },
    { dias: 'Sábado', horas: '09:00 – 13:00' },
    { dias: 'Domingo e feriados', horas: 'Encerrado' },
  ],
  codigo: [
    { dias: 'Segunda a Sexta', horas: '10:00 – 11:00' },
    { dias: 'Segunda a Sexta', horas: '18:00 – 19:00' },
    { dias: 'Sábado', horas: '10:00 – 11:00' },
  ],
  conducao: [
    { dias: 'Segunda a Sexta', horas: '07:00 – 21:00' },
    { dias: 'Sábado', horas: '08:00 – 13:00' },
  ],
}

// Menu principal (ordem em que aparece no topo)
export const MENU = [
  { href: '/cartas', label: 'Cursos' },
  { href: '/precos', label: 'Preços' },
  { href: '/horarios', label: 'Horários' },
  { href: '/renovacao', label: 'Renovação' },
  { href: '/sobre-nos', label: 'Sobre nós' },
  { href: '/contactos', label: 'Contactos' },
]

export type Categoria = {
  id: string
  titulo: string
  sigla: string
  resumo: string
  descricao: string[]
  imagem: { src: string; w: number; h: number }
  pagamento: string
  documentos: string[]
  destaques: string[]
}

export const CATEGORIAS: Categoria[] = [
  {
    id: 'ligeiros',
    titulo: 'Ligeiros',
    sigla: 'B',
    resumo: 'A carta de carro. Código online ou presencial e aulas práticas com horário flexível.',
    descricao: [
      'A carta de categoria B permite conduzir automóveis ligeiros. Na S. Cristóvão preparamos-te para o exame de código e para o exame de condução, com instrutores que te acompanham do primeiro dia até teres a carta na mão.',
      'As aulas de código podem ser presenciais ou à distância, na plataforma de ensino online.',
    ],
    imagem: { src: '/escola/aluno-1.jpg', w: 1080, h: 720 },
    pagamento: 'Pronto pagamento (cada aula) ou em 2x, 4x ou 10x',
    documentos: ['Cartão de Cidadão', 'Atestado Médico'],
    destaques: ['Aulas de código online ou presencial', 'Exames em centros privados ou públicos', 'Carros da escola recentes', 'Pagamento até 10x sem juros'],
  },
  {
    id: 'motociclos',
    titulo: 'Motociclos',
    sigla: 'A1 · A2 · A',
    resumo: 'Da 125 cc à moto sem limites. Formação completa com as motas da escola.',
    descricao: [
      'Tiramos-te a carta de mota em qualquer categoria: A1 (até 125 cc), A2 (potência média) ou A (sem limite de potência).',
      'As aulas são dadas com as motas da escola e acompanhamento do instrutor, para ganhares segurança antes de ires para a estrada sozinho.',
    ],
    imagem: { src: '/escola/mota.jpg', w: 612, h: 420 },
    pagamento: 'Pronto pagamento (cada aula) ou em 2x, 4x ou 6x',
    documentos: ['Cartão de Cidadão', 'Atestado Médico', 'Autorização Paternal (menores)', 'Assento de Nascimento (menores)'],
    destaques: ['Categorias A1, A2 e A', 'Motas da escola', 'Aulas de código online ou presencial', 'Aulas de treino avulsas'],
  },
  {
    id: 'treino',
    titulo: 'Aulas de treino',
    sigla: 'Encartados',
    resumo: 'Já tens carta mas perdeste a confiança? Volta à estrada com um instrutor ao teu lado.',
    descricao: [
      'As aulas de treino são para quem já tem carta e quer ganhar prática: porque esteve muito tempo sem conduzir, porque vai começar a conduzir na cidade ou na autoestrada, ou simplesmente para se sentir mais seguro.',
      'Escolhes quantas aulas queres e marcamos contigo os horários. Pagas à aula, sem compromisso.',
    ],
    imagem: { src: '/escola/carro-traseira.jpg', w: 1080, h: 718 },
    pagamento: 'Pacotes de 1, 5, 8 ou 10 aulas, pagamentos avulsos',
    documentos: ['Cartão de Cidadão', 'Carta de Condução'],
    destaques: ['Pacotes de 1, 5, 8 ou 10 aulas', 'Carro ou mota', 'Horários à tua medida', 'Revalidação da carta de condução'],
  },
]

export const DUVIDAS = [
  {
    grupo: 'Inscrição',
    perguntas: [
      ['Que documentos preciso para me inscrever?', 'Para a carta de ligeiros: Cartão de Cidadão e atestado médico. Para motociclos, se fores menor, também a autorização paternal e o assento de nascimento.'],
      ['Posso fazer as aulas de código à distância?', 'Sim. Podes ter aulas de código presenciais na escola ou à distância, na plataforma de ensino online. O acesso está no botão "Ensino à distância", no topo do site.'],
    ],
  },
  {
    grupo: 'Pagamentos',
    perguntas: [
      ['Posso pagar às prestações?', 'Sim. Na carta de ligeiros podes pagar em 2x, 4x ou até 10x sem juros. Nos motociclos, em 2x, 4x ou 6x. Também podes pagar a pronto, aula a aula.'],
      ['Onde vejo os preços?', 'Na página Preços. Os valores podem mudar, por isso confirma sempre na secretaria antes de te inscreveres.'],
    ],
  },
  {
    grupo: 'Aulas e exames',
    perguntas: [
      ['Os exames são feitos onde?', 'Em centros de exame privados ou públicos.'],
      ['Já tenho carta mas não conduzo há muito tempo. Podem ajudar?', 'Claro! Temos aulas para encartados, em pacotes de 1, 5, 8 ou 10 aulas, para ganhares confiança ao volante.'],
    ],
  },
  {
    grupo: 'Renovação',
    perguntas: [
      ['Como sei se preciso de atestado médico para renovar?', 'Usa o simulador na página Renovação: respondes a algumas perguntas e ficas a saber o que precisas e quanto custa.'],
      ['Tratam da renovação da carta?', 'Sim, fazemos a renovação de carta na hora e ajudamos-te a marcar o atestado médico.'],
    ],
  },
]
