'use server'

import { put, list, del } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { timingSafeEqual } from 'node:crypto'
import { armazenamentoAtivo, mesesVisiveis } from '@/lib/horarios'

export type Estado = { ok: boolean; mensagem: string } | null

const TAMANHO_MAXIMO = 4 * 1024 * 1024 // 4 MB (limite da Vercel para envios)
const TIPOS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
}

function senhaCorreta(senha: string) {
  const certa = process.env.ADMIN_PASSWORD
  if (!certa) return false
  const a = Buffer.from(senha)
  const b = Buffer.from(certa)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function enviarHorario(_anterior: Estado, dados: FormData): Promise<Estado> {
  if (!armazenamentoAtivo()) {
    return { ok: false, mensagem: 'O armazenamento ainda não está ligado na Vercel (Storage → Blob).' }
  }
  if (!process.env.ADMIN_PASSWORD) {
    return { ok: false, mensagem: 'Falta definir a variável ADMIN_PASSWORD na Vercel.' }
  }
  if (!senhaCorreta(String(dados.get('senha') ?? ''))) {
    return { ok: false, mensagem: 'Palavra-passe errada.' }
  }

  const chave = String(dados.get('mes') ?? '')
  const permitidos = mesesVisiveis().map((m) => m.chave)
  if (!permitidos.includes(chave)) {
    return { ok: false, mensagem: 'Mês inválido. Atualiza a página e tenta de novo.' }
  }

  const ficheiro = dados.get('ficheiro')
  if (!(ficheiro instanceof File) || ficheiro.size === 0) {
    return { ok: false, mensagem: 'Escolhe um ficheiro.' }
  }
  const extensao = TIPOS[ficheiro.type]
  if (!extensao) {
    return { ok: false, mensagem: 'Só são aceites imagens (JPG, PNG, WEBP) ou PDF.' }
  }
  if (ficheiro.size > TAMANHO_MAXIMO) {
    return { ok: false, mensagem: 'O ficheiro tem mais de 4 MB. Reduz o tamanho e tenta de novo.' }
  }

  try {
    // Guarda o novo horário e apaga os anteriores do mesmo mês
    const novo = await put(`horarios/${chave}.${extensao}`, ficheiro, {
      access: 'public',
      addRandomSuffix: true,
      contentType: ficheiro.type,
    })
    const { blobs } = await list({ prefix: `horarios/${chave}` })
    const antigos = blobs.filter((b) => b.url !== novo.url).map((b) => b.url)
    if (antigos.length) await del(antigos)
  } catch (erro) {
    console.error('Erro ao enviar horário:', erro)
    return { ok: false, mensagem: 'Não foi possível guardar o ficheiro. Tenta de novo.' }
  }

  revalidatePath('/horarios')
  return { ok: true, mensagem: 'Horário publicado! Já aparece na página Horários.' }
}
