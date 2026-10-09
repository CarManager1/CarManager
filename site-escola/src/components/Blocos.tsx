import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// As três faixas do logótipo (verde, azul e amarela)
export function Riscas({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -top-6 right-[8%] w-72 h-12 bg-azul rounded-full -rotate-[35deg]" />
      <div className="absolute top-20 -right-16 w-80 h-10 bg-verde rounded-full -rotate-[35deg]" />
      <div className="absolute bottom-6 right-[22%] w-56 h-8 bg-amarelo rounded-full -rotate-3" />
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
    <header className="relative bg-noite text-white overflow-hidden">
      <Riscas className="opacity-70 hidden md:block" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <p className="text-lima font-black uppercase tracking-wider text-sm">{etiqueta}</p>
        <h1 className="mt-2 font-display text-5xl sm:text-7xl font-extrabold tracking-tight max-w-3xl">{titulo}</h1>
        {texto && <p className="mt-5 text-lg text-zinc-300 max-w-2xl">{texto}</p>}
      </div>
    </header>
  )
}

export function Etiqueta({ children, clara = false }: { children: React.ReactNode; clara?: boolean }) {
  return <p className={`font-black uppercase tracking-wider text-sm ${clara ? 'text-lima' : 'text-sky-600'}`}>{children}</p>
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
          <Link href="/contactos" className="mt-8 inline-flex items-center gap-2 bg-lima text-zinc-900 px-7 py-4 rounded-full font-black hover:brightness-95 transition">
            Inscreve-te já <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
