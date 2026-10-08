'use client'

import { useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

// Listagens de várias páginas: são renderizadas diretamente no <body>
// para escaparem aos contentores com overflow do painel (ver globals.css).
export function AreaImpressaoLista({ children }: { children: React.ReactNode }) {
  const noCliente = useSyncExternalStore(() => () => {}, () => true, () => false)
  if (!noCliente) return null

  return createPortal(
    <div id="lista-impressao" className="hidden print:block box-border pr-px bg-white text-black text-[11px]">
      {children}
    </div>,
    document.body
  )
}
