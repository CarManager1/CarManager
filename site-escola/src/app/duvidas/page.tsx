import type { Metadata } from 'next'
import Link from 'next/link'
import { DUVIDAS } from '@/lib/dados'
import { TituloPagina } from '@/components/Blocos'

export const metadata: Metadata = {
  title: 'Dúvidas frequentes',
  description: 'Documentos, pagamentos, exames e renovação: respostas às perguntas mais comuns.',
}

export default function Duvidas() {
  return (
    <>
      <TituloPagina etiqueta="Dúvidas frequentes" titulo="Perguntas e respostas" texto="Não encontras a resposta? Fala connosco." />

      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
          {DUVIDAS.map((g) => (
            <div key={g.grupo}>
              <h2 className="text-2xl font-black">{g.grupo}</h2>
              <div className="mt-5 space-y-3">
                {g.perguntas.map(([p, r]) => (
                  <details key={p} className="group bg-zinc-50 rounded-2xl border border-zinc-100 p-5 open:bg-white open:shadow-md transition">
                    <summary className="flex items-center justify-between cursor-pointer list-none font-black">
                      {p}
                      <span className="ml-4 grid place-items-center size-8 rounded-full bg-[#C8F31D] shrink-0 group-open:rotate-45 transition text-lg">+</span>
                    </summary>
                    <p className="mt-3 text-zinc-600">{r}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-3xl bg-sky-600 text-white p-8 text-center">
            <p className="text-2xl font-black">Ainda tens dúvidas?</p>
            <p className="mt-2 text-sky-100">Fala connosco pelo WhatsApp, por telefone ou na escola.</p>
            <Link href="/contactos" className="mt-6 inline-block bg-[#C8F31D] text-zinc-900 px-7 py-3 rounded-full font-black">
              Contactar a escola
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
