'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, MonitorPlay } from 'lucide-react'
import { ESCOLA, MENU, ENSINO_DISTANCIA } from '@/lib/dados'

export function Cabecalho() {
  const [aberto, setAberto] = useState(false)
  const caminho = usePathname()

  const ativo = (href: string) => (href === '/' ? caminho === '/' : caminho.startsWith(href))

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        <Link href="/" aria-label="Início" onClick={() => setAberto(false)}>
          <Image src="/escola/logo.png" alt={ESCOLA.nomeCompleto} width={805} height={168} priority className="h-10 w-auto" />
        </Link>

        <div className="hidden xl:flex items-center gap-1 text-sm font-bold">
          {MENU.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-full transition-colors ${
                ativo(l.href) ? 'bg-sky-50 text-sky-700' : 'text-zinc-600 hover:text-sky-600'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-2">
          <a
            href={ENSINO_DISTANCIA}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 border-2 border-sky-600 text-sky-700 px-4 py-2 rounded-full text-sm font-black hover:bg-sky-50 transition"
          >
            <MonitorPlay size={16} /> Ensino à distância
          </a>
          <Link href="/contactos" className="bg-lima text-zinc-900 px-5 py-2.5 rounded-full text-sm font-black hover:brightness-95 transition">
            Inscreve-te
          </Link>
        </div>

        <button
          onClick={() => setAberto(!aberto)}
          className="xl:hidden p-2 text-zinc-700"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
        >
          {aberto ? <X /> : <Menu />}
        </button>
      </div>

      {aberto && (
        <div className="xl:hidden bg-white border-b border-zinc-100 px-6 pb-6 pt-2 space-y-1 shadow-xl">
          {MENU.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              className={`block py-2 font-bold ${ativo(l.href) ? 'text-sky-700' : 'text-zinc-700'}`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={ENSINO_DISTANCIA}
            target="_blank"
            rel="noopener"
            className="flex items-center justify-center gap-2 mt-3 border-2 border-sky-600 text-sky-700 py-3 rounded-xl font-black"
          >
            <MonitorPlay size={18} /> Ensino à distância
          </a>
          <Link
            href="/contactos"
            onClick={() => setAberto(false)}
            className="block mt-2 text-center bg-lima text-zinc-900 py-3 rounded-xl font-black"
          >
            Inscreve-te
          </Link>
        </div>
      )}
    </nav>
  )
}
