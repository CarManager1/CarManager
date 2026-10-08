import type { Metadata } from 'next'
import Link from 'next/link'
import { mesesVisiveis, obterHorarios, armazenamentoAtivo } from '@/lib/horarios'
import { FormularioHorario } from './FormularioHorario'

export const metadata: Metadata = {
  title: 'Administração',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function Admin() {
  const meses = mesesVisiveis()
  const horarios = await obterHorarios(meses)
  const configurado = armazenamentoAtivo() && Boolean(process.env.ADMIN_PASSWORD)

  return (
    <section className="py-16 sm:py-24 bg-zinc-50 min-h-[70vh]">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Publicar horário</h1>
        <p className="mt-2 text-zinc-600">Carrega o horário do mês atual ou do mês seguinte. O novo ficheiro substitui o anterior.</p>

        {!configurado && (
          <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
            <p className="font-bold">Falta configurar na Vercel:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {!armazenamentoAtivo() && <li>Storage → Create → Blob, e ligar ao projeto</li>}
              {!process.env.ADMIN_PASSWORD && <li>Settings → Environment Variables → ADMIN_PASSWORD</li>}
            </ul>
          </div>
        )}

        <div className="mt-8 rounded-3xl bg-white border border-zinc-100 shadow-sm p-6 sm:p-8">
          <FormularioHorario meses={meses} />
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {meses.map((m) => {
            const h = horarios[m.chave]
            return (
              <div key={m.chave} className="rounded-2xl bg-white border border-zinc-100 p-5">
                <p className="font-bold">{m.nome}</p>
                {h ? (
                  <a href={h.url} target="_blank" rel="noopener" className="mt-1 inline-block text-sm font-semibold text-azul-escuro hover:underline">
                    Ver horário publicado
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-zinc-500">Ainda sem horário</p>
                )}
              </div>
            )
          })}
        </div>

        <Link href="/horarios" className="mt-8 inline-block text-sm font-bold text-azul-escuro hover:underline">
          Ver página Horários →
        </Link>
      </div>
    </section>
  )
}
