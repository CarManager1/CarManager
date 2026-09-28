import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

// Faixas diagonais azul/lima, inspiradas na decoração dos carros da escola
export function Riscas({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -top-10 -right-24 w-[520px] h-16 bg-sky-500 rounded-full -rotate-[35deg] opacity-90" />
      <div className="absolute top-24 -right-40 w-[520px] h-10 bg-[#C8F31D] rounded-full -rotate-[35deg]" />
    </div>
  )
}

// Converte "texto **negrito** texto" em JSX
export function Negrito({ texto }: { texto: string }) {
  return <>{texto.split('**').map((parte, i) => (i % 2 ? <strong key={i}>{parte}</strong> : parte))}</>
}

// Faixa de título no topo de cada página interior
export function TituloPagina({ etiqueta, titulo, texto }: { etiqueta: string; titulo: string; texto?: string }) {
  return (
    <header className="relative bg-zinc-900 text-white overflow-hidden">
      <Riscas className="opacity-60 hidden md:block" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <p className="text-[#C8F31D] font-black uppercase tracking-wider text-sm">{etiqueta}</p>
        <h1 className="mt-2 text-4xl sm:text-6xl font-black tracking-tight max-w-3xl">{titulo}</h1>
        {texto && <p className="mt-5 text-lg text-zinc-300 max-w-2xl">{texto}</p>}
      </div>
    </header>
  )
}

export function Etiqueta({ children, clara = false }: { children: React.ReactNode; clara?: boolean }) {
  return <p className={`font-black uppercase tracking-wider text-sm ${clara ? 'text-[#C8F31D]' : 'text-sky-600'}`}>{children}</p>
}

// Faixa final "Inscreve-te" usada no fim das páginas
export function ChamadaInscricao() {
  return (
    <section className="px-4 sm:px-6 py-16">
      <div className="relative max-w-7xl mx-auto overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-600 to-sky-800 text-white px-6 sm:px-12 py-12 sm:py-16">
        <Riscas className="opacity-40 hidden md:block" />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Pronto para tirar a carta?</h2>
          <p className="mt-4 text-sky-100 text-lg">Inscreve-te hoje. Tratamos de tudo contigo, do código ao exame de condução.</p>
          <Link href="/contactos" className="mt-8 inline-flex items-center gap-2 bg-[#C8F31D] text-zinc-900 px-7 py-4 rounded-full font-black hover:brightness-95 transition">
            Inscreve-te já <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Os três cartões de serviços usados no Início
const SERVICOS = [
  {
    titulo: 'Carta de ligeiros',
    href: '/cartas/ligeiros',
    itens: ['Aulas de código **online ou presencial**', 'Exames em centros **privados ou públicos**', 'Pagamento até **10x sem juros**', '**Horários flexíveis** à tua medida'],
  },
  {
    titulo: 'Carta de motociclos',
    href: '/cartas/motociclos',
    destaque: true,
    itens: ['Categorias **A1, A2 e A**', 'Aulas com as **motas da escola**', 'Pagamento até **6x sem juros**', 'Aulas de código **online ou presencial**'],
  },
  {
    titulo: 'Aulas para encartados',
    href: '/precos',
    itens: ['**Aulas de treino** para melhorar a prática', '**Revalidação** da carta de condução', 'Pacotes de **1, 5, 8 ou 10 aulas**', 'Pagamentos **avulsos**'],
  },
]

export function CartoesServicos() {
  return (
    <div className="grid md:grid-cols-3 gap-6 items-stretch">
      {SERVICOS.map((p) => (
        <article
          key={p.titulo}
          className={`relative rounded-3xl p-8 border-2 border-zinc-900 shadow-[6px_6px_0_0_#18181b] flex flex-col ${
            p.destaque ? 'bg-gradient-to-b from-sky-500 to-sky-600 text-white' : 'bg-white'
          }`}
        >
          <h3 className="text-3xl sm:text-4xl font-medium tracking-tight leading-tight">{p.titulo}</h3>
          <ul className="mt-6 space-y-3 flex-1">
            {p.itens.map((i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <Sparkles size={16} className={`mt-0.5 shrink-0 ${p.destaque ? 'text-[#C8F31D]' : 'text-sky-500'}`} />
                <span><Negrito texto={i} /></span>
              </li>
            ))}
          </ul>
          <Link
            href={p.href}
            className={`mt-8 text-center py-3 rounded-full font-black transition ${
              p.destaque ? 'bg-[#C8F31D] text-zinc-900 hover:brightness-95' : 'bg-zinc-900 text-white hover:bg-zinc-700'
            }`}
          >
            Saber mais
          </Link>
        </article>
      ))}
    </div>
  )
}
