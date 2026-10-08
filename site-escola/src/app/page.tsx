import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, MonitorPlay, Clock, Phone, MessageCircle, Check } from 'lucide-react'
import { SERVICOS, OUTROS_SERVICOS, ENSINO_DISTANCIA, ESCOLA, HORARIO } from '@/lib/dados'
import { linkWhatsApp } from '@/components/whatsapp'

const GALERIA = [
  { src: '/escola/aluno-1.jpg', alt: 'Aluna aprovada ao lado do carro da escola' },
  { src: '/escola/carro-traseira.jpg', alt: 'Carro da escola' },
  { src: '/escola/aluno-2.jpg', alt: 'Aluna aprovada com a carta de condução' },
  { src: '/escola/placa.jpg', alt: 'Placa da escola de condução' },
]

export default function Inicio() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-noite text-white">
        <div aria-hidden className="absolute -top-40 -left-40 size-[36rem] rounded-full bg-azul/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-48 right-0 size-[32rem] rounded-full bg-verde/15 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80">
              <span className="size-2 rounded-full bg-lima" /> Inscrições abertas
            </p>
            <h1 className="mt-6 text-5xl sm:text-7xl font-extrabold tracking-tight leading-[0.95]">
              Contigo em todas as{' '}
              <span className="relative inline-block">
                <span className="relative z-10">estradas.</span>
                <span aria-hidden className="absolute left-0 right-0 bottom-1 sm:bottom-2 h-3 sm:h-4 bg-azul rounded-full -rotate-1" />
              </span>
            </h1>
            <p className="mt-7 text-lg sm:text-xl text-white/70 max-w-lg">
              Carta de carro e de mota, aulas de treino e renovação de carta.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link href="/contactos" className="inline-flex items-center justify-center gap-2 bg-lima text-noite px-7 py-4 rounded-full font-bold hover:brightness-95 transition">
                Inscreve-te <ArrowRight size={18} />
              </Link>
              <a href="#servicos" className="inline-flex items-center justify-center gap-2 border border-white/25 px-7 py-4 rounded-full font-bold hover:bg-white/10 transition">
                Ver serviços
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div aria-hidden className="hidden sm:block absolute -top-6 -left-6 w-48 h-10 bg-verde rounded-full -rotate-[35deg]" />
            <div aria-hidden className="hidden sm:block absolute top-10 -right-8 w-56 h-10 bg-azul rounded-full -rotate-[35deg]" />
            <div aria-hidden className="absolute -bottom-5 left-1/4 w-44 h-8 bg-amarelo rounded-full -rotate-3" />
            <div className="relative rounded-[2rem] overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <Image src="/escola/aluno-2.jpg" alt="Aluna aprovada ao lado do carro da escola" width={1080} height={718} priority className="w-full h-auto" />
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto rounded-2xl bg-white/95 text-noite px-5 py-3 shadow-xl">
                <p className="text-xs font-semibold text-zinc-500">S. Cristóvão</p>
                <p className="font-extrabold">Mais uma carta na mão 🎉</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SERVIÇOS ---------- */}
      <section id="servicos" className="py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Os nossos serviços</h2>

          <div className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {SERVICOS.map((s) => (
              <Link key={s.titulo} href="/contactos" className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl bg-noite">
                <Image
                  src={s.imagem}
                  alt={s.titulo}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noite via-noite/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white">
                  <span className="inline-block rounded-full bg-lima text-noite text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1">{s.sigla}</span>
                  <h3 className="mt-3 text-lg sm:text-2xl font-extrabold">{s.titulo}</h3>
                  <p className="mt-1 hidden sm:block text-sm text-white/70">{s.texto}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-3xl bg-zinc-50 p-6 sm:p-8">
            <p className="font-bold">Também tratamos de</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {OUTROS_SERVICOS.map((o) => (
                <li key={o} className="inline-flex items-center gap-2 rounded-full bg-white border border-zinc-200 px-4 py-2 text-sm font-semibold">
                  <Check size={14} className="text-azul" /> {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- ENSINO À DISTÂNCIA + HORÁRIO ---------- */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-5">
          <a href={ENSINO_DISTANCIA} target="_blank" rel="noopener" className="group relative overflow-hidden rounded-3xl bg-azul p-8 sm:p-10 min-h-72 flex flex-col justify-between text-white">
            <div aria-hidden className="absolute -right-10 -bottom-10 w-72 h-14 bg-azul-escuro rounded-full -rotate-[35deg]" />
            <span className="relative grid place-items-center size-14 rounded-2xl bg-white text-azul"><MonitorPlay size={26} /></span>
            <div className="relative">
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ensino à distância</h3>
              <p className="mt-2 text-white/80 max-w-sm">Estuda o código online, onde e quando quiseres.</p>
              <span className="mt-6 inline-flex items-center gap-2 font-bold group-hover:gap-3 transition-all">
                Entrar na plataforma <ArrowUpRight size={18} />
              </span>
            </div>
          </a>

          <Link href="/horarios" className="group relative overflow-hidden rounded-3xl bg-lima p-8 sm:p-10 min-h-72 flex flex-col justify-between">
            <div aria-hidden className="absolute -right-10 -bottom-10 w-72 h-14 bg-verde/60 rounded-full -rotate-[35deg]" />
            <span className="relative grid place-items-center size-14 rounded-2xl bg-noite text-lima"><Clock size={26} /></span>
            <div className="relative text-noite">
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Horários</h3>
              <p className="mt-2 text-noite/70">
                {HORARIO.map((h) => `${h.dias}: ${h.horas}`).join(' · ')}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-bold group-hover:gap-3 transition-all">
                Ver horário do mês <ArrowRight size={18} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ---------- GALERIA ---------- */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Os nossos alunos</h2>
            <Link href="/sobre-nos" className="hidden sm:inline-flex items-center gap-2 font-bold text-azul-escuro hover:gap-3 transition-all">
              Sobre nós <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory">
            {GALERIA.map((g, i) => (
              <div key={g.src} className={`relative shrink-0 w-[75%] sm:w-auto aspect-[3/4] snap-start overflow-hidden rounded-3xl ${i % 2 ? 'sm:mt-10' : ''}`}>
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 640px) 25vw, 75vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CHAMADA FINAL ---------- */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-[2.5rem] bg-noite text-white px-6 sm:px-14 py-14 sm:py-20">
          <div aria-hidden className="absolute -top-8 right-10 w-72 h-12 bg-azul rounded-full -rotate-[35deg]" />
          <div aria-hidden className="absolute top-16 -right-10 w-72 h-10 bg-verde rounded-full -rotate-[35deg]" />
          <div aria-hidden className="absolute bottom-8 right-1/4 w-48 h-8 bg-amarelo rounded-full -rotate-3 hidden sm:block" />
          <div className="relative max-w-xl">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Pronto para começar?</h2>
            <p className="mt-4 text-lg text-white/70">Fala connosco. Tratamos de tudo, do código ao exame.</p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <a
                href={linkWhatsApp('Olá! Gostava de mais informações sobre a carta de condução.')}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 bg-lima text-noite px-7 py-4 rounded-full font-bold hover:brightness-95 transition"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
              {ESCOLA.telefones.map((t) => (
                <a key={t.link} href={`tel:${t.link}`} className="inline-flex items-center justify-center gap-2 border border-white/25 px-6 py-4 rounded-full font-bold hover:bg-white/10 transition">
                  <Phone size={18} /> {t.texto}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
