import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, CreditCard, FileText, MessageCircle } from 'lucide-react'
import { CATEGORIAS } from '@/lib/dados'
import { TituloPagina, Etiqueta, ChamadaInscricao } from '@/components/Blocos'
import { linkWhatsApp } from '@/components/whatsapp'

type Props = { params: Promise<{ id: string }> }

// Gera uma página para cada carta definida em dados.ts
export function generateStaticParams() {
  return CATEGORIAS.map((c) => ({ id: c.id }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const c = CATEGORIAS.find((x) => x.id === id)
  return c ? { title: `Carta de ${c.titulo} (${c.sigla})`, description: c.resumo } : {}
}

const ETAPAS = ['Inscrição na escola', 'Aulas e exame de código', 'Aulas de condução', 'Exame de condução', 'Carta na mão 🎉']

export default async function Carta({ params }: Props) {
  const { id } = await params
  const c = CATEGORIAS.find((x) => x.id === id)
  if (!c) notFound()

  const formacao = c.id === 'profissionais' || c.id === 'tvde'

  return (
    <>
      <TituloPagina etiqueta={c.sigla} titulo={formacao ? `Formação ${c.titulo}` : `Carta de ${c.titulo}`} texto={c.resumo} />

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Link href="/cartas" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-sky-600">
              <ArrowLeft size={16} /> Todas as cartas
            </Link>
            <Image src={c.imagem.src} alt={c.titulo} width={c.imagem.w} height={c.imagem.h} className="mt-6 w-full h-72 sm:h-96 object-cover rounded-3xl" />
            <div className="mt-8 space-y-4 text-lg text-zinc-700">
              {c.descricao.map((p) => <p key={p}>{p}</p>)}
            </div>

            <h2 className="mt-12 text-2xl sm:text-3xl font-black">O que inclui</h2>
            <ul className="mt-5 grid sm:grid-cols-2 gap-3">
              {c.destaques.map((d) => (
                <li key={d} className="flex items-start gap-3 bg-zinc-50 rounded-2xl p-4 font-bold">
                  <span className="grid place-items-center size-7 rounded-full bg-lima shrink-0"><Check size={16} /></span> {d}
                </li>
              ))}
            </ul>
            {c.destaques.some((d) => d.includes('*')) && (
              <p className="mt-3 text-xs text-zinc-500">*Válido apenas para 1 reprovação no exame de código ou condução.</p>
            )}

            {!formacao && (
              <>
                <h2 className="mt-12 text-2xl sm:text-3xl font-black">Como funciona</h2>
                <ol className="mt-6 grid sm:grid-cols-5 gap-3">
                  {ETAPAS.map((e, i) => (
                    <li key={e} className="bg-sky-50 rounded-2xl p-4">
                      <span className="text-3xl font-black text-sky-600">{i + 1}</span>
                      <p className="mt-2 text-sm font-bold">{e}</p>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 self-start">
            <div className="rounded-3xl border-2 border-zinc-900 shadow-[6px_6px_0_0_#18181b] p-6">
              <Etiqueta>Documentos</Etiqueta>
              <ul className="mt-4 space-y-2">
                {c.documentos.map((d) => (
                  <li key={d} className="flex items-start gap-2"><FileText size={18} className="text-sky-600 mt-0.5 shrink-0" /> {d}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-sky-600 text-white p-6">
              <Etiqueta clara>Pagamento</Etiqueta>
              <p className="mt-3 flex items-start gap-2 font-bold"><CreditCard size={18} className="mt-0.5 shrink-0" /> {c.pagamento}</p>
              <p className="mt-3 text-sm text-sky-100">Pede o precário atualizado na secretaria ou pelo WhatsApp.</p>
            </div>
            <a
              href={linkWhatsApp(`Olá! Gostava de saber mais sobre: ${formacao ? 'Formação' : 'Carta de'} ${c.titulo}.`)}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-2 bg-lima text-zinc-900 py-4 rounded-full font-black hover:brightness-95 transition"
            >
              <MessageCircle size={18} /> Pedir informações
            </a>
            <Link href="/contactos" className="flex items-center justify-center bg-zinc-900 text-white py-4 rounded-full font-black hover:bg-zinc-700 transition">
              Inscrever-me
            </Link>
          </aside>
        </div>
      </section>

      <ChamadaInscricao />
    </>
  )
}
