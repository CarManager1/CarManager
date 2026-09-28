// ============================================================
//  PREÇOS — edite aqui os valores (em euros)
// ============================================================
// Escreva o número sem o símbolo do euro, com ponto para os cêntimos:
//   45      -> aparece "45,00 €"
//   12.5    -> aparece "12,50 €"
//   null    -> aparece "Sob consulta"
// Todos os valores estão a null até serem preenchidos. PREENCHER

export type Linha = [descricao: string, preco: number | null]

export type TabelaPrecos = {
  id: string
  titulo: string
  subtitulo: string
  grupos: { nome: string; nota?: string; linhas: Linha[] }[]
}

export const PRECOS_CURSOS: TabelaPrecos[] = [
  {
    id: 'ligeiros',
    titulo: 'Carta de Ligeiros',
    subtitulo: 'Categoria B',
    grupos: [
      {
        nome: 'Curso completo',
        nota: 'Prestações sem juros',
        linhas: [
          ['Pronto pagamento (cada aula)', null],
          ['Pagamento em 2x (cada prestação)', null],
          ['Pagamento em 4x (cada prestação)', null],
          ['Pagamento em 10x (cada prestação)', null],
        ],
      },
      {
        nome: 'Exames',
        linhas: [
          ['Exame de código', null],
          ['Exame de condução', null],
        ],
      },
      {
        nome: 'Aulas de treino',
        linhas: [
          ['1 aula', null],
          ['5 aulas', null],
          ['8 aulas', null],
          ['10 aulas', null],
        ],
      },
    ],
  },
  {
    id: 'motociclos',
    titulo: 'Carta de Motociclos',
    subtitulo: 'Categorias A1 · A2 · A',
    grupos: [
      {
        nome: 'Curso completo',
        nota: 'Prestações sem juros',
        linhas: [
          ['Pronto pagamento (cada aula)', null],
          ['Pagamento em 2x (cada prestação)', null],
          ['Pagamento em 4x (cada prestação)', null],
          ['Pagamento em 6x (cada prestação)', null],
        ],
      },
      {
        nome: 'Exames',
        linhas: [
          ['Exame de código', null],
          ['Exame de condução', null],
        ],
      },
      {
        nome: 'Aulas de treino',
        linhas: [
          ['1 aula', null],
          ['5 aulas', null],
          ['8 aulas', null],
          ['10 aulas', null],
        ],
      },
    ],
  },
  {
    id: 'renovacao',
    titulo: 'Renovação de carta',
    subtitulo: 'Na hora',
    grupos: [
      {
        nome: 'Renovação',
        nota: 'Usa o simulador para saberes o valor no teu caso',
        linhas: [
          ['Tratamento da renovação', null],
          ['Atestado médico', null],
          ['Avaliação psicológica', null],
        ],
      },
    ],
  },
]

// Valores usados no simulador de renovação (página Renovação)
export const PRECOS_RENOVACAO = {
  servico: null as number | null, // tratamento da renovação pela escola (incluindo taxas) — PREENCHER
  atestado: null as number | null, // atestado médico — PREENCHER
  psicotecnico: null as number | null, // avaliação psicológica (psicotécnico) — PREENCHER
  exameEspecial: null as number | null, // exame especial de condução (carta caducada há 2 a 5 anos) — PREENCHER
}

export function formatarPreco(valor: number | null) {
  if (valor === null) return 'Sob consulta'
  return `${valor.toFixed(2).replace('.', ',')} €`
}
