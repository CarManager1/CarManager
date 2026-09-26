import type { Metadata } from 'next'
import { CreditCard, Car, Bike, Dumbbell } from 'lucide-react'
import { TituloPagina, Etiqueta, CartoesPlanos, ChamadaInscricao } from '@/components/Blocos'

export const metadata: Metadata = {
  title: 'Planos e preços',
  description: 'Carta normal, Carta em 3 meses e aulas para encartados. Pagamento até 10x sem juros.',
}

const PAGAMENTOS = [
  { icone: Car, titulo: 'Ligeiros', opcoes: ['Pronto pagamento', '2x', '4x', '10x'] },
  { icone: Bike, titulo: 'Motociclos', opcoes: ['Pronto pagamento', '2x', '4x', '6x'] },
  { icone: Dumbbell, titulo: 'Aulas de treino', opcoes: ['1 aula', '5 aulas', '8 aulas', '10 aulas'] },
]

export default function Planos() {
  return (
    <>
      <TituloPagina
        etiqueta="Planos"
        titulo="O teu ritmo, a tua carta"
        texto="Escolhe o plano que te dá mais jeito. Pede o precário atualizado na secretaria ou pelo WhatsApp."
      />

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <CartoesPlanos />
        </div>
      </section>

      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Etiqueta>Facilidades de pagamento</Etiqueta>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <CreditCard className="text-sky-600" /> Paga como te der mais jeito
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {PAGAMENTOS.map(({ icone: I, titulo, opcoes }) => (
              <div key={titulo} className="bg-white rounded-3xl p-6 border border-zinc-100">
                <div className="flex items-center gap-3">
                  <span className="grid place-items-center size-11 rounded-2xl bg-sky-600 text-white"><I size={22} /></span>
                  <h3 className="text-xl font-black">{titulo}</h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {opcoes.map((o) => (
                    <span key={o} className="px-4 py-2 rounded-full border-2 border-sky-200 font-bold text-sm">{o}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-500">Prestações sem juros. Os valores são indicados no precário da escola.</p>
        </div>
      </section>

      <ChamadaInscricao />
    </>
  )
}
