import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MecanicosProvider } from '@/contexts/mecanicos-context' // <--- IMPORTANTE

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RE-VISION Oficina',
  description: 'Software de Gestão de Oficina',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        {/* Envolvemos a app toda no Provider para partilhar os dados dos mecânicos */}
        <MecanicosProvider>
          {children}
        </MecanicosProvider>
      </body>
    </html>
  )
}