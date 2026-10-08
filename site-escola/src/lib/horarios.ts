import { list } from '@vercel/blob'

// Os horários mensais ficam guardados no Vercel Blob em "horarios/AAAA-MM-...".
// O site mostra sempre o do mês atual e o do mês seguinte.

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export type Mes = { chave: string; nome: string }
export type HorarioMensal = { url: string; tipo: 'imagem' | 'pdf'; enviadoEm: string }

// Mês atual e seguinte, na hora de Lisboa
export function mesesVisiveis(agora = new Date()): [Mes, Mes] {
  const partes = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon', year: 'numeric', month: '2-digit' }).formatToParts(agora)
  const ano = Number(partes.find((p) => p.type === 'year')!.value)
  const mes = Number(partes.find((p) => p.type === 'month')!.value) // 1-12
  const seguinteAno = mes === 12 ? ano + 1 : ano
  const seguinteMes = mes === 12 ? 1 : mes + 1
  return [criarMes(ano, mes), criarMes(seguinteAno, seguinteMes)]
}

function criarMes(ano: number, mes: number): Mes {
  return { chave: `${ano}-${String(mes).padStart(2, '0')}`, nome: `${MESES[mes - 1]} ${ano}` }
}

export function armazenamentoAtivo() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

// Devolve o horário mais recente enviado para cada mês (ou null)
export async function obterHorarios(meses: Mes[]): Promise<Record<string, HorarioMensal | null>> {
  const resultado: Record<string, HorarioMensal | null> = Object.fromEntries(meses.map((m) => [m.chave, null]))
  if (!armazenamentoAtivo()) return resultado

  try {
    const { blobs } = await list({ prefix: 'horarios/' })
    for (const m of meses) {
      const doMes = blobs
        .filter((b) => b.pathname.startsWith(`horarios/${m.chave}`))
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]
      if (doMes) {
        resultado[m.chave] = {
          url: doMes.url,
          tipo: doMes.pathname.toLowerCase().endsWith('.pdf') ? 'pdf' : 'imagem',
          enviadoEm: new Date(doMes.uploadedAt).toISOString(),
        }
      }
    }
  } catch (erro) {
    console.error('Não foi possível ler os horários:', erro)
  }
  return resultado
}
