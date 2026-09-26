// ============================================================
//  DADOS DA ESCOLA — edite aqui e o site todo atualiza sozinho
// ============================================================
// Os campos marcados com "PREENCHER" ainda não foram confirmados.
// Substitua pelo valor verdadeiro (mantenha as aspas).

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

  horario: [
    { dias: 'Segunda a Sexta', horas: '09:00 – 20:00' }, // PREENCHER
    { dias: 'Sábado', horas: '09:00 – 13:00' }, // PREENCHER
  ],

  instagram: '', // opcional, ex: 'https://instagram.com/ecsaocristovao'
  facebook: '', // opcional
}

// Menu principal (ordem em que aparece no topo)
export const MENU = [
  { href: '/', label: 'Início' },
  { href: '/cartas', label: 'Cartas' },
  { href: '/planos', label: 'Planos' },
  { href: '/renovacao', label: 'Renovação' },
  { href: '/a-escola', label: 'A Escola' },
  { href: '/duvidas', label: 'Dúvidas' },
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
      'Podes escolher a Carta normal, ao teu ritmo, ou a Carta em 3 meses, um curso intensivo com exames no privado e sem esperas.',
    ],
    imagem: { src: '/escola/aluno-1.jpg', w: 1080, h: 720 },
    pagamento: 'Pronto pagamento (cada aula) ou em 2x, 4x ou 10x',
    documentos: ['Cartão de Cidadão', 'Atestado Médico'],
    destaques: ['Aulas de código online ou presencial', 'Exames em centros privados ou públicos', 'Carros da escola recentes', 'Se reprovares, não pagas*'],
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
    id: 'profissionais',
    titulo: 'Profissionais',
    sigla: 'CAM · TCC',
    resumo: 'Formação CAM (motoristas profissionais) e TCC (transporte coletivo de crianças).',
    descricao: [
      'Para quem conduz profissionalmente: formação para o CAM (Certificado de Aptidão para Motorista) e para o TCC (Transporte Coletivo de Crianças).',
      'Fala connosco para saberes as datas das próximas turmas e as condições.',
    ],
    imagem: { src: '/escola/carro-traseira.jpg', w: 1080, h: 718 },
    pagamento: 'Fala connosco para saberes as condições',
    documentos: ['Cartão de Cidadão', 'Carta de Condução'],
    destaques: ['Formação CAM', 'Formação TCC', 'Horários pensados para quem trabalha'],
  },
  {
    id: 'tvde',
    titulo: 'TVDE',
    sigla: 'Formação',
    resumo: 'Curso de formação para motoristas de TVDE (Uber, Bolt e outras plataformas).',
    descricao: [
      'Queres ser motorista TVDE? Damos-te a formação necessária para começares a trabalhar nas plataformas de transporte, como a Uber ou a Bolt.',
      'Fala connosco para saberes as datas das próximas turmas e as condições.',
    ],
    imagem: { src: '/escola/carro-arte.jpg', w: 699, h: 466 },
    pagamento: 'Fala connosco para saberes as condições',
    documentos: ['Cartão de Cidadão', 'Carta de Condução'],
    destaques: ['Formação para motoristas TVDE', 'Turmas regulares', 'Apoio na inscrição'],
  },
]

// Nos itens, o texto entre **asteriscos** aparece a negrito.
export const PLANOS = [
  {
    titulo: 'Carta normal',
    destaque: false,
    itens: [
      '**Até 3 aulas** por semana',
      'Aulas de código **online ou presencial**',
      'Exames em centros **privados ou públicos**',
      'Pagamento até **10x sem juros**',
      '**Horários flexíveis** — à tua medida',
      'Se reprovares, **não pagas***',
    ],
    nota: true,
  },
  {
    titulo: 'Carta em 3 meses',
    destaque: true,
    itens: [
      'Curso intensivo com **6 aulas por semana**',
      'Aulas de código **online ou presencial**',
      'Exames no **privado, sem esperas**',
      'Pagamento até **10x sem juros**',
      '**Horários flexíveis** — à tua medida',
      'Se reprovares, **não pagas***',
    ],
    nota: true,
  },
  {
    titulo: 'Aulas para encartados',
    destaque: false,
    itens: [
      '**Aulas de treino** para melhorar a prática',
      '**Revalidação** da carta de condução',
      'Pacotes de **1, 5, 8 ou 10 aulas**',
      'Pagamentos **avulsos**',
    ],
    nota: false,
  },
]

export const DUVIDAS = [
  {
    grupo: 'Inscrição',
    perguntas: [
      ['Que documentos preciso para me inscrever?', 'Para a carta de ligeiros: Cartão de Cidadão e atestado médico. Para motociclos, se fores menor, também a autorização paternal e o assento de nascimento.'],
      ['Posso fazer as aulas de código online?', 'Sim. As aulas de código podem ser online ou presenciais, como te der mais jeito.'],
    ],
  },
  {
    grupo: 'Pagamentos',
    perguntas: [
      ['Posso pagar às prestações?', 'Sim. Na carta de ligeiros podes pagar em 2x, 4x ou até 10x sem juros. Nos motociclos, em 2x, 4x ou 6x. Também podes pagar a pronto, aula a aula.'],
      ['E se eu reprovar?', 'Nos planos Carta normal e Carta em 3 meses, se reprovares não pagas o novo exame. Válido para 1 reprovação no exame de código ou de condução.'],
    ],
  },
  {
    grupo: 'Aulas e exames',
    perguntas: [
      ['É mesmo possível tirar a carta em 3 meses?', 'Sim, com o curso intensivo: 6 aulas por semana e exames no privado, sem tempos de espera.'],
      ['Os exames são feitos onde?', 'Em centros de exame privados ou públicos. No plano Carta em 3 meses, os exames são no privado, sem esperas.'],
      ['Já tenho carta mas não conduzo há muito tempo. Podem ajudar?', 'Claro! Temos aulas para encartados, em pacotes de 1, 5, 8 ou 10 aulas, para ganhares confiança ao volante.'],
    ],
  },
  {
    grupo: 'Renovação',
    perguntas: [
      ['Tratam da renovação da carta?', 'Sim, fazemos a renovação de carta na hora. Fala connosco para saberes que documentos precisas no teu caso.'],
    ],
  },
]
