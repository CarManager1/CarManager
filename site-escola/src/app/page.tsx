import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ChevronsRight, MapPin, MonitorPlay, Clock, Phone, MessageCircle, Check, Zap } from 'lucide-react'
import { SERVICOS, OUTROS_SERVICOS, ENSINO_DISTANCIA, ESCOLA, OPCOES } from '@/lib/dados'
import { linkWhatsApp } from '@/components/whatsapp'

const FAIXA = ['Carta em 3 meses', 'Junto ao Metro Areeiro', 'Código online', 'Exames no privado', 'Carro e mota', 'Aulas de treino']

// Botão em paralelogramo, como nos cartazes da escola
function BotaoCartaz({ href, cor, children, externo = false }: { href: string; cor: 'lima' | 'azul'; children: React.ReactNode; externo?: boolean }) {
  const estilo = cor === 'lima' ? 'bg-lima text-noite' : 'bg-azul-escuro text-white'
  return (
    <a
      href={href}
      {...(externo ? { target: '_blank', rel: 'noopener' } : {})}
      className={`group inline-flex -skew-x-12 items-center justify-center px-7 py-3.5 shadow-[5px_5px_0_0_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition ${estilo}`}
    >
      <span className="skew-x-12 flex items-center gap-2 font-display text-2xl uppercase tracking-wide">{children}</span>
    </a>
  )
}

// Sinal octogonal "Junto ao Metro Areeiro"
function SinalMetro({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid place-items-center size-40 bg-white p-1.5 [clip-path:polygon(30%_0,70%_0,100%_30%,100%_70%,70%_100%,30%_100%,0_70%,0_30%)] drop-shadow-xl">
        <div className="grid place-items-center size-full bg-[#d7262b] text-white text-center [clip-path:polygon(30%_0,70%_0,100%_30%,100%_70%,70%_100%,30%_100%,0_70%,0_30%)]">
          <p className="font-display uppercase leading-[0.95]">
            <span className="block text-sm tracking-wide">Junto ao</span>
            <span className="block text-3xl">Metro</span>
            <span className="block text-3xl">Areeiro</span>
          </p>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-noite shadow-xl">
        <MapPin size={16} className="text-[#d7262b] shrink-0" /> {ESCOLA.morada}
      </p>
    </div>
  )
}

export default function Inicio() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative isolate overflow-hidden bg-noite text-white">
        <Image
          src="/escola/hero-areeiro.jpg"
          alt="Carro da S. Cristóvão junto ao Metro Areeiro"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[65%_70%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-noite/80 via-noite/30 to-noite/60 lg:bg-gradient-to-r lg:from-noite/85 lg:via-noite/35 lg:to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[640px] lg:min-h-[min(86vh,820px)] py-16 lg:py-24 flex flex-col justify-between lg:justify-center gap-10">
          <div className="flex items-start justify-between gap-10">
            <div>
              <h1 className="font-display uppercase leading-[1.1] text-[3.6rem] sm:text-8xl xl:text-[8.5rem]">
                <span className="block w-fit -rotate-2 bg-lima px-3 sm:px-5 text-noite">Carta de</span>
                <span className="block w-fit -rotate-2 bg-azul px-3 sm:px-5">Condução</span>
                <span className="mt-3 block w-fit -rotate-2 bg-amarelo px-3 sm:px-5 text-noite shadow-[8px_8px_0_0_rgba(0,0,0,0.35)]">
                  em 3 meses!
                </span>
              </h1>
            </div>
            <SinalMetro className="hidden lg:block shrink-0 rotate-3 mt-4" />
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-5 lg:mt-10">
            <BotaoCartaz href="/contactos" cor="azul">Inscreve-te já!</BotaoCartaz>
            <BotaoCartaz href="#carta-3-meses" cor="lima">
              Saber mais <ChevronsRight size={24} />
            </BotaoCartaz>
          </div>
        </div>
      </section>

      {/* ---------- FAIXA ---------- */}
      <div className="relative -mt-6 z-10 overflow-hidden py-6">
        <div aria-hidden className="absolute inset-x-[-5%] top-1/2 h-14 -translate-y-1/2 bg-azul rotate-[2deg]" />
        <div className="relative -rotate-[1.5deg] scale-105 bg-lima text-noite shadow-xl overflow-hidden whitespace-nowrap py-3">
          <div className="flex w-max animate-faixa">
            {[...FAIXA, ...FAIXA].map((t, i) => (
              <span key={i} className="flex items-center gap-6 px-6 font-display text-2xl sm:text-3xl uppercase">
                {t} <span className="text-azul">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- CARTA EM 3 MESES ---------- */}
      <section id="carta-3-meses" className="py-20 sm:py-28 scroll-mt-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
            <div aria-hidden className="absolute -inset-3 bg-azul -rotate-3 rounded-3xl" />
            <div aria-hidden className="absolute -inset-3 bg-lima rotate-2 rounded-3xl" />
            <Image
              src="/escola/cartaz-3meses.jpg"
              alt="Carta de condução em 3 meses, junto ao Metro Areeiro"
              width={806}
              height={1000}
              className="relative w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>

          <div>
            <h2 className="font-display uppercase text-6xl sm:text-7xl leading-[1.1]">
              <span className="block w-fit -rotate-2 bg-azul px-3 text-white">Escolhe</span>
              <span className="block w-fit -rotate-2 bg-lima px-3 mt-1">o teu ritmo</span>
            </h2>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {OPCOES.map((o) => (
                <article
                  key={o.titulo}
                  className={`relative flex flex-col rounded-3xl p-6 ${o.destaque ? 'bg-noite text-white shadow-[8px_8px_0_0_var(--color-lima)]' : 'bg-zinc-100'}`}
                >
                  {o.destaque && (
                    <span className="absolute -top-3 right-5 -skew-x-12 bg-lima px-3 py-1 text-xs font-extrabold uppercase text-noite">
                      <span className="flex items-center gap-1 skew-x-12"><Zap size={12} /> Mais rápido</span>
                    </span>
                  )}
                  <h3 className={`font-display uppercase text-2xl ${o.destaque ? 'text-lima' : 'text-azul-escuro'}`}>{o.titulo}</h3>
                  <p className="mt-4 font-display uppercase text-6xl leading-none">{o.numero}</p>
                  <p className={`text-sm font-bold ${o.destaque ? 'text-white/70' : 'text-zinc-600'}`}>{o.unidade}</p>
                  <ul className="mt-5 space-y-2 flex-1">
                    {o.pontos.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm font-semibold">
                        <Check size={16} className={`mt-0.5 shrink-0 ${o.destaque ? 'text-lima' : 'text-azul'}`} /> {p}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={linkWhatsApp(o.mensagem)}
                    target="_blank"
                    rel="noopener"
                    className={`mt-6 inline-flex items-center justify-center gap-1 py-3 font-display uppercase text-xl -skew-x-12 transition hover:-translate-y-0.5 ${
                      o.destaque ? 'bg-lima text-noite' : 'bg-azul-escuro text-white'
                    }`}
                  >
                    <span className="skew-x-12 flex items-center gap-1">Quero este <ChevronsRight size={20} /></span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SERVIÇOS ---------- */}
      <section id="servicos" className="pb-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display uppercase text-5xl sm:text-7xl leading-none">
            Escolhe o teu <span className="inline-block -rotate-2 bg-lima px-3">caminho</span>
          </h2>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {SERVICOS.map((s) => (
              <Link key={s.titulo} href="/contactos" className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-noite">
                <Image
                  src={s.imagem}
                  alt={s.titulo}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noite via-noite/20 to-transparent" />
                <span className="absolute top-3 left-3 -skew-x-12 bg-lima px-2.5 py-1 text-[10px] sm:text-xs font-extrabold uppercase text-noite">
                  <span className="block skew-x-12">{s.sigla}</span>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-2 text-white">
                  <h3 className="font-display uppercase text-2xl sm:text-4xl leading-none">{s.titulo}</h3>
                  <ArrowUpRight className="hidden sm:block shrink-0 group-hover:text-lima transition" />
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-8 text-sm text-zinc-500">
            <span className="font-bold text-noite">Também:</span> {OUTROS_SERVICOS.join(' · ')}
          </p>
        </div>
      </section>

      {/* ---------- LOCALIZAÇÃO ---------- */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="relative isolate max-w-7xl mx-auto overflow-hidden rounded-3xl min-h-[480px] flex items-end">
          <Image src="/escola/metro-areeiro.jpg" alt="Carro da escola junto à estação de Metro do Areeiro" fill sizes="100vw" className="-z-10 object-cover object-[70%_center]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-noite/90 via-noite/30 to-transparent" />
          <div className="w-full p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white">
            <div>
              <h2 className="font-display uppercase text-5xl sm:text-7xl leading-none">
                <span className="block w-fit -rotate-2 bg-[#d7262b] px-3">Metro Areeiro</span>
              </h2>
              <p className="mt-4 flex items-center gap-2 text-lg font-bold">
                <MapPin size={20} className="text-lima" /> {ESCOLA.morada}
              </p>
            </div>
            <BotaoCartaz href={ESCOLA.comoChegar} cor="lima" externo>
              Como chegar <ChevronsRight size={24} />
            </BotaoCartaz>
          </div>
        </div>
      </section>

      {/* ---------- ATALHOS ---------- */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-4">
          <a href={ENSINO_DISTANCIA} target="_blank" rel="noopener" className="group flex items-center gap-5 rounded-2xl bg-azul p-6 sm:p-8 text-white hover:bg-azul-escuro transition">
            <MonitorPlay size={36} className="shrink-0" />
            <span className="flex-1 font-display uppercase text-3xl sm:text-4xl leading-none">Código online</span>
            <ArrowUpRight size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
          </a>
          <Link href="/horarios" className="group flex items-center gap-5 rounded-2xl bg-lima p-6 sm:p-8 text-noite hover:brightness-95 transition">
            <Clock size={36} className="shrink-0" />
            <span className="flex-1 font-display uppercase text-3xl sm:text-4xl leading-none">Horários</span>
            <ArrowUpRight size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
          </Link>
        </div>
      </section>

      {/* ---------- CHAMADA FINAL ---------- */}
      <section className="relative overflow-hidden bg-noite text-white">
        <div aria-hidden className="absolute -right-20 top-6 w-[28rem] h-14 bg-azul -rotate-[25deg]" />
        <div aria-hidden className="absolute -right-24 top-28 w-[28rem] h-10 bg-lima -rotate-[25deg]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
          <h2 className="font-display uppercase text-6xl sm:text-8xl leading-[0.95]">
            Inscreve-te
            <br />
            <span className="inline-block -rotate-2 bg-lima px-3 text-noite">já!</span>
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4">
            <BotaoCartaz href={linkWhatsApp('Olá! Gostava de me inscrever.')} cor="lima" externo>
              <MessageCircle size={22} /> WhatsApp
            </BotaoCartaz>
            {ESCOLA.telefones.map((t) => (
              <BotaoCartaz key={t.link} href={`tel:${t.link}`} cor="azul">
                <Phone size={20} /> {t.texto}
              </BotaoCartaz>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
