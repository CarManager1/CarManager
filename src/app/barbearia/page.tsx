import { Clock, Mail, MapPin, Phone, ChevronDown } from 'lucide-react'
import { BARBERS, FAQS, LOCATIONS, OPENING_HOURS, PRICING_DATA, WEEKDAYS } from '@/lib/siteData'
import Navbar from '@/components/barbearia/Navbar'
import HeroSlideshow from '@/components/barbearia/HeroSlideshow'
import SectionTitle from '@/components/barbearia/SectionTitle'
import BookingForm from '@/components/barbearia/BookingForm'
import Footer from '@/components/barbearia/Footer'

// Segunda primeiro, Domingo no fim
const ORDEM_DIAS = [1, 2, 3, 4, 5, 6, 0]

export default function BarbeariaPage() {
  return (
    <div className="min-h-screen bg-sky-950 text-white selection:bg-gold-500/30">
      <Navbar />
      <HeroSlideshow />

      {/* --- SERVIÇOS / PREÇOS --- */}
      <section id="servicos" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <SectionTitle kicker="Serviços" title="Preçário" subtitle="Preços fixos, sem surpresas. Todos os serviços incluem lavagem e finalização." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRICING_DATA.map(s => (
              <div key={s.id} className="p-7 rounded-3xl bg-sky-900/60 border border-white/10 hover:border-gold-500/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl font-bold">{s.name}</h3>
                  <span className="text-gold-400 font-bold text-xl whitespace-nowrap">{s.price} €</span>
                </div>
                <p className="text-sky-100/70 text-sm mt-3 leading-relaxed">{s.description}</p>
                <p className="text-sky-100/50 text-xs font-bold uppercase tracking-wider mt-5 flex items-center gap-1.5">
                  <Clock size={12} /> {s.duration} min
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EQUIPA --- */}
      <section id="equipa" className="py-24 px-6 bg-sky-900 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <SectionTitle kicker="Equipa" title="Os nossos barbeiros" />
          <div className="grid sm:grid-cols-3 gap-5">
            {BARBERS.map(b => (
              <div key={b.id} className="p-8 rounded-3xl bg-sky-950/60 border border-white/10 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center font-display text-3xl font-bold text-sky-950">
                  {b.initials}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{b.name}</h3>
                <p className="text-sky-100/70 text-sm mt-1">{b.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MARCAÇÃO --- */}
      <section id="marcar" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <SectionTitle kicker="Marcação online" title="Reserve o seu lugar" subtitle="Escolha o serviço, o barbeiro e a hora. Confirmação imediata." />
          <BookingForm />
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-24 px-6 bg-sky-50 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <SectionTitle kicker="Dúvidas" title="Perguntas frequentes" light />
          <div className="space-y-3">
            {FAQS.map(f => (
              <details key={f.q} className="group rounded-3xl bg-white border border-sky-900/10 px-7 py-5 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-sky-950">
                  {f.q}
                  <ChevronDown size={18} className="shrink-0 text-gold-600 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sky-900/70 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- HORÁRIO E CONTACTOS --- */}
      <section id="contactos" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <SectionTitle kicker="Visite-nos" title="Horário e contactos" />
          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-8 rounded-3xl bg-sky-900/60 border border-white/10">
              <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2"><Clock size={18} className="text-gold-400" /> Horário</h3>
              <ul className="space-y-3 text-sm">
                {ORDEM_DIAS.map(d => {
                  const h = OPENING_HOURS[d]
                  return (
                    <li key={d} className="flex justify-between border-b border-white/10 pb-3 last:border-0">
                      <span className="text-sky-100/70 font-semibold">{WEEKDAYS[d]}</span>
                      <span className={h ? 'font-bold' : 'text-sky-100/40'}>{h ? `${h.open} – ${h.close}` : 'Fechado'}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            {LOCATIONS.map(l => (
              <div key={l.id} className="p-8 rounded-3xl bg-sky-900/60 border border-white/10">
                <h3 className="font-display text-xl font-bold mb-6">{l.name}</h3>
                <ul className="space-y-5 text-sm">
                  <ContactItem icon={MapPin} text={l.address} href={l.mapsUrl} />
                  <ContactItem icon={Phone} text={l.phone} href={`tel:${l.phone.replace(/\s/g, '')}`} />
                  <ContactItem icon={Mail} text={l.email} href={`mailto:${l.email}`} />
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function ContactItem({ icon: Icon, text, href }: { icon: React.ElementType; text: string; href: string }) {
  return (
    <li>
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex items-center gap-3 group">
        <span className="bg-sky-950 p-2.5 rounded-xl text-gold-400"><Icon size={16} /></span>
        <span className="font-semibold text-sky-100/90 group-hover:text-gold-400 transition-colors">{text}</span>
      </a>
    </li>
  )
}
