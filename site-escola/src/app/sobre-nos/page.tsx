import type { Metadata } from 'next'
import Image from 'next/image'
import { TituloPagina, ChamadaInscricao } from '@/components/Blocos'

export const metadata: Metadata = {
  title: 'Sobre nós',
  description: 'Conhece a Escola de Condução S. Cristóvão.',
}

const GALERIA = [
  { src: '/escola/aluno-1.jpg', w: 1080, h: 720, alt: 'Aluna aprovada ao lado do carro da escola' },
  { src: '/escola/carro-traseira.jpg', w: 1080, h: 718, alt: 'Carro da escola visto de trás' },
  { src: '/escola/placa.jpg', w: 778, h: 518, alt: 'Placa da escola de condução' },
]

export default function SobreNos() {
  return (
    <>
      <TituloPagina etiqueta="Sobre nós" titulo="Contigo em todas as estradas" />

      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Uma escola que te acompanha até teres a carta na mão</h2>
            {/* Pode trocar este texto pela história da escola */}
            <p className="mt-6 text-lg text-zinc-600">
              Na S. Cristóvão ensinamos a conduzir com calma e segurança. Tiramos-te a carta de carro ou de mota, damos
              aulas de treino a quem já tem carta e tratamos da renovação da tua carta.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image src="/escola/livro-codigo.jpg" alt="Livro de código da S. Cristóvão" width={370} height={546} className="w-full h-auto rounded-2xl shadow-xl -rotate-2" />
            <Image src="/escola/livro-verso.jpg" alt="Aluna com o livro de código" width={387} height={555} className="w-full h-auto rounded-2xl shadow-xl rotate-2 mt-8" />
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-4">
          {GALERIA.map((g) => (
            <Image key={g.src} src={g.src} alt={g.alt} width={g.w} height={g.h} className="w-full h-64 object-cover rounded-3xl" />
          ))}
        </div>
      </section>

      <ChamadaInscricao />
    </>
  )
}
