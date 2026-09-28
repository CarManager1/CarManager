import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Stethoscope } from 'lucide-react'
import { PRECOS_CURSOS, formatarPreco } from '@/lib/precos'
import { TituloPagina, ChamadaInscricao } from '@/components/Blocos'

export const metadata: Metadata = {
  title: 'Preços',
  description: 'Preços da carta de ligeiros, motociclos, exames, aulas de treino e renovação na Escola de Condução S. Cristóvão.',
}

export default function Precos() {
  return (
    <>
      <TituloPagina
        etiqueta="Preços"
        titulo="Preços transparentes"
        texto="Pagamento a pronto ou em prestações sem juros. Os valores podem mudar: confirma sempre na secretaria."
      />

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-6 items-start">
          {PRECOS_CURSOS.map((t, i) => (
            <article
              key={t.id}
              className="rounded-3xl border-2 border-zinc-900 shadow-[6px_6px_0_0_#18181b] overflow-hidden"
            >
              <header className={`p-6 ${i === 0 ? 'bg-sky-600 text-white' : i === 1 ? 'bg-[#C8F31D]' : 'bg-zinc-900 text-white'}`}>
                <h2 className="text-2xl font-black">{t.titulo}</h2>
                <p className={`text-sm font-bold ${i === 1 ? 'text-zinc-700' : 'opacity-80'}`}>{t.subtitulo}</p>
              </header>
              <div className="bg-white p-6 space-y-6">
                {t.grupos.map((g) => (
                  <div key={g.nome}>
                    <p className="font-black uppercase text-xs tracking-wider text-sky-700">{g.nome}</p>
                    {g.nota && <p className="text-xs text-zinc-500 mt-0.5">{g.nota}</p>}
                    <table className="mt-2 w-full text-sm">
                      <tbody>
                        {g.linhas.map(([d, v]) => (
                          <tr key={d} className="border-b border-zinc-100 last:border-0">
                            <td className="py-2 pr-3">{d}</td>
                            <td className={`py-2 text-right font-black whitespace-nowrap ${v === null ? 'text-zinc-400 font-bold' : ''}`}>
                              {formatarPreco(v)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
          <Link href="/renovacao" className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-3xl bg-sky-50 p-6">
            <span className="grid place-items-center size-14 rounded-2xl bg-sky-600 text-white shrink-0"><Stethoscope size={26} /></span>
            <span className="flex-1">
              <span className="block text-xl font-black">Vais renovar a carta?</span>
              <span className="block text-zinc-600">Usa o simulador para saberes se precisas de atestado médico ou psicotécnico, e o preço total.</span>
            </span>
            <span className="inline-flex items-center gap-2 font-black text-sky-700">Abrir simulador <ArrowRight size={18} className="group-hover:translate-x-1 transition" /></span>
          </Link>
          <p className="mt-6 text-sm text-zinc-500">
            Documentos necessários: Cartão de Cidadão e atestado médico. Para motociclos, se fores menor, também autorização
            paternal e assento de nascimento.
          </p>
        </div>
      </section>

      <ChamadaInscricao />
    </>
  )
}
