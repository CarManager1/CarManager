// ============================================================
//  DADOS DA ESCOLA — edite aqui e o site atualiza sozinho
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

  horario: [
    { dias: 'Segunda a Sexta', horas: '09:00 – 20:00' }, // PREENCHER
    { dias: 'Sábado', horas: '09:00 – 13:00' }, // PREENCHER
  ],

  instagram: '', // opcional, ex: 'https://instagram.com/ecsaocristovao'
  facebook: '', // opcional
}

export const CATEGORIAS = [
  {
    id: 'ligeiros',
    titulo: 'Ligeiros',
    sigla: 'B',
    texto: 'A carta de carro. Código online ou presencial e aulas práticas com horário flexível.',
    pagamento: 'Pagamento em 2x, 4x ou 10x',
    documentos: ['Cartão de Cidadão', 'Atestado Médico'],
  },
  {
    id: 'motociclos',
    titulo: 'Motociclos',
    sigla: 'A1 · A2 · A',
    texto: 'Da 125 cc à moto sem limites. Formação completa com motas da escola.',
    pagamento: 'Pagamento em 2x, 4x ou 6x',
    documentos: ['Cartão de Cidadão', 'Atestado Médico', 'Autorização Paternal (menores)', 'Assento de Nascimento (menores)'],
  },
  {
    id: 'profissionais',
    titulo: 'Profissionais',
    sigla: 'CAM · TCC',
    texto: 'Formação CAM (motoristas de pesados) e TCC (transporte coletivo de crianças).',
    pagamento: 'Fale connosco para condições',
    documentos: ['Cartão de Cidadão', 'Carta de Condução'],
  },
  {
    id: 'tvde',
    titulo: 'TVDE',
    sigla: 'Formação',
    texto: 'Curso de formação para motoristas de TVDE (Uber, Bolt e outras plataformas).',
    pagamento: 'Fale connosco para condições',
    documentos: ['Cartão de Cidadão', 'Carta de Condução'],
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
