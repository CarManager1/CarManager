import type { Metadata } from 'next'
import Image from 'next/image'
import {
  ArrowRight, Car, Bike, Truck, Smartphone, Check, Sparkles, Clock,
  MapPin, Phone, Mail, BookOpen, CreditCard, ShieldCheck, Zap, MessageCircle,
} from 'lucide-react'
import { ESCOLA, CATEGORIAS, PLANOS } from './dados'
import { MenuEscola } from './menu'
import { FormularioInscricao } from './formulario'

export const metadata: Metadata = {
  title: 'S. Cristóvão — Escola de Condução',
  description:
    'Tira a carta com a Escola de Condução S. Cristóvão: ligeiros, motociclos, CAM, TCC e TVDE. Carta em 3 meses, exames no privado e pagamento até 10x sem juros.',
  icons: { icon: '/escola/logo-icone.png' },
}

const ICONES = { ligeiros: Car, motociclos: Bike, profissionais: Truck, tvde: Smartphone } as const

// Faixas diagonais azul/lima, inspiradas na decoração dos carros da escola
function Riscas({ className = '', soTopo = false }: { className?: string; soTopo?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -top-10 -right-24 w-[520px] h-16 bg-sky-500 rounded-full -rotate-[35deg] opacity-90" />
      <div className="absolute top-24 -right-40 w-[520px] h-10 bg-[#C8F31D] rounded-full -rotate-[35deg]" />
      {!soTopo && (
        <>
          <div className="absolute -bottom-6 -left-32 w-[460px] h-14 bg-[#C8F31D] rounded-full -rotate-[35deg]" />
          <div className="absolute bottom-20 -left-44 w-[420px] h-8 bg-sky-500 rounded-full -rotate-[35deg] opacity-90" />
        </>
      )}
    </div>
  )
}

// Converte "texto **negrito** texto" em JSX
function Negrito({ texto }: { texto: string }) {
  return (
    <>
      {texto.split('**').map((parte, i) => (i % 2 ? <strong key={i}>{parte}</strong> : parte))}
    </>
  )
}

export default function EscolaPage() {
  const whatsappLink = `https://wa.me/${ESCOLA.whatsapp}?text=${encodeURIComponent('Olá! Gostava de mais informações sobre a carta de condução.')}`

  return (
    <div id="inicio" className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      <MenuEscola />

      {/* --- HERO --- */}
      <header className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <Riscas className="opacity-80 hidden lg:block" soTopo />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-zinc-900 text-[#C8F31D] text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full">
              <Sparkles size={14} /> Carta em 3 meses
            </span>
            <h1 className="mt-6 text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
              Contigo em <span className="text-sky-600">todas</span> as estradas.
            </h1>
            <p className="mt-6 text-lg text-zinc-600 max-w-xl">
              Na Escola de Condução S. Cristóvão tiras a carta de carro ou de mota com instrutores experientes,
              horários à tua medida e exames no privado, sem esperas.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#contactos" className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-7 py-4 rounded-full font-black transition">
                Inscreve-te já <ArrowRight size={18} />
              </a>
              <a href="#planos" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-zinc-900 px-7 py-4 rounded-full font-black hover:bg-zinc-50 transition">
                Ver planos
              </a>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-4 max-w-lg">
              {[
                [Zap, 'Exames no privado'],
                [CreditCard, 'Até 10x sem juros'],
                [Clock, 'Horários flexíveis'],
                [ShieldCheck, 'Reprovas? Não pagas*'],
              ].map(([Icone, texto]) => {
                const I = Icone as typeof Zap
                return (
                  <li key={texto as string} className="flex items-center gap-3 text-sm font-bold">
                    <span className="grid place-items-center size-9 rounded-xl bg-[#C8F31D] text-zinc-900 shrink-0">
                      <I size={18} />
                    </span>
                    {texto as string}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-sky-500 to-[#C8F31D] rounded-[2.5rem] rotate-2" />
            <Image
              src="/escola/carro-arte.jpg"
              alt="Carro da Escola de Condução S. Cristóvão"
              width={699}
              height={466}
              priority
              className="relative w-full h-auto rounded-[2rem] shadow-2xl"
            />
          </div>
        </div>
      </header>

      {/* --- CARTAS / CATEGORIAS --- */}
      <section id="cartas" className="py-20 bg-zinc-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sky-600 font-black uppercase tracking-wider text-sm">O que ensinamos</p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">Escolhe a tua carta</h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIAS.map((c) => {
              const Icone = ICONES[c.id as keyof typeof ICONES]
              return (
                <article key={c.id} className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="grid place-items-center size-12 rounded-2xl bg-sky-600 text-white">
                      <Icone size={24} />
                    </span>
                    <span className="text-xs font-black bg-[#C8F31D] px-3 py-1 rounded-full">{c.sigla}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-black">{c.titulo}</h3>
                  <p className="mt-2 text-sm text-zinc-600 flex-1">{c.texto}</p>
                  <p className="mt-4 text-sm font-bold text-sky-700">{c.pagamento}</p>
                  <div className="mt-4 pt-4 border-t border-zinc-100">
                    <p className="text-xs font-black uppercase text-zinc-400">Documentos</p>
                    <ul className="mt-2 space-y-1">
                      {c.documentos.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-zinc-700">
                          <Check size={16} className="text-sky-600 mt-0.5 shrink-0" /> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- PLANOS --- */}
      <section id="planos" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sky-600 font-black uppercase tracking-wider text-sm">Planos</p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">O teu ritmo, a tua carta</h2>
            <p className="mt-4 text-zinc-600">Pede o precário atualizado na secretaria ou pelo WhatsApp.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6 items-stretch">
            {PLANOS.map((p) => (
              <article
                key={p.titulo}
                className={`relative rounded-3xl p-8 border-2 border-zinc-900 shadow-[6px_6px_0_0_#18181b] flex flex-col ${
                  p.destaque ? 'bg-gradient-to-b from-sky-500 to-sky-600 text-white' : 'bg-white'
                }`}
              >
                {p.destaque && (
                  <span className="absolute -top-4 right-6 bg-[#C8F31D] text-zinc-900 text-xs font-black uppercase px-3 py-1.5 border-2 border-zinc-900">
                    Mais popular
                  </span>
                )}
                <h3 className="text-3xl sm:text-4xl font-medium tracking-tight leading-tight">{p.titulo}</h3>
                <ul className="mt-6 space-y-3 flex-1">
                  {p.itens.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Sparkles size={16} className={`mt-0.5 shrink-0 ${p.destaque ? 'text-[#C8F31D]' : 'text-sky-500'}`} />
                      <span><Negrito texto={i} /></span>
                    </li>
                  ))}
                </ul>
                {p.nota && (
                  <p className={`mt-6 text-xs ${p.destaque ? 'text-sky-100' : 'text-zinc-500'}`}>
                    *Válido apenas para 1 reprovação no exame de código ou condução.
                  </p>
                )}
                <a
                  href="#contactos"
                  className={`mt-6 text-center py-3 rounded-full font-black transition ${
                    p.destaque ? 'bg-[#C8F31D] text-zinc-900 hover:brightness-95' : 'bg-zinc-900 text-white hover:bg-zinc-700'
                  }`}
                >
                  Quero este plano
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- RENOVAÇÃO NA HORA --- */}
      <section id="renovacao" className="py-20 bg-zinc-900 text-white relative scroll-mt-20">
        <Riscas className="opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Image
            src="/escola/renovacao.jpg"
            alt="Renovação de carta na hora"
            width={674}
            height={449}
            className="w-full h-auto rounded-3xl shadow-2xl"
          />
          <div>
            <p className="text-[#C8F31D] font-black uppercase tracking-wider text-sm">Serviço rápido</p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">Renovação de carta na hora</h2>
            <p className="mt-5 text-zinc-300 text-lg">
              A tua carta está a caducar? Tratamos da renovação e da revalidação por ti, na hora, sem filas nem
              complicações. Fala connosco para saberes que documentos precisas.
            </p>
            <a href={whatsappLink} target="_blank" rel="noopener" className="mt-8 inline-flex items-center gap-2 bg-[#C8F31D] text-zinc-900 px-7 py-4 rounded-full font-black hover:brightness-95 transition">
              <MessageCircle size={18} /> Marcar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* --- LIVRO DE CÓDIGO --- */}
      <section id="codigo" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-sky-600 font-black uppercase tracking-wider text-sm">Material de estudo</p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">O Código da Estrada, à nossa maneira</h2>
            <p className="mt-5 text-zinc-600 text-lg">
              A S. Cristóvão tem o seu próprio livro de código, para estudares a matéria e chegares ao exame
              com confiança. Aulas de código <strong>online ou presencial</strong>, como te der mais jeito.
            </p>
            <ul className="mt-6 space-y-3">
              {['Livro de código da escola', 'Aulas online ou presencial', 'Acompanhamento dos instrutores'].map((t) => (
                <li key={t} className="flex items-center gap-3 font-bold">
                  <span className="grid place-items-center size-7 rounded-full bg-[#C8F31D]"><BookOpen size={14} /></span> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-5">
            <Image src="/escola/livro-codigo.jpg" alt="Capa do livro O Código da Estrada" width={370} height={546} className="w-full h-auto rounded-2xl shadow-xl -rotate-2" />
            <Image src="/escola/livro-verso.jpg" alt="Aluna com o livro de código" width={387} height={556} className="w-full h-auto rounded-2xl shadow-xl rotate-2 mt-8" />
          </div>
        </div>
      </section>

      {/* --- GALERIA --- */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sky-600 font-black uppercase tracking-wider text-sm">Os nossos alunos</p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">Mais uma carta na mão 🎉</h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Image src="/escola/aluno-1.jpg" alt="Aluna aprovada ao lado do carro da escola" width={1080} height={720} className="w-full h-64 object-cover rounded-3xl" />
            <Image src="/escola/aluno-2.jpg" alt="Aluna aprovada com a carta de condução" width={1080} height={718} className="w-full h-64 object-cover rounded-3xl" />
            <Image src="/escola/carro-traseira.jpg" alt="Carro da escola visto de trás" width={1080} height={718} className="w-full h-64 object-cover rounded-3xl" />
            <Image src="/escola/montra.jpg" alt="Fachada da escola de condução" width={699} height={526} className="w-full h-64 object-cover rounded-3xl lg:col-span-2" />
            <Image src="/escola/placa.jpg" alt="Placa da escola de condução" width={778} height={518} className="w-full h-64 object-cover rounded-3xl" />
          </div>
        </div>
      </section>

      {/* --- DÚVIDAS --- */}
      <section id="duvidas" className="py-20 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sky-600 font-black uppercase tracking-wider text-sm">Dúvidas frequentes</p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">Perguntas e respostas</h2>
          </div>
          <div className="mt-10 space-y-3">
            {[
              ['Que documentos preciso para me inscrever?', 'Para a carta de ligeiros: Cartão de Cidadão e atestado médico. Para motociclos, se fores menor, também a autorização paternal e o assento de nascimento.'],
              ['Posso pagar às prestações?', 'Sim. Na carta de ligeiros podes pagar em 2x, 4x ou até 10x sem juros. Nos motociclos, em 2x, 4x ou 6x. Também podes pagar a pronto, aula a aula.'],
              ['É mesmo possível tirar a carta em 3 meses?', 'Sim, com o curso intensivo: 6 aulas por semana e exames no privado, sem tempos de espera.'],
              ['E se eu reprovar?', 'Nos planos Carta normal e Carta em 3 meses, se reprovares não pagas o novo exame. Válido para 1 reprovação no exame de código ou de condução.'],
              ['Já tenho carta mas não conduzo há muito tempo. Podem ajudar?', 'Claro! Temos aulas para encartados, em pacotes de 1, 5, 8 ou 10 aulas, para ganhares confiança ao volante.'],
            ].map(([p, r]) => (
              <details key={p} className="group bg-zinc-50 rounded-2xl border border-zinc-100 p-5 open:bg-white open:shadow-md transition">
                <summary className="flex items-center justify-between cursor-pointer list-none font-black">
                  {p}
                  <span className="ml-4 grid place-items-center size-8 rounded-full bg-[#C8F31D] shrink-0 group-open:rotate-45 transition text-lg">+</span>
                </summary>
                <p className="mt-3 text-zinc-600">{r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACTOS --- */}
      <section id="contactos" className="py-20 bg-gradient-to-br from-sky-600 to-sky-800 text-white relative scroll-mt-20">
        <Riscas className="opacity-40 hidden lg:block" soTopo />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-[#C8F31D] font-black uppercase tracking-wider text-sm">Inscrições abertas</p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight">Vem tirar a carta connosco</h2>
            <p className="mt-5 text-sky-100 text-lg">Deixa os teus dados e falamos contigo pelo WhatsApp. Ou aparece na escola!</p>
            <ul className="mt-10 space-y-5">
              <li className="flex items-start gap-4">
                <span className="grid place-items-center size-11 rounded-2xl bg-white/15 shrink-0"><MapPin size={20} /></span>
                <span><strong className="block">Morada</strong>{ESCOLA.morada}<br />{ESCOLA.codigoPostal}</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid place-items-center size-11 rounded-2xl bg-white/15 shrink-0"><Phone size={20} /></span>
                <span><strong className="block">Telefone</strong><a href={`tel:${ESCOLA.telefoneLink}`} className="hover:underline">{ESCOLA.telefone}</a></span>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid place-items-center size-11 rounded-2xl bg-white/15 shrink-0"><Mail size={20} /></span>
                <span><strong className="block">Email</strong><a href={`mailto:${ESCOLA.email}`} className="hover:underline break-all">{ESCOLA.email}</a></span>
              </li>
              <li className="flex items-start gap-4">
                <span className="grid place-items-center size-11 rounded-2xl bg-white/15 shrink-0"><Clock size={20} /></span>
                <span>
                  <strong className="block">Horário</strong>
                  {ESCOLA.horario.map((h) => (
                    <span key={h.dias} className="block">{h.dias}: {h.horas}</span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
          <div className="text-zinc-900">
            <FormularioInscricao />
          </div>
        </div>
      </section>

      {/* --- RODAPÉ --- */}
      <footer className="bg-zinc-950 text-zinc-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Image src="/escola/logo-branco.png" alt={ESCOLA.nomeCompleto} width={805} height={168} className="h-10 w-auto" />
          <p className="text-sm text-center">
            © {new Date().getFullYear()} {ESCOLA.nomeCompleto} · {ESCOLA.slogan}
          </p>
          <div className="flex gap-4 text-sm font-bold">
            {ESCOLA.instagram && <a href={ESCOLA.instagram} target="_blank" rel="noopener" className="hover:text-white">Instagram</a>}
            {ESCOLA.facebook && <a href={ESCOLA.facebook} target="_blank" rel="noopener" className="hover:text-white">Facebook</a>}
            <a href="#inicio" className="hover:text-white">Voltar ao topo ↑</a>
          </div>
        </div>
      </footer>

      {/* Botão flutuante do WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener"
        aria-label="Falar pelo WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid place-items-center size-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 transition"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  )
}
