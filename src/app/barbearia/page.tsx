import type { Metadata } from 'next'
import { Scissors, MapPin, Phone, Mail, Instagram, Clock, Star } from 'lucide-react'
import { BARBEARIA, SERVICOS, BARBEIROS, HORARIO, DIAS_SEMANA } from '@/lib/barbearia-data'
import Marcacao from './marcacao'

export const metadata: Metadata = {
  title: `${BARBEARIA.nome} | Barbearia`,
  description: `${BARBEARIA.slogan} Marque o seu corte online.`,
}

// Segunda primeiro, Domingo no fim
const ORDEM_DIAS = [1, 2, 3, 4, 5, 6, 0]

export default function BarbeariaPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30 scroll-smooth">

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#topo" className="flex items-center gap-2">
            <div className="bg-amber-500 p-2 rounded-xl text-zinc-950">
              <Scissors size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight">{BARBEARIA.nome}</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-400">
            <a href="#servicos" className="hover:text-amber-400 transition-colors">Serviços</a>
            <a href="#equipa" className="hover:text-amber-400 transition-colors">Equipa</a>
            <a href="#contactos" className="hover:text-amber-400 transition-colors">Contactos</a>
          </div>
          <a href="#marcar" className="bg-amber-500 text-zinc-950 px-5 py-2.5 rounded-full text-sm font-black hover:bg-amber-400 transition-colors">
            Marcar
          </a>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section id="topo" className="relative pt-40 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.15),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest border border-amber-500/20">
            <Star size={14} className="fill-amber-400" /> Desde 2015 em Lisboa
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
            {BARBEARIA.slogan.split(',')[0]},<br />
            <span className="text-amber-400">{BARBEARIA.slogan.split(',')[1]?.trim()}</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Cortes, barbas e cuidados à moda antiga, feitos por quem sabe. Escolha o serviço,
            o barbeiro e a hora — a marcação demora menos de um minuto.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#marcar" className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-zinc-950 rounded-2xl font-black text-lg hover:bg-amber-400 transition-colors">
              Marcar agora
            </a>
            <a href="#servicos" className="w-full sm:w-auto px-8 py-4 border border-zinc-700 rounded-2xl font-bold text-lg hover:border-zinc-500 transition-colors">
              Ver serviços
            </a>
          </div>
        </div>
      </section>

      {/* --- SERVIÇOS --- */}
      <section id="servicos" className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <SectionTitle kicker="Serviços" title="O que fazemos" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICOS.map(s => (
              <div key={s.id} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-black">{s.nome}</h3>
                  <span className="text-amber-400 font-black text-lg whitespace-nowrap">{s.preco} €</span>
                </div>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{s.descricao}</p>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-4 flex items-center gap-1.5">
                  <Clock size={12} /> {s.duracao} min
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EQUIPA --- */}
      <section id="equipa" className="py-24 px-6 bg-zinc-900/40 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <SectionTitle kicker="Equipa" title="Os nossos barbeiros" />
          <div className="grid sm:grid-cols-3 gap-4">
            {BARBEIROS.map(b => (
              <div key={b.id} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-2xl font-black text-zinc-950">
                  {b.iniciais}
                </div>
                <h3 className="mt-5 text-lg font-black">{b.nome}</h3>
                <p className="text-zinc-400 text-sm mt-1">{b.especialidade}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MARCAÇÃO --- */}
      <section id="marcar" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <SectionTitle kicker="Marcação online" title="Reserve o seu lugar" />
          <Marcacao />
        </div>
      </section>

      {/* --- CONTACTOS --- */}
      <section id="contactos" className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2"><Clock size={18} className="text-amber-400" /> Horário</h3>
            <ul className="space-y-3 text-sm">
              {ORDEM_DIAS.map(d => (
                <li key={d} className="flex justify-between border-b border-zinc-800 pb-3 last:border-0">
                  <span className="text-zinc-400 font-bold">{DIAS_SEMANA[d]}</span>
                  <span className={HORARIO[d] ? 'font-bold' : 'text-zinc-600'}>
                    {HORARIO[d] ? `${HORARIO[d]!.abre} – ${HORARIO[d]!.fecha}` : 'Fechado'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-lg font-black mb-6">Contactos</h3>
            <ul className="space-y-5 text-sm">
              <ContactItem icon={MapPin} text={BARBEARIA.morada} />
              <ContactItem icon={Phone} text={BARBEARIA.telefone} href={`tel:${BARBEARIA.telefone.replace(/\s/g, '')}`} />
              <ContactItem icon={Mail} text={BARBEARIA.email} href={`mailto:${BARBEARIA.email}`} />
              <ContactItem icon={Instagram} text={BARBEARIA.instagram} />
            </ul>
          </div>
        </div>
      </section>

      <footer className="py-10 px-6 border-t border-zinc-900 text-center text-xs text-zinc-600 font-bold">
        © {new Date().getFullYear()} {BARBEARIA.nome}. Todos os direitos reservados.
      </footer>
    </div>
  )
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="text-center mb-12">
      <p className="text-amber-400 text-xs font-black uppercase tracking-[0.2em]">{kicker}</p>
      <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-2">{title}</h2>
    </div>
  )
}

function ContactItem({ icon: Icon, text, href }: { icon: React.ElementType; text: string; href?: string }) {
  const content = (
    <span className="flex items-center gap-3">
      <span className="bg-zinc-800 p-2.5 rounded-xl text-amber-400"><Icon size={16} /></span>
      <span className="font-bold text-zinc-300">{text}</span>
    </span>
  )
  return <li>{href ? <a href={href} className="hover:text-amber-400">{content}</a> : content}</li>
}
