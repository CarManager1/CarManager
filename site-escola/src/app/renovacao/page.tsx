import type { Metadata } from 'next'
import Image from 'next/image'
import { Clock, RefreshCw, Stethoscope } from 'lucide-react'
import { TituloPagina, Etiqueta, ChamadaInscricao } from '@/components/Blocos'
import { SimuladorRenovacao } from '@/components/SimuladorRenovacao'

export const metadata: Metadata = {
  title: 'Renovação de carta',
  description:
    'Simulador de renovação da carta de condução: descobre se precisas de atestado médico ou psicotécnico, vê o preço e agenda o atestado.',
}

const SERVICOS = [
  { icone: Clock, titulo: 'Renovação na hora', texto: 'Tratamos da renovação da tua carta de condução, sem filas nem complicações.' },
  { icone: Stethoscope, titulo: 'Atestado médico', texto: 'Ajudamos-te a marcar o atestado médico e a avaliação psicológica.' },
  { icone: RefreshCw, titulo: 'Revalidação', texto: 'A tua carta já caducou? Vemos contigo o que é preciso para a revalidar.' },
]

export default function Renovacao() {
  return (
    <>
      <TituloPagina
        etiqueta="Renovação de carta na hora"
        titulo="O que precisas para renovar a carta?"
        texto="Responde a 3 ou 4 perguntas e fica a saber se precisas de atestado médico, de psicotécnico ou de exame, e quanto custa."
      />

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Etiqueta>Simulador</Etiqueta>
          <h2 className="mt-2 mb-10 text-3xl sm:text-4xl font-black tracking-tight">Simula a tua renovação</h2>
          <SimuladorRenovacao />
        </div>
      </section>

      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Image src="/escola/renovacao.jpg" alt="Renovação de carta na hora" width={674} height={449} className="w-full h-auto rounded-3xl shadow-xl" />
          <div className="grid gap-4">
            {SERVICOS.map(({ icone: I, titulo, texto }) => (
              <div key={titulo} className="flex gap-4 bg-white rounded-3xl p-5 border border-zinc-100">
                <span className="grid place-items-center size-12 rounded-2xl bg-sky-600 text-white shrink-0"><I size={22} /></span>
                <div>
                  <h3 className="text-lg font-black">{titulo}</h3>
                  <p className="text-zinc-600">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ChamadaInscricao />
    </>
  )
}
