'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { ESCOLA } from './dados'

const LINKS = [
  { href: '#cartas', label: 'Cartas' },
  { href: '#planos', label: 'Planos' },
  { href: '#renovacao', label: 'Renovação' },
  { href: '#codigo', label: 'Código' },
  { href: '#duvidas', label: 'Dúvidas' },
  { href: '#contactos', label: 'Contactos' },
]

export function MenuEscola() {
  const [aberto, setAberto] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        <a href="#inicio" aria-label="Início">
          <Image src="/escola/logo.png" alt={ESCOLA.nomeCompleto} width={805} height={168} priority className="h-10 w-auto" />
        </a>

        <div className="hidden lg:flex items-center gap-7 text-sm font-bold text-zinc-600">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-sky-600 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a href={`tel:${ESCOLA.telefoneLink}`} className="flex items-center gap-2 text-sm font-bold text-zinc-700 hover:text-sky-600">
            <Phone size={16} /> {ESCOLA.telefone}
          </a>
          <a href="#contactos" className="bg-[#C8F31D] text-zinc-900 px-5 py-2.5 rounded-full text-sm font-black hover:brightness-95 transition">
            Inscreve-te
          </a>
        </div>

        <button
          onClick={() => setAberto(!aberto)}
          className="lg:hidden p-2 text-zinc-700"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
        >
          {aberto ? <X /> : <Menu />}
        </button>
      </div>

      {aberto && (
        <div className="lg:hidden bg-white border-b border-zinc-100 px-6 pb-6 pt-2 space-y-1 shadow-xl">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setAberto(false)} className="block py-2 font-bold text-zinc-700">
              {l.label}
            </a>
          ))}
          <a
            href="#contactos"
            onClick={() => setAberto(false)}
            className="block mt-3 text-center bg-[#C8F31D] text-zinc-900 py-3 rounded-xl font-black"
          >
            Inscreve-te
          </a>
        </div>
      )}
    </nav>
  )
}
