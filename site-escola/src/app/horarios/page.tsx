import type { Metadata } from 'next'
import { Building2, BookOpen, Car, MonitorPlay, ArrowRight } from 'lucide-react'
import { HORARIOS, ENSINO_DISTANCIA } from '@/lib/dados'
import { TituloPagina, ChamadaInscricao } from '@/components/Blocos'

export const metadata: Metadata = {
  title: 'Horários',
  description: 'Horários da secretaria, das aulas de código e das aulas de condução da Escola de Condução S. Cristóvão.',
}

const BLOCOS = [
  { icone: Building2, titulo: 'Secretaria', texto: 'Inscrições, pagamentos e informações.', linhas: HORARIOS.secretaria },
  { icone: BookOpen, titulo: 'Aulas de código', texto: 'Aulas teóricas presenciais na escola.', linhas: HORARIOS.codigo },
  { icone: Car, titulo: 'Aulas de condução', texto: 'Marcadas contigo, à tua medida.', linhas: HORARIOS.conducao },
]

export default function Horarios() {
  return (
    <>
      <TituloPagina etiqueta="Horários" titulo="Quando estamos abertos" texto="Horários da secretaria e das aulas. As aulas práticas são marcadas contigo." />

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-6">
          {BLOCOS.map(({ icone: I, titulo, texto, linhas }) => (
            <article key={titulo} className="rounded-3xl bg-zinc-50 p-6 sm:p-8">
              <span className="grid place-items-center size-12 rounded-2xl bg-sky-600 text-white"><I size={24} /></span>
              <h2 className="mt-5 text-2xl font-black">{titulo}</h2>
              <p className="text-sm text-zinc-500">{texto}</p>
              <ul className="mt-6 divide-y divide-zinc-200">
                {linhas.map((h, i) => (
                  <li key={i} className="py-3 flex flex-wrap justify-between gap-x-4 gap-y-1">
                    <span className="font-bold">{h.dias}</span>
                    <span className={h.horas === 'Encerrado' ? 'text-zinc-400' : 'text-sky-700 font-bold'}>{h.horas}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
          <a
            href={ENSINO_DISTANCIA}
            target="_blank"
            rel="noopener"
            className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-3xl bg-zinc-900 text-white p-6 sm:p-8"
          >
            <span className="grid place-items-center size-14 rounded-2xl bg-lima text-zinc-900 shrink-0"><MonitorPlay size={26} /></span>
            <span className="flex-1">
              <span className="block text-xl font-black">Código à distância, a qualquer hora</span>
              <span className="block text-zinc-400">Na plataforma de ensino à distância estudas o código quando quiseres.</span>
            </span>
            <span className="inline-flex items-center gap-2 font-black text-lima">Entrar <ArrowRight size={18} className="group-hover:translate-x-1 transition" /></span>
          </a>
        </div>
      </section>

      <ChamadaInscricao />
    </>
  )
}
