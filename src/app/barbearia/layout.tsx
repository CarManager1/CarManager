import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import { BRAND } from '@/lib/siteData'

// Tipografia "display" usada nos títulos (classe font-display)
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: `${BRAND.name} | Barbearia`,
  description: `${BRAND.tagline} Marque o seu corte online.`,
}

export default function BarbeariaLayout({ children }: { children: React.ReactNode }) {
  return <div className={playfair.variable}>{children}</div>
}
