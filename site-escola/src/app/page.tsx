import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, MonitorPlay, Clock, Phone, MessageCircle, Check, Sparkles } from 'lucide-react'
import { SERVICOS, OUTROS_SERVICOS, ENSINO_DISTANCIA, ESCOLA, HORARIO, CARTA_3_MESES } from '@/lib/dados'
import { linkWhatsApp } from '@/components/whatsapp'

const FAIXA = ['Carta em 3 meses', 'Código online', 'Exames no privado', 'Até 10x sem juros', 'Carro e mota', 'Aulas de treino', 'Renovação de carta']

const GALERIA = [
  { src: '/escola/aluno-1.jpg', alt: 'Aluna aprovada ao lado do carro da escola' },
  { src: '/escola/carro-traseira.jpg', alt: 'Carro da escola' },
  { src: '/escola/aluno-2.jpg', alt: 'Aluna aprovada com a carta de condução' },
  { src: '/escola/placa.jpg', alt: 'Placa da escola de condução' },
]

// Selo redondo com texto a rodar e o "L" de aprendiz no centro
function SeloRodando({ className = '' }: { className?: string }) {
  return (
    <div className={`size-32 sm:size-36 ${className}`} aria-hidden>
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-roda">
        <defs>
          <path id="circulo" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="98" className="fill-lima" />
        <text className="fill-noite font-display" style={{ fontSize: 19, fontWeight: 800 }}>
          <textPath href="#circulo" textLength="486" lengthAdjust="spacing">
            CARTA EM 3 MESES ✦ CARTA EM 3 MESES ✦
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 m-auto grid place-items-center size-14 sm:size-16 rounded-lg bg-azul-escuro text-white font-display text-4xl font-extrabold ring-4 ring-white">
        L
      </span>
    </div>
  )
}

function Faixa({ className = '' }: { className?: string }) {
  const itens = [...FAIXA, ...FAIXA]
  return (
    <div className={`overflow-hidden whitespace-nowrap py-4 ${className}`}>
      <div className="flex w-max animate-faixa">
        {itens.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6 font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight">
            {t} <Sparkles size={20} className="shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Inicio() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-noite text-white">
        {/* fundo: brilhos de cor e grelha subtil */}
        <div aria-hidden className="absolute -top-48 -left-40 size-[42rem] rounded-full bg-azul/35 blur-3xl" />
        <div aria-hidden className="absolute -bottom-56 -right-32 size-[38rem] rounded-full bg-verde/20 blur-3xl" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-24 lg:pt-20 lg:pb-32 grid lg:grid-cols-12 gap-14 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/80 backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-lima opacity-75 animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-lima" />
              </span>
              Inscrições abertas
            </p>

            <h1 className="mt-7 font-display font-extrabold tracking-tight leading-[0.9] text-[3.4rem] sm:text-7xl xl:text-[5.6rem]">
              Tira a carta
              <br />
              em{' '}
              <span className="inline-block -rotate-2 rounded-2xl bg-lima px-3 sm:px-4 pb-1 text-noite shadow-[6px_6px_0_0_var(--color-azul)]">
                3 meses
              </span>
              <br />
              <span className="text-white/90">sem stress.</span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-white/70 max-w-xl">
              Curso intensivo com 6 aulas por semana, exames no privado e código à distância. Contigo em todas as
              estradas.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <a
                href={linkWhatsApp('Olá! Quero tirar a carta em 3 meses. Podem dar-me mais informações?')}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center justify-center gap-2 bg-lima text-noite px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_40px_-8px_var(--color-lima)] hover:scale-[1.03] transition"
              >
                Quero a minha carta <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </a>
              <a href="#servicos" className="inline-flex items-center justify-center gap-2 border border-white/25 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition">
                Ver serviços
              </a>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {['/escola/aluno-1.jpg', '/escola/aluno-2.jpg', '/escola/carro-traseira.jpg'].map((src) => (
                  <span key={src} className="relative size-11 rounded-full overflow-hidden ring-2 ring-noite">
                    <Image src={src} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/60">
                <span className="font-bold text-white">Carro, mota e aulas de treino</span>
                <br />
                tudo na mesma escola
              </p>
            </div>
          </div>

          {/* colagem de fotografias */}
          <div className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden className="absolute -top-8 -right-10 w-56 h-10 bg-verde rounded-full -rotate-[35deg]" />
            <div aria-hidden className="absolute top-1/2 -left-14 w-48 h-9 bg-azul rounded-full -rotate-[35deg]" />
            <div aria-hidden className="absolute -bottom-8 right-6 w-40 h-8 bg-amarelo rounded-full -rotate-6" />

            <div className="relative rotate-3 rounded-[2rem] overflow-hidden ring-4 ring-white/10 shadow-2xl animate-flutua-lento">
              <Image src="/escola/aluno-2.jpg" alt="Aluna aprovada ao lado do carro da escola" width={1080} height={718} priority className="w-full h-auto aspect-[4/5] object-cover object-[75%_center]" />
              <div className="absolute inset-0 bg-gradient-to-b from-noite/70 via-transparent to-transparent" />
              <p className="absolute top-5 right-5 max-w-[65%] text-right font-display text-xl sm:text-2xl font-extrabold leading-tight">Mais uma carta na mão 🎉</p>
            </div>

            <div className="absolute -bottom-10 -left-4 sm:-left-10 w-36 sm:w-44 -rotate-[8deg] rounded-2xl bg-white p-2 pb-8 shadow-2xl animate-flutua">
              <Image src="/escola/aluno-1.jpg" alt="Aluna aprovada com a carta" width={1080} height={720} className="w-full aspect-square object-cover rounded-xl" />
              <p className="absolute bottom-2 inset-x-0 text-center text-xs font-bold text-noite">Aprovada ✓</p>
            </div>

            <SeloRodando className="absolute -top-10 -left-4 sm:-top-12 sm:-left-12 z-10" />
          </div>
        </div>
      </section>

      {/* ---------- FAIXAS ---------- */}
      <div className="relative -mt-8 z-10 overflow-hidden py-8">
        <div aria-hidden className="absolute inset-x-[-5%] top-1/2 h-16 -translate-y-1/2 bg-azul rotate-[2.5deg]" />
        <Faixa className="relative bg-lima text-noite -rotate-[1.5deg] scale-105 shadow-xl" />
      </div>

      {/* ---------- CARTA EM 3 MESES ---------- */}
      <section id="3-meses" className="py-20 sm:py-28 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-azul via-azul-escuro to-noite text-white px-6 py-12 sm:p-14 lg:p-16 grid lg:grid-cols-12 gap-12 items-center">
            <div aria-hidden className="absolute -top-10 right-1/3 w-80 h-14 bg-white/10 rounded-full -rotate-[35deg]" />
            <div aria-hidden className="absolute -bottom-16 -left-10 w-96 h-14 bg-lima/20 rounded-full -rotate-[35deg]" />

            <div className="relative lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-lima text-noite px-4 py-1.5 text-sm font-bold">
                <Sparkles size={16} /> Curso intensivo
              </span>
              <h2 className="mt-5 font-display text-5xl sm:text-7xl font-extrabold tracking-tight leading-[0.95]">
                Carta em
                <br />3 meses.
              </h2>
              <p className="mt-5 text-lg text-white/75 max-w-lg">Queres a carta depressa? Este é o plano para ti.</p>

              <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
                {CARTA_3_MESES.pontos.map((p) => (
                  <li key={p.titulo} className="rounded-2xl bg-white/10 backdrop-blur p-4 sm:p-5 ring-1 ring-white/15">
                    <p className="font-display text-xl sm:text-3xl font-extrabold leading-tight text-lima">{p.titulo}</p>
                    <p className="mt-1 text-sm sm:text-base text-white/80">{p.texto}</p>
                  </li>
                ))}
              </ul>

              <a
                href={linkWhatsApp('Olá! Quero saber mais sobre a carta em 3 meses.')}
                target="_blank"
                rel="noopener"
                className="mt-10 inline-flex items-center gap-2 bg-lima text-noite px-6 sm:px-8 py-4 rounded-full font-bold sm:text-lg hover:scale-[1.03] transition"
              >
                Quero a carta em 3 meses <ArrowRight size={20} />
              </a>
              <p className="mt-4 text-xs text-white/50">{CARTA_3_MESES.nota}</p>
            </div>

            <div className="relative lg:col-span-5 flex justify-center">
              <div className="relative w-60 sm:w-72 rotate-6 animate-flutua">
                <Image
                  src="/escola/livro-3meses.jpg"
                  alt="Livro de código da S. Cristóvão — Carta em 3 meses"
                  width={372}
                  height={550}
                  className="w-full h-auto rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SERVIÇOS ---------- */}
      <section id="servicos" className="pb-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight">
            Escolhe o teu <span className="text-azul">caminho</span>
          </h2>

          <div className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {SERVICOS.map((s, i) => (
              <Link
                key={s.titulo}
                href="/contactos"
                className={`group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl bg-noite hover:-translate-y-1 transition ${i % 2 ? 'lg:translate-y-8 lg:hover:translate-y-7' : ''}`}
              >
                <Image
                  src={s.imagem}
                  alt={s.titulo}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noite via-noite/40 to-transparent" />
                <span className="absolute top-4 right-4 hidden sm:grid place-items-center size-10 rounded-full bg-white/15 backdrop-blur group-hover:bg-lima group-hover:text-noite text-white transition">
                  <ArrowUpRight size={20} />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white">
                  <span className="inline-block rounded-full bg-lima text-noite text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1">{s.sigla}</span>
                  <h3 className="mt-3 font-display text-xl sm:text-3xl font-extrabold leading-tight">{s.titulo}</h3>
                  <p className="mt-1 hidden sm:block text-sm text-white/70">{s.texto}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 lg:mt-20 flex flex-wrap items-center gap-2">
            <p className="mr-2 font-bold">Também tratamos de:</p>
            {OUTROS_SERVICOS.map((o) => (
              <span key={o} className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold">
                <Check size={14} className="text-azul" /> {o}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ENSINO À DISTÂNCIA + HORÁRIO ---------- */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-5">
          <a href={ENSINO_DISTANCIA} target="_blank" rel="noopener" className="group relative overflow-hidden rounded-3xl bg-noite p-8 sm:p-10 min-h-72 flex flex-col justify-between text-white">
            <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-azul/40 blur-2xl" />
            <span className="relative grid place-items-center size-14 rounded-2xl bg-azul text-white"><MonitorPlay size={26} /></span>
            <div className="relative">
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Código à distância</h3>
              <p className="mt-2 text-white/70 max-w-sm">Estuda o código online, no sofá, no comboio, onde quiseres.</p>
              <span className="mt-6 inline-flex items-center gap-2 font-bold text-lima group-hover:gap-3 transition-all">
                Entrar na plataforma <ArrowUpRight size={18} />
              </span>
            </div>
          </a>

          <Link href="/horarios" className="group relative overflow-hidden rounded-3xl bg-lima p-8 sm:p-10 min-h-72 flex flex-col justify-between">
            <div aria-hidden className="absolute -right-10 -bottom-10 w-72 h-14 bg-verde/60 rounded-full -rotate-[35deg]" />
            <span className="relative grid place-items-center size-14 rounded-2xl bg-noite text-lima"><Clock size={26} /></span>
            <div className="relative text-noite">
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Horários</h3>
              <ul className="mt-3 space-y-1 text-noite/75 text-sm sm:text-base">
                {HORARIO.map((h) => (
                  <li key={h.titulo}><span className="font-bold text-noite">{h.titulo}:</span> {h.horas}</li>
                ))}
              </ul>
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
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight">
              Os nossos <span className="text-azul">alunos</span> 🎉
            </h2>
            <Link href="/sobre-nos" className="hidden sm:inline-flex items-center gap-2 font-bold text-azul-escuro hover:gap-3 transition-all">
              Sobre nós <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory">
            {GALERIA.map((g, i) => (
              <div
                key={g.src}
                className={`relative shrink-0 w-[75%] sm:w-auto aspect-[3/4] snap-start overflow-hidden rounded-3xl ${i % 2 ? 'sm:mt-10 sm:rotate-2' : 'sm:-rotate-2'}`}
              >
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 640px) 25vw, 75vw" className="object-cover hover:scale-105 transition duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CHAMADA FINAL ---------- */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-[2.5rem] bg-noite text-white px-6 sm:px-14 py-14 sm:py-20">
          <div aria-hidden className="absolute -top-24 -right-24 size-96 rounded-full bg-azul/40 blur-3xl" />
          <div aria-hidden className="absolute -top-8 right-10 w-72 h-12 bg-azul rounded-full -rotate-[35deg]" />
          <div aria-hidden className="absolute top-16 -right-10 w-72 h-10 bg-verde rounded-full -rotate-[35deg]" />
          <div aria-hidden className="absolute bottom-8 right-1/4 w-48 h-8 bg-amarelo rounded-full -rotate-3 hidden sm:block" />
          <div className="relative max-w-xl">
            <h2 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight leading-[0.95]">
              Bora tirar
              <br />a <span className="text-lima">carta?</span>
            </h2>
            <p className="mt-5 text-lg text-white/70">Fala connosco. Tratamos de tudo, do código ao exame.</p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <a
                href={linkWhatsApp('Olá! Gostava de mais informações sobre a carta de condução.')}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 bg-lima text-noite px-7 py-4 rounded-full font-bold hover:scale-[1.03] transition"
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
