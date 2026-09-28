import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, MessageCircle, MonitorPlay } from 'lucide-react'
import { ESCOLA, MENU, CATEGORIAS, HORARIOS, ENSINO_DISTANCIA } from '@/lib/dados'
import { linkWhatsApp } from './whatsapp'

export function Rodape() {
  return (
    <>
      <footer className="bg-zinc-950 text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/escola/logo-branco.png" alt={ESCOLA.nomeCompleto} width={805} height={168} className="h-10 w-auto" />
            <p className="mt-4 text-sm">{ESCOLA.slogan}.</p>
            <div className="mt-4 flex gap-4 text-sm font-bold">
              {ESCOLA.instagram && <a href={ESCOLA.instagram} target="_blank" rel="noopener" className="hover:text-white">Instagram</a>}
              {ESCOLA.facebook && <a href={ESCOLA.facebook} target="_blank" rel="noopener" className="hover:text-white">Facebook</a>}
            </div>
          </div>

          <div>
            <p className="text-white font-black">Páginas</p>
            <ul className="mt-4 space-y-2 text-sm">
              {MENU.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
              ))}
              <li><Link href="/duvidas" className="hover:text-white">Dúvidas frequentes</Link></li>
              <li>
                <a href={ENSINO_DISTANCIA} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-lima hover:text-white">
                  <MonitorPlay size={14} /> Ensino à distância
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-white font-black">Cartas</p>
            <ul className="mt-4 space-y-2 text-sm">
              {CATEGORIAS.map((c) => (
                <li key={c.id}><Link href={`/cartas/${c.id}`} className="hover:text-white">{c.titulo} ({c.sigla})</Link></li>
              ))}
              <li><Link href="/renovacao" className="hover:text-white">Renovação de carta</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-black">Contactos</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> <span>{ESCOLA.morada}<br />{ESCOLA.codigoPostal}</span></li>
              <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> <a href={`tel:${ESCOLA.telefoneLink}`} className="hover:text-white">{ESCOLA.telefone}</a></li>
              <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" /> <a href={`mailto:${ESCOLA.email}`} className="hover:text-white break-all">{ESCOLA.email}</a></li>
              <li className="flex gap-2">
                <Clock size={16} className="mt-0.5 shrink-0" />
                <span>{HORARIOS.secretaria.map((h) => <span key={h.dias} className="block">{h.dias}: {h.horas}</span>)}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-xs">
            © {new Date().getFullYear()} {ESCOLA.nomeCompleto}. Todos os direitos reservados.
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
