import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, FileCheck, RefreshCw, MessageCircle } from 'lucide-react'
import { TituloPagina, Etiqueta, ChamadaInscricao } from '@/components/Blocos'
import { linkWhatsApp } from '@/components/whatsapp'

export const metadata: Metadata = {
  title: 'Renovação de carta na hora',
  description: 'Renovação e revalidação da carta de condução na hora, na Escola de Condução S. Cristóvão.',
}

const SERVICOS = [
  { icone: Clock, titulo: 'Renovação na hora', texto: 'Tratamos da renovação da tua carta de condução, sem filas nem complicações.' },
  { icone: RefreshCw, titulo: 'Revalidação', texto: 'A tua carta já caducou? Ajudamos-te a revalidá-la.' },
  { icone: FileCheck, titulo: 'Aulas de treino', texto: 'Há muito tempo sem conduzir? Temos aulas para encartados.' },
]

export default function Renovacao() {
  return (
    <>
      <TituloPagina
        etiqueta="Serviço rápido"
        titulo="Renovação de carta na hora"
        texto="A tua carta está a caducar? Tratamos de tudo por ti."
      />

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Image src="/escola/renovacao.jpg" alt="Renovação de carta na hora" width={674} height={449} className="w-full h-auto rounded-3xl shadow-2xl" />
          <div>
            <Etiqueta>Como funciona</Etiqueta>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">Simples e rápido</h2>
            <ol className="mt-6 space-y-4">
              {[
                'Fala connosco pelo WhatsApp ou por telefone',
                'Dizemos-te que documentos precisas no teu caso',
                'Vens à escola e tratamos da renovação na hora',
              ].map((p, i) => (
                <li key={p} className="flex items-start gap-4">
                  <span className="grid place-items-center size-10 rounded-full bg-[#C8F31D] font-black shrink-0">{i + 1}</span>
                  <span className="text-lg pt-1.5">{p}</span>
                </li>
              ))}
            </ol>
            <a
              href={linkWhatsApp('Olá! Queria renovar a minha carta de condução. Que documentos preciso?')}
              target="_blank"
              rel="noopener"
              className="mt-8 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-7 py-4 rounded-full font-black transition"
            >
              <MessageCircle size={18} /> Marcar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-5">
          {SERVICOS.map(({ icone: I, titulo, texto }) => (
            <div key={titulo} className="bg-white rounded-3xl p-6 border border-zinc-100">
              <span className="grid place-items-center size-12 rounded-2xl bg-sky-600 text-white"><I size={22} /></span>
              <h3 className="mt-4 text-xl font-black">{titulo}</h3>
              <p className="mt-2 text-zinc-600">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <ChamadaInscricao />
    </>
  )
}
