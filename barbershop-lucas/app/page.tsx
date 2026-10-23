import Image from "next/image";
import { BadgePercent, Clock, Crown, Instagram, MapPin, MessageCircle, Phone, Scissors, Star } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import BookingWidget from "@/components/site/BookingWidget";
import ServiceGrid from "@/components/site/ServiceGrid";
import PlanCards from "@/components/site/PlanCards";
import SectionTitle from "@/components/site/SectionTitle";
import { BENEFITS, BRAND, FAQS, OPENING_HOURS, WEEKDAYS } from "@/lib/siteData";
import { waLink } from "@/lib/utils";

const BENEFIT_ICONS = [Scissors, Star, BadgePercent, Crown, Crown];

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />

      {/* HERO + MARCAÇÃO */}
      <section className="relative isolate min-h-screen pt-28 pb-16 lg:pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(212,161,47,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(212,161,47,0.08),transparent_50%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_minmax(0,520px)]">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold-700">
              <Star size={12} className="fill-gold-400 text-gold-600" /> Barbearia premium
            </p>
            <h1 className="font-display text-6xl font-bold uppercase leading-[0.95] text-zinc-900 sm:text-7xl xl:text-8xl">
              O seu estilo,
              <br />
              <span className="text-gold-gradient">sempre em dia.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-zinc-600">
              Mais que um corte, um estilo de vida. Marque em segundos e esteja sempre na régua — ou junte-se ao
              <span className="font-semibold text-gold-700"> Clube Barber Shop Lucas</span> com cortes ilimitados.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#planos" className="rounded-full border border-gold-400/60 px-6 py-3 font-semibold text-gold-700 transition hover:bg-gold-500/10">
                Ver planos desde 60€/mês
              </a>
              <a
                href={waLink(BRAND.phone, "Olá Lucas! Gostava de marcar um corte.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-zinc-600 transition hover:text-zinc-900"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-zinc-200 pt-8">
              {[
                ["3", "Planos mensais"],
                ["6", "Serviços"],
                ["6 dias", "Por semana"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-gold-gradient font-display text-3xl font-bold">{value}</dt>
                  <dd className="text-xs uppercase tracking-wide text-zinc-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <BookingWidget />
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="scroll-mt-20 border-t border-zinc-100 bg-stone-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Serviços" title="Esteja sempre na régua" text="Escolha o serviço e marque logo o seu horário." />
          <ServiceGrid />
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="relative scroll-mt-20 py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(212,161,47,0.12),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="Faça parte do clube"
            title="Planos de assinatura"
            text="Ser assinante é ter mais estilo, economia e benefícios exclusivos todos os meses."
          />
          <PlanCards />

          <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {BENEFITS.map((b, i) => {
              const Icon = BENEFIT_ICONS[i];
              return (
                <div key={b.title} className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/60 text-gold-700">
                    <Icon size={20} />
                  </div>
                  <p className="font-display text-lg font-semibold uppercase text-zinc-900">{b.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">{b.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="scroll-mt-20 border-t border-zinc-100 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div className="relative">
            <div className="bg-gold-gradient absolute -inset-1 rounded-[2rem] opacity-40 blur-2xl" />
            <Image
              src="/media/lucas.jpg"
              alt={BRAND.barber}
              width={530}
              height={555}
              className="relative w-full rounded-[2rem] border border-gold-500/30 object-cover"
            />
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-gold-600">O barbeiro</p>
            <h2 className="font-display text-5xl font-bold uppercase text-zinc-900">{BRAND.barber}</h2>
            <p className="mt-6 text-lg text-zinc-600">
              Cortes clássicos e modernos, degradês na perfeição e barbas bem desenhadas. Na Barber Shop Lucas cada
              cliente sai com o seu melhor visual — sempre.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Image src="/media/poster-plano.jpg" alt="Plano de assinatura" width={490} height={702} className="rounded-2xl border border-zinc-200" />
              <Image src="/media/poster-clube.jpg" alt="Clube Barber Shop Lucas" width={520} height={765} className="rounded-2xl border border-zinc-200" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-100 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionTitle eyebrow="Dúvidas" title="Perguntas frequentes" />
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-zinc-200 bg-white p-5 open:border-gold-500/40">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-zinc-900">
                  {f.q}
                  <span className="text-gold-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-zinc-500">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTOS */}
      <section id="contactos" className="scroll-mt-20 border-t border-zinc-100 bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-3">
          <div>
            <Image src="/media/logo.png" alt="Barber Shop Lucas" width={140} height={134} />
            <p className="mt-4 text-zinc-500">{BRAND.tagline}</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold uppercase text-zinc-900">Contactos</h3>
            <a href={waLink(BRAND.phone, "Olá Lucas!")} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-zinc-600 hover:text-gold-700">
              <Phone size={18} className="text-gold-600" /> {BRAND.phone}
            </a>
            <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-zinc-600 hover:text-gold-700">
              <Instagram size={18} className="text-gold-600" /> @{BRAND.instagram}
            </a>
            <a href={BRAND.mapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-zinc-600 hover:text-gold-700">
              <MapPin size={18} className="text-gold-600" /> {BRAND.address}
            </a>
          </div>
          <div>
            <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold uppercase text-zinc-900">
              <Clock size={18} className="text-gold-600" /> Horário
            </h3>
            <ul className="space-y-1.5 text-sm">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const h = OPENING_HOURS[d];
                return (
                  <li key={d} className="flex justify-between border-b border-zinc-100 pb-1.5">
                    <span className="text-zinc-500">{WEEKDAYS[d]}</span>
                    <span className={h ? "text-zinc-900" : "text-zinc-400"}>{h ? `${h.open} – ${h.close}` : "Fechado"}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-8 text-center text-xs uppercase tracking-[0.3em] text-zinc-400">
        Barber Shop Lucas | O seu estilo começa aqui!
      </footer>

      <a
        href={waLink(BRAND.phone, "Olá Lucas! Gostava de marcar um corte.")}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-zinc-400/40 transition hover:scale-105"
      >
        <MessageCircle size={26} />
      </a>
    </main>
  );
}
