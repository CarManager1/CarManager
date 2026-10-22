'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { BRAND, HERO_SLIDES } from '@/lib/siteData'

const INTERVALO_MS = 6000

export default function HeroSlideshow() {
  const [ativo, setAtivo] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setAtivo(a => (a + 1) % HERO_SLIDES.length), INTERVALO_MS)
    return () => clearInterval(id)
  }, [])

  const [inicio, fim] = BRAND.tagline.split(',')

  return (
    <section id="topo" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {HERO_SLIDES.map((s, i) => (
        <Image
          key={s.src}
          src={s.src}
          alt={s.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${i === ativo ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/70 via-sky-950/50 to-sky-950" />

      <div className="relative max-w-4xl mx-auto px-6 pt-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold uppercase tracking-widest border border-gold-500/30">
          <Star size={14} className="fill-gold-400" /> Desde {BRAND.since} em Lisboa
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05]">
          {inicio},<br />
          <span className="text-gold-400 italic">{fim?.trim()}</span>
        </h1>
        <p className="text-lg md:text-xl text-sky-100/80 max-w-2xl mx-auto leading-relaxed">
          {BRAND.description} Escolha o serviço, o barbeiro e a hora — a marcação demora menos de um minuto.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#marcar" className="w-full sm:w-auto px-8 py-4 bg-gold-500 text-sky-950 rounded-3xl font-bold text-lg hover:bg-gold-400 transition-colors">
            Marcar agora
          </a>
          <a href="#servicos" className="w-full sm:w-auto px-8 py-4 border border-white/25 text-white rounded-3xl font-semibold text-lg hover:border-gold-400 transition-colors">
            Ver preços
          </a>
        </div>

        <div className="flex justify-center gap-2 pt-6">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.src}
              onClick={() => setAtivo(i)}
              aria-label={`Mostrar imagem ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === ativo ? 'w-8 bg-gold-500' : 'w-3 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
