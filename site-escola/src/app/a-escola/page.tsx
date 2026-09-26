import type { Metadata } from 'next'
import Image from 'next/image'
import { BookOpen, Users, Car } from 'lucide-react'
import { TituloPagina, Etiqueta, ChamadaInscricao } from '@/components/Blocos'

export const metadata: Metadata = {
  title: 'A Escola',
  description: 'Conhece a Escola de Condução S. Cristóvão: a nossa frota, o nosso livro de código e os nossos alunos.',
}

const GALERIA = [
  { src: '/escola/aluno-1.jpg', w: 1080, h: 720, alt: 'Aluna aprovada ao lado do carro da escola' },
  { src: '/escola/aluno-2.jpg', w: 1080, h: 718, alt: 'Aluna aprovada com a carta de condução' },
  { src: '/escola/carro-traseira.jpg', w: 1080, h: 718, alt: 'Carro da escola visto de trás' },
  { src: '/escola/montra.jpg', w: 699, h: 526, alt: 'Fachada da escola de condução', largo: true },
  { src: '/escola/placa.jpg', w: 778, h: 518, alt: 'Placa da escola de condução' },
]

export default function AEscola() {
  return (
    <>
      <TituloPagina etiqueta="A Escola" titulo="Contigo em todas as estradas" texto="Conhece a S. Cristóvão: a nossa equipa, os nossos carros e os nossos alunos." />

      {/* --- SOBRE --- */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Etiqueta>Quem somos</Etiqueta>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">Uma escola que te acompanha até teres a carta na mão</h2>
            <p className="mt-5 text-lg text-zinc-600">
              {/* PREENCHER: conte aqui a história da escola (desde quando existe, quem são os instrutores, etc.) */}
              Na S. Cristóvão ensinamos a conduzir com calma, segurança e horários à tua medida. Preparamos-te para o
              código e para a condução, e tratamos de tudo contigo até ao dia do exame.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {[
                { icone: Users, texto: 'Instrutores experientes' },
                { icone: Car, texto: 'Frota própria da escola' },
                { icone: BookOpen, texto: 'Livro de código próprio' },
              ].map(({ icone: I, texto }) => (
                <div key={texto} className="bg-zinc-50 rounded-2xl p-4">
                  <span className="grid place-items-center size-10 rounded-xl bg-[#C8F31D]"><I size={20} /></span>
                  <p className="mt-3 font-bold text-sm">{texto}</p>
                </div>
              ))}
            </div>
          </div>
          <Image src="/escola/montra.jpg" alt="Fachada da Escola de Condução S. Cristóvão" width={699} height={526} className="w-full h-auto rounded-3xl shadow-xl" />
        </div>
      </section>

      {/* --- LIVRO DE CÓDIGO --- */}
      <section className="py-16 sm:py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-5">
            <Image src="/escola/livro-codigo.jpg" alt="Capa do livro O Código da Estrada" width={370} height={546} className="w-full h-auto rounded-2xl shadow-xl -rotate-2" />
            <Image src="/escola/livro-verso.jpg" alt="Aluna com o livro de código" width={387} height={556} className="w-full h-auto rounded-2xl shadow-xl rotate-2 mt-8" />
          </div>
          <div>
            <Etiqueta>Material de estudo</Etiqueta>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">O Código da Estrada, à nossa maneira</h2>
            <p className="mt-5 text-lg text-zinc-600">
              A S. Cristóvão tem o seu próprio livro de código, para estudares a matéria e chegares ao exame com
              confiança. Aulas de código <strong>online ou presencial</strong>, como te der mais jeito.
            </p>
          </div>
        </div>
      </section>

      {/* --- GALERIA --- */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Etiqueta>Os nossos alunos</Etiqueta>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">Mais uma carta na mão 🎉</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GALERIA.map((g) => (
              <Image
                key={g.src}
                src={g.src}
                alt={g.alt}
                width={g.w}
                height={g.h}
                className={`w-full h-64 object-cover rounded-3xl ${g.largo ? 'lg:col-span-2' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      <ChamadaInscricao />
    </>
  )
}
