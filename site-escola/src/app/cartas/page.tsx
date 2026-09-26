import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { CATEGORIAS } from '@/lib/dados'
import { TituloPagina, ChamadaInscricao } from '@/components/Blocos'
import { iconeDe } from '@/components/icones'

export const metadata: Metadata = {
  title: 'Cartas',
  description: 'Carta de ligeiros, motociclos (A1, A2, A), formação CAM, TCC e TVDE na Escola de Condução S. Cristóvão.',
}

export default function Cartas() {
  return (
    <>
      <TituloPagina
        etiqueta="Cartas e formações"
        titulo="Escolhe a tua carta"
        texto="Do carro à mota, e da formação profissional ao TVDE: tudo na mesma escola."
      />

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {CATEGORIAS.map((c, i) => {
            const Icone = iconeDe(c.id)
            return (
              <article key={c.id} className="grid lg:grid-cols-2 gap-8 items-center bg-zinc-50 rounded-[2rem] p-6 sm:p-8">
                <Image
                  src={c.imagem.src}
                  alt={`Carta de ${c.titulo}`}
                  width={c.imagem.w}
                  height={c.imagem.h}
                  className={`w-full h-64 sm:h-80 object-cover rounded-3xl ${i % 2 ? 'lg:order-2' : ''}`}
                />
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center size-12 rounded-2xl bg-sky-600 text-white"><Icone size={24} /></span>
                    <span className="text-xs font-black bg-[#C8F31D] px-3 py-1 rounded-full">{c.sigla}</span>
                  </div>
                  <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">{c.titulo}</h2>
                  <p className="mt-3 text-zinc-600">{c.resumo}</p>
                  <ul className="mt-5 grid sm:grid-cols-2 gap-2">
                    {c.destaques.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm font-bold">
                        <Check size={16} className="text-sky-600 mt-0.5 shrink-0" /> {d}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/cartas/${c.id}`} className="mt-6 inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full font-black hover:bg-zinc-700 transition">
                    Saber mais <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <ChamadaInscricao />
    </>
  )
}
