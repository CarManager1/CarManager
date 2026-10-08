import type { Metadata } from 'next'
import { Clock } from 'lucide-react'
import { HORARIO } from '@/lib/dados'
import { TituloPagina } from '@/components/Blocos'
import { HorarioMensal } from '@/components/HorarioMensal'

export const metadata: Metadata = {
  title: 'Horários',
  description: 'Horário da secretaria, das aulas de condução e horário mensal da Escola de Condução S. Cristóvão.',
}

export default function Horarios() {
  return (
    <>
      <TituloPagina etiqueta="Horários" titulo="Quando estamos abertos" />

      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Horário de funcionamento */}
          <div className="rounded-3xl bg-noite text-white p-6 sm:p-10 grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-center">
            <span className="grid place-items-center size-16 rounded-2xl bg-lima text-noite"><Clock size={30} /></span>
            <ul className="divide-y divide-white/10">
              {HORARIO.map((h) => (
                <li key={h.titulo} className="py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                  <span>
                    <span className="block font-bold text-lg">{h.titulo}</span>
                    {h.dias && <span className="block text-sm text-white/60">{h.dias}</span>}
                  </span>
                  <span className={`text-lg ${h.horas === 'Encerrado' ? 'text-white/50' : 'font-bold text-lima'}`}>{h.horas}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Horário mensal (PDFs em public/horarios) */}
          <h2 className="mt-16 text-3xl sm:text-4xl font-extrabold tracking-tight">Horário do mês</h2>
          <div className="mt-8">
            <HorarioMensal />
          </div>
        </div>
      </section>
    </>
  )
}
