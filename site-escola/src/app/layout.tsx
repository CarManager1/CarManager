import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Cabecalho } from '@/components/Cabecalho'
import { Rodape } from '@/components/Rodape'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })

export const metadata: Metadata = {
  title: {
    default: 'S. Cristóvão — Escola de Condução',
    template: '%s | S. Cristóvão — Escola de Condução',
  },
  description:
    'Tira a carta com a Escola de Condução S. Cristóvão: ligeiros, motociclos, CAM, TCC e TVDE. Código à distância, pagamento até 10x sem juros e renovação de carta na hora.',
  icons: { icon: '/escola/logo-icone.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={jakarta.variable}>
      <body className="font-sans bg-white text-zinc-900 antialiased overflow-x-hidden">
        <Cabecalho />
        <main>{children}</main>
        <Rodape />
      </body>
    </html>
  )
}
