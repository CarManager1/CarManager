'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Scissors, X } from 'lucide-react'
import { BRAND } from '@/lib/siteData'

const LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#equipa', label: 'Equipa' },
  { href: '#faq', label: 'Dúvidas' },
  { href: '#contactos', label: 'Contactos' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-sky-950/85 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/barbearia" className="flex items-center gap-2.5 text-white">
          <span className="bg-gold-500 p-2 rounded-xl text-sky-950">
            <Scissors size={20} strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-bold">{BRAND.name}</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-sky-100/80">
          {LINKS.map(l => (
            <a key={l.href} href={l.href} className="hover:text-gold-400 transition-colors">{l.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a href="#marcar" className="bg-gold-500 text-sky-950 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gold-400 transition-colors">
            Marcar
          </a>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-sky-100"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-sky-950 border-t border-white/10 px-6 py-4 space-y-1">
          {LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setIsMenuOpen(false)} className="block py-3 font-semibold text-sky-100">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
