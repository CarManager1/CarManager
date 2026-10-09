'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, FileText } from 'lucide-react'

// Os horários mensais são PDFs guardados em public/horarios com o nome AAAA-MM.pdf
// (por exemplo public/horarios/2026-10.pdf para outubro de 2026).
// A página mostra sempre o mês atual e o mês seguinte.

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

type Mes = { chave: string; nome: string; existe: boolean | null }

function mesesVisiveis(): Mes[] {
  const partes = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon', year: 'numeric', month: '2-digit' }).formatToParts(new Date())
  const ano = Number(partes.find((p) => p.type === 'year')!.value)
  const mes = Number(partes.find((p) => p.type === 'month')!.value)
  return [
    [ano, mes],
    mes === 12 ? [ano + 1, 1] : [ano, mes + 1],
  ].map(([a, m]) => ({ chave: `${a}-${String(m).padStart(2, '0')}`, nome: `${MESES[m - 1]} ${a}`, existe: null }))
}

export function HorarioMensal() {
  const [meses, setMeses] = useState<Mes[]>([])

  useEffect(() => {
    const lista = mesesVisiveis()
    setMeses(lista)
    lista.forEach((m, i) => {
      fetch(`/horarios/${m.chave}.pdf`, { method: 'HEAD', cache: 'no-store' })
        .then((r) => r.ok)
        .catch(() => false)
        .then((existe) => setMeses((atual) => atual.map((x, j) => (j === i ? { ...x, existe } : x))))
    })
  }, [])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {meses.map((m, i) => (
        <article key={m.chave} className="rounded-3xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
          <header className={`px-6 py-4 flex items-center gap-3 ${i === 0 ? 'bg-azul text-white' : 'bg-zinc-100'}`}>
            <CalendarDays size={20} />
            <h3 className="font-extrabold text-lg">{m.nome}</h3>
            <span className={`ml-auto text-xs font-bold rounded-full px-3 py-1 ${i === 0 ? 'bg-white/20' : 'bg-white text-zinc-600'}`}>
              {i === 0 ? 'Este mês' : 'Próximo mês'}
            </span>
          </header>
          <div className="p-4">
            {m.existe ? (
              <a
                href={`/horarios/${m.chave}.pdf`}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-center gap-3 py-14 rounded-2xl bg-zinc-50 font-bold text-azul-escuro hover:bg-zinc-100 transition"
              >
                <FileText size={28} /> Ver horário (PDF)
              </a>
            ) : (
              <p className="py-14 text-center text-zinc-400 font-semibold">
                {m.existe === null ? 'A carregar…' : 'Horário disponível em breve'}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
