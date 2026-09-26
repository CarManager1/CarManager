import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Cabecalho } from '@/components/Cabecalho'
import { Rodape } from '@/components/Rodape'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'S. Cristóvão — Escola de Condução',
    template: '%s | S. Cristóvão — Escola de Condução',
  },
  description:
    'Tira a carta com a Escola de Condução S. Cristóvão: ligeiros, motociclos, CAM, TCC e TVDE. Carta em 3 meses, exames no privado e pagamento até 10x sem juros.',
  icons: { icon: '/escola/logo-icone.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={`${inter.className} bg-white text-zinc-900 overflow-x-hidden`}>
        <Cabecalho />
        <main>{children}</main>
        <Rodape />
      </body>
    </html>
  )
}
