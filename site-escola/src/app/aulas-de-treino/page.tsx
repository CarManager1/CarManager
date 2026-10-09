import type { Metadata } from 'next'
import Image from 'next/image'
import { Check, ChevronsRight } from 'lucide-react'
import { TituloPagina } from '@/components/Blocos'
import { linkWhatsApp } from '@/components/whatsapp'

export const metadata: Metadata = {
  title: 'Aulas de treino',
  description: 'Aulas de treino para quem já tem carta: pacotes de 1, 5 ou 10 lições, junto ao Metro Areeiro.',
}

const PACOTES = ['1 lição', '5 lições', '10 lições']
const PONTOS = ['Para quem já tem carta', 'Horários à tua medida', 'Um instrutor sempre ao teu lado']

export default function AulasDeTreino() {
  return (
    <>
      <TituloPagina etiqueta="Encartados" titulo="Aulas de treino" />

      <section className="py-16 sm:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div aria-hidden className="absolute -inset-3 bg-lima -rotate-2 rounded-3xl" />
            <Image
              src="/escola/carro-traseira.jpg"
              alt="Carro da S. Cristóvão"
              width={1080}
              height={718}
              className="relative w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>

          <div>
            <h2 className="font-display uppercase text-5xl sm:text-6xl leading-[1.1]">
              <span className="block w-fit -rotate-2 bg-azul px-3 text-white">Volta à estrada</span>
              <span className="block w-fit -rotate-2 bg-lima px-3 mt-1">com confiança</span>
            </h2>

            <ul className="mt-8 space-y-3">
              {PONTOS.map((p) => (
                <li key={p} className="flex items-center gap-3 text-lg font-semibold">
                  <Check size={20} className="text-azul shrink-0" /> {p}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {PACOTES.map((p, i) => (
                <div key={p} className={`rounded-2xl p-4 text-center ${i === 2 ? 'bg-noite text-lima' : 'bg-zinc-100 text-azul-escuro'}`}>
                  <p className="font-display uppercase text-4xl leading-none">{p.split(' ')[0]}</p>
                  <p className={`mt-1 text-sm font-bold ${i === 2 ? 'text-white/70' : 'text-zinc-600'}`}>{p.split(' ')[1]}</p>
                </div>
              ))}
            </div>

            <a
              href={linkWhatsApp('Olá! Quero marcar aulas de treino.')}
              target="_blank"
              rel="noopener"
              className="mt-10 inline-flex -skew-x-12 items-center bg-lima px-7 py-3.5 text-noite shadow-[5px_5px_0_0_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition"
            >
              <span className="skew-x-12 flex items-center gap-2 font-display text-2xl uppercase">
                Marcar aulas <ChevronsRight size={24} />
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
