import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import { Cabecalho } from '@/components/Cabecalho'
import { Rodape } from '@/components/Rodape'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })

export const metadata: Metadata = {
  title: {
    default: 'S. Cristóvão — Escola de Condução',
    template: '%s | S. Cristóvão — Escola de Condução',
  },
  description:
    'Tira a carta com a Escola de Condução S. Cristóvão: carta em 3 meses, carta de carro e de mota, aulas de treino e renovação. Código à distância e pagamento até 10x sem juros.',
  icons: { icon: '/escola/logo-icone.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${jakarta.variable} ${bricolage.variable}`}>
      <body className="font-sans bg-white text-zinc-900 antialiased overflow-x-hidden">
        <Cabecalho />
        <main>{children}</main>
        <Rodape />
      </body>
    </html>
  )
}
