import Link from 'next/link'
import { Instagram, Scissors } from 'lucide-react'
import { BRAND, LOCATIONS } from '@/lib/siteData'

export default function Footer() {
  return (
    <footer className="bg-sky-950 border-t border-white/10 px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:items-center justify-between">
        <div className="flex items-center gap-2.5 text-white">
          <span className="bg-gold-500 p-2 rounded-xl text-sky-950"><Scissors size={18} /></span>
          <span className="font-display text-lg font-bold">{BRAND.name}</span>
        </div>
        <div className="text-sm text-sky-100/60 space-y-1">
          {LOCATIONS.map(l => <p key={l.id}>{l.address} · {l.phone}</p>)}
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold">
          <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sky-100/80 hover:text-gold-400">
            <Instagram size={16} /> {BRAND.instagram}
          </a>
          <Link href="/barbearia/admin" className="text-sky-100/40 hover:text-sky-100/80">Área da equipa</Link>
        </div>
      </div>
      <p className="text-center text-xs text-sky-100/40 mt-10">
        © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
      </p>
    </footer>
  )
}
