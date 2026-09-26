import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight, Sparkles, Clock, CreditCard, ShieldCheck, Zap, BookOpen,
} from 'lucide-react'
import { CATEGORIAS } from '@/lib/dados'
import { Riscas, Etiqueta, CartoesPlanos, ChamadaInscricao } from '@/components/Blocos'
import { iconeDe } from '@/components/icones'

const VANTAGENS = [
  { icone: Zap, titulo: 'Exames no privado', texto: 'Sem tempos de espera no plano Carta em 3 meses.' },
  { icone: CreditCard, titulo: 'Até 10x sem juros', texto: 'Paga a tua carta às prestações, sem complicações.' },
  { icone: Clock, titulo: 'Horários flexíveis', texto: 'Marcamos as aulas à tua medida.' },
  { icone: ShieldCheck, titulo: 'Reprovas? Não pagas*', texto: 'Válido para 1 reprovação no código ou condução.' },
]

export default function Inicio() {
  return (
    <>
      {/* --- HERO --- */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <Riscas className="opacity-80 hidden lg:block" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-zinc-900 text-[#C8F31D] text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full">
              <Sparkles size={14} /> Carta em 3 meses
            </span>
            <h1 className="mt-6 text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
              Contigo em <span className="text-sky-600">todas</span> as estradas.
            </h1>
            <p className="mt-6 text-lg text-zinc-600 max-w-xl">
              Na Escola de Condução S. Cristóvão tiras a carta de carro ou de mota com instrutores experientes,
              horários à tua medida e exames no privado, sem esperas.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/contactos" className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-7 py-4 rounded-full font-black transition">
                Inscreve-te já <ArrowRight size={18} />
              </Link>
              <Link href="/planos" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-zinc-900 px-7 py-4 rounded-full font-black hover:bg-zinc-50 transition">
                Ver planos
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-sky-500 to-[#C8F31D] rounded-[2.5rem] rotate-2" />
            <Image src="/escola/carro-arte.jpg" alt="Carro da Escola de Condução S. Cristóvão" width={699} height={466} priority className="relative w-full h-auto rounded-[2rem] shadow-2xl" />
          </div>
        </div>
      </section>

      {/* --- VANTAGENS --- */}
      <section className="bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VANTAGENS.map(({ icone: I, titulo, texto }) => (
            <div key={titulo} className="flex gap-4">
              <span className="grid place-items-center size-12 rounded-2xl bg-[#C8F31D] text-zinc-900 shrink-0"><I size={22} /></span>
              <div>
                <p className="font-black">{titulo}</p>
                <p className="text-sm text-zinc-400 mt-1">{texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CARTAS --- */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Etiqueta>O que ensinamos</Etiqueta>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">Escolhe a tua carta</h2>
            </div>
            <Link href="/cartas" className="inline-flex items-center gap-2 font-black text-sky-700 hover:underline">
              Ver todas as cartas <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIAS.map((c) => {
              const Icone = iconeDe(c.id)
              return (
                <Link
                  key={c.id}
                  href={`/cartas/${c.id}`}
                  className="group bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid place-items-center size-12 rounded-2xl bg-sky-600 text-white"><Icone size={24} /></span>
                    <span className="text-xs font-black bg-[#C8F31D] px-3 py-1 rounded-full">{c.sigla}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-black">{c.titulo}</h3>
                  <p className="mt-2 text-sm text-zinc-600 flex-1">{c.resumo}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-black text-sky-700 group-hover:gap-2 transition-all">
                    Saber mais <ArrowRight size={16} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- PLANOS --- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <Etiqueta>Planos</Etiqueta>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">O teu ritmo, a tua carta</h2>
          </div>
          <div className="mt-12"><CartoesPlanos /></div>
        </div>
      </section>

      {/* --- RENOVAÇÃO + LIVRO --- */}
      <section className="pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-6">
          <Link href="/renovacao" className="group relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-8 flex flex-col justify-end min-h-80">
            <Image src="/escola/renovacao.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-40 group-hover:opacity-50 transition" />
            <div className="relative">
              <Etiqueta clara>Serviço rápido</Etiqueta>
              <h3 className="mt-2 text-3xl font-black">Renovação de carta na hora</h3>
              <span className="mt-4 inline-flex items-center gap-2 font-black text-[#C8F31D]">Saber mais <ArrowRight size={18} /></span>
            </div>
          </Link>
          <Link href="/a-escola" className="group relative overflow-hidden rounded-3xl bg-sky-700 text-white p-8 flex flex-col justify-end min-h-80">
            <Image src="/escola/livro-verso.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top opacity-40 group-hover:opacity-50 transition" />
            <div className="relative">
              <Etiqueta clara>A Escola</Etiqueta>
              <h3 className="mt-2 text-3xl font-black flex items-center gap-3"><BookOpen /> Livro de código próprio</h3>
              <span className="mt-4 inline-flex items-center gap-2 font-black text-[#C8F31D]">Conhecer a escola <ArrowRight size={18} /></span>
            </div>
          </Link>
        </div>
      </section>

      <ChamadaInscricao />
    </>
  )
}
