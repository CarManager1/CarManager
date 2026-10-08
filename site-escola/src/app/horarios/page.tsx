import type { Metadata } from 'next'
import { Clock, FileText, CalendarDays } from 'lucide-react'
import { HORARIO } from '@/lib/dados'
import { mesesVisiveis, obterHorarios } from '@/lib/horarios'
import { TituloPagina } from '@/components/Blocos'

export const metadata: Metadata = {
  title: 'Horários',
  description: 'Horário de funcionamento e horários mensais da Escola de Condução S. Cristóvão.',
}

// Volta a verificar os horários de hora a hora (e logo que um novo é publicado)
export const revalidate = 3600

export default async function Horarios() {
  const meses = mesesVisiveis()
  const horarios = await obterHorarios(meses)

  return (
    <>
      <TituloPagina etiqueta="Horários" titulo="Quando estamos abertos" />

      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Horário de funcionamento */}
          <div className="rounded-3xl bg-noite text-white p-6 sm:p-10 grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-center">
            <span className="grid place-items-center size-16 rounded-2xl bg-lima text-noite"><Clock size={30} /></span>
            <div>
              <p className="text-sm font-semibold text-white/60">Aulas de condução</p>
              <ul className="mt-3 divide-y divide-white/10">
                {HORARIO.map((h) => (
                  <li key={h.dias} className="py-3 flex flex-wrap justify-between gap-x-6 gap-y-1">
                    <span className="font-bold text-lg">{h.dias}</span>
                    <span className={`text-lg ${h.horas === 'Encerrado' ? 'text-white/50' : 'font-bold text-lima'}`}>{h.horas}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Horários mensais */}
          <h2 className="mt-16 text-3xl sm:text-4xl font-extrabold tracking-tight">Horário do mês</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {meses.map((m, i) => {
              const h = horarios[m.chave]
              return (
                <article key={m.chave} className="rounded-3xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
                  <header className={`px-6 py-4 flex items-center gap-3 ${i === 0 ? 'bg-azul text-white' : 'bg-zinc-100'}`}>
                    <CalendarDays size={20} />
                    <h3 className="font-extrabold text-lg">{m.nome}</h3>
                    <span className={`ml-auto text-xs font-bold rounded-full px-3 py-1 ${i === 0 ? 'bg-white/20' : 'bg-white text-zinc-600'}`}>
                      {i === 0 ? 'Este mês' : 'Próximo mês'}
                    </span>
                  </header>
                  <div className="p-4">
                    {h === null ? (
                      <p className="py-16 text-center text-zinc-400 font-semibold">Horário disponível em breve</p>
                    ) : h.tipo === 'imagem' ? (
                      <a href={h.url} target="_blank" rel="noopener" title="Abrir em tamanho grande">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={h.url} alt={`Horário de ${m.nome}`} className="w-full h-auto rounded-2xl" />
                      </a>
                    ) : (
                      <a
                        href={h.url}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center justify-center gap-3 py-16 rounded-2xl bg-zinc-50 font-bold text-azul-escuro hover:bg-zinc-100 transition"
                      >
                        <FileText size={28} /> Abrir horário (PDF)
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
