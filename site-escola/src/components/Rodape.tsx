import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, Clock, MessageCircle, MonitorPlay, MapPin } from 'lucide-react'
import { ESCOLA, MENU, HORARIO, ENSINO_DISTANCIA } from '@/lib/dados'
import { linkWhatsApp } from './whatsapp'

export function Rodape() {
  return (
    <>
      <footer className="bg-noite text-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Image src="/escola/logo-branco.png" alt={ESCOLA.nomeCompleto} width={805} height={168} className="h-10 w-auto" />
            <p className="mt-4 text-sm">{ESCOLA.slogan}.</p>
            <a href={ENSINO_DISTANCIA} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-lima hover:text-white">
              <MonitorPlay size={16} /> Ensino à distância
            </a>
          </div>

          <ul className="space-y-2 text-sm">
            {MENU.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
            ))}
          </ul>

          <ul className="space-y-3 text-sm">
            {ESCOLA.telefones.map((t) => (
              <li key={t.link} className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> <a href={`tel:${t.link}`} className="hover:text-white">{t.texto}</a></li>
            ))}
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" /> <a href={`mailto:${ESCOLA.email}`} className="hover:text-white break-all">{ESCOLA.email}</a></li>
            {ESCOLA.morada && (
              <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> <span>{ESCOLA.morada}<br />{ESCOLA.codigoPostal}</span></li>
            )}
            <li className="flex gap-2">
              <Clock size={16} className="mt-0.5 shrink-0" />
              <span>{HORARIO.map((h) => <span key={h.dias} className="block">{h.dias}: {h.horas}</span>)}</span>
            </li>
          </ul>
        </div>
        <div className="border-t border-white/10">
          <p className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-xs">
            © {new Date().getFullYear()} {ESCOLA.nomeCompleto}
          </p>
        </div>
      </footer>

      {/* Botão flutuante do WhatsApp */}
      <a
        href={linkWhatsApp('Olá! Gostava de mais informações sobre a carta de condução.')}
        target="_blank"
        rel="noopener"
        aria-label="Falar pelo WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid place-items-center size-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 transition"
      >
        <MessageCircle size={28} />
      </a>
    </>
  )
}
