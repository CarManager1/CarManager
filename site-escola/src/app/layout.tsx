import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Anton } from 'next/font/google'
import './globals.css'
import { Cabecalho } from '@/components/Cabecalho'
import { Rodape } from '@/components/Rodape'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton' })

export const metadata: Metadata = {
  title: {
    default: 'S. Cristóvão — Escola de Condução',
    template: '%s | S. Cristóvão — Escola de Condução',
  },
  description:
    'Tira a carta com a Escola de Condução S. Cristóvão: carta em 3 meses, carta de carro e de mota, aulas de treino e renovação. Junto ao Metro Areeiro, em Lisboa.',
  icons: { icon: '/escola/logo-icone.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${jakarta.variable} ${anton.variable}`}>
      <body className="font-sans bg-white text-zinc-900 antialiased overflow-x-hidden">
        <Cabecalho />
        <main>{children}</main>
        <Rodape />
      </body>
    </html>
  )
}
