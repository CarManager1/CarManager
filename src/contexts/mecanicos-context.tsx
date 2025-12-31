'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// --- TIPOS ---
type Cor = {
  nome: string
  bg: string
  border: string
  text: string
  dot: string
}

export type Mecanico = {
  id: string
  nome: string
  email: string
  telefone: string
  perfil: string
  cor: Cor
}

// --- CORES DISPONÍVEIS ---
export const PALETA_CORES: Cor[] = [
  { nome: 'Azul', bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-800', dot: 'bg-blue-500' },
  { nome: 'Roxo', bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-800', dot: 'bg-purple-500' },
  { nome: 'Laranja', bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-800', dot: 'bg-orange-500' },
  { nome: 'Verde', bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-800', dot: 'bg-green-500' },
  { nome: 'Vermelho', bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-800', dot: 'bg-red-500' },
  { nome: 'Cinza', bg: 'bg-zinc-100', border: 'border-zinc-200', text: 'text-zinc-800', dot: 'bg-zinc-500' },
  { nome: 'Rosa', bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-800', dot: 'bg-pink-500' },
  { nome: 'Amarelo', bg: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  { nome: 'Ciano', bg: 'bg-cyan-100', border: 'border-cyan-200', text: 'text-cyan-800', dot: 'bg-cyan-500' },
  { nome: 'Esmeralda', bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  { nome: 'Indigo', bg: 'bg-indigo-100', border: 'border-indigo-200', text: 'text-indigo-800', dot: 'bg-indigo-500' },
  { nome: 'Lima', bg: 'bg-lime-100', border: 'border-lime-200', text: 'text-lime-800', dot: 'bg-lime-500' },
]

// --- AQUI ESTAVA O ERRO: AGORA INICIA VAZIO ---
const DADOS_INICIAIS: Mecanico[] = [] 

type ContextType = {
  mecanicos: Mecanico[]
  adicionarMecanico: (m: Mecanico) => void
  removerMecanico: (id: string) => void
}

const MecanicosContext = createContext<ContextType | undefined>(undefined)

export function MecanicosProvider({ children }: { children: React.ReactNode }) {
  // Inicia com vazio
  const [mecanicos, setMecanicos] = useState<Mecanico[]>(DADOS_INICIAIS)
  const [carregado, setCarregado] = useState(false)

  // 1. Carregar do LocalStorage ao iniciar (para persistir os que criares)
  useEffect(() => {
    const saved = localStorage.getItem('mecanicos_db_v2') // Mudei a chave para 'v2' para forçar limpeza da cache antiga
    if (saved) {
      setMecanicos(JSON.parse(saved))
    }
    setCarregado(true)
  }, [])

  // 2. Salvar no LocalStorage sempre que muda
  useEffect(() => {
    if (carregado) {
      localStorage.setItem('mecanicos_db_v2', JSON.stringify(mecanicos))
    }
  }, [mecanicos, carregado])

  const adicionarMecanico = (novo: Mecanico) => {
    setMecanicos(prev => [...prev, novo])
  }

  const removerMecanico = (id: string) => {
    setMecanicos(prev => prev.filter(m => m.id !== id))
  }

  return (
    <MecanicosContext.Provider value={{ mecanicos, adicionarMecanico, removerMecanico }}>
      {children}
    </MecanicosContext.Provider>
  )
}

export const useMecanicos = () => {
  const context = useContext(MecanicosContext)
  if (!context) throw new Error('useMecanicos deve ser usado dentro de MecanicosProvider')
  return context
}