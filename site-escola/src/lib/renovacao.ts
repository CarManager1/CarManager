// ============================================================
//  REGRAS DO SIMULADOR DE RENOVAÇÃO
// ============================================================
// Resumo das regras de revalidação da carta de condução em Portugal
// (Regulamento da Habilitação Legal para Conduzir). Confirme com o IMT
// se a lei mudar e ajuste aqui os números.

// Idade a partir da qual o Grupo 1 (carro/mota) precisa de atestado médico
export const IDADE_ATESTADO_GRUPO1 = 60

// Idade a partir da qual o Grupo 2 (pesados / profissionais) precisa de avaliação psicológica
export const IDADE_PSICO_GRUPO2 = 50

// Idades em que a carta do Grupo 1 é revalidada (depois dos 70, de 2 em 2 anos)
export const REVALIDACOES_GRUPO1 = [30, 40, 50, 60, 65, 70]

export type SituacaoCarta = 'valida' | 'ate2' | 'de2a5' | 'mais5'

export type RespostasSimulador = {
  idade: number
  pesados: boolean // tem categorias do Grupo 2 (C1, C, CE, D1, D, DE...)
  profissional: boolean // usa a carta B como profissional (táxi, TVDE, ambulância, bombeiros, transporte escolar)
  situacao: SituacaoCarta
}

export type ResultadoSimulador = {
  grupo: 1 | 2
  atestado: boolean
  psicotecnico: boolean
  exame: 'nenhum' | 'especial' | 'nova'
  motivos: string[]
  proxima: string
}

export function simular(r: RespostasSimulador): ResultadoSimulador {
  const grupo2 = r.pesados || r.profissional
  const motivos: string[] = []

  let atestado: boolean
  if (grupo2) {
    atestado = true
    motivos.push(
      r.pesados
        ? 'Tens categorias de pesados (Grupo 2): o atestado médico é obrigatório em todas as revalidações.'
        : 'Conduzes profissionalmente com a carta B: aplicam-se as regras do Grupo 2 e o atestado médico é obrigatório.',
    )
  } else if (r.idade >= IDADE_ATESTADO_GRUPO1) {
    atestado = true
    motivos.push(`A partir dos ${IDADE_ATESTADO_GRUPO1} anos o atestado médico é obrigatório para revalidar a carta.`)
  } else {
    atestado = false
    motivos.push(`Até aos ${IDADE_ATESTADO_GRUPO1} anos, com carta de carro ou mota, não precisas de atestado médico.`)
  }

  const psicotecnico = grupo2 && r.idade >= IDADE_PSICO_GRUPO2
  if (psicotecnico) {
    motivos.push(`No Grupo 2, a partir dos ${IDADE_PSICO_GRUPO2} anos é obrigatória a avaliação psicológica (psicotécnico).`)
  }

  let exame: ResultadoSimulador['exame'] = 'nenhum'
  if (r.situacao === 'ate2') {
    motivos.push('A tua carta caducou há menos de 2 anos: ainda podes revalidar sem exame. Não conduzas até estar renovada.')
  } else if (r.situacao === 'de2a5') {
    exame = 'especial'
    motivos.push('A tua carta caducou há mais de 2 anos: para a revalidar tens de fazer um exame especial de condução.')
  } else if (r.situacao === 'mais5') {
    exame = 'nova'
    motivos.push('Cartas caducadas há mais de 5 anos são, em regra, canceladas. Fala connosco para vermos o teu caso.')
  }

  return { grupo: grupo2 ? 2 : 1, atestado, psicotecnico, exame, motivos, proxima: proximaRevalidacao(r.idade, grupo2) }
}

function proximaRevalidacao(idade: number, grupo2: boolean) {
  if (grupo2) return idade < 65 ? 'De 5 em 5 anos (a partir dos 65, de 2 em 2 anos).' : 'De 2 em 2 anos.'
  const seguinte = REVALIDACOES_GRUPO1.find((i) => i > idade)
  return seguinte ? `Aos ${seguinte} anos.` : 'De 2 em 2 anos.'
}
