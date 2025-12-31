'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase (A mesma que usámos antes)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface OficinaData {
  nome_oficina: string
  logo_url: string
  morada: string
  codigo_postal: string
  localidade: string
  telemovel: string
  email: string
  nif: string
}

export default function CabecalhoOrcamento() {
  const [oficina, setOficina] = useState<OficinaData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOficina() {
      try {
        // Pega a primeira oficina encontrada (assumindo que só há uma, a sua)
        const { data, error } = await supabase
          .from('oficinas')
          .select('*')
          .limit(1)
          .single()

        if (data) {
          setOficina(data)
        }
      } catch (error) {
        console.error('Erro ao buscar oficina:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOficina()
  }, [])

  if (loading) return <div className="h-24 bg-gray-50 animate-pulse rounded-lg"></div>
  
  if (!oficina) return <div className="text-red-500">Dados da oficina não configurados.</div>

  return (
    <div className="flex justify-between items-start border-b pb-6 mb-6">
      {/* LADO ESQUERDO: LOGÓTIPO */}
      <div className="w-1/2">
        {oficina.logo_url ? (
          /* Ajuste o 'h-20' para mudar o tamanho do logótipo */
          <img 
            src={oficina.logo_url} 
            alt="Logótipo Oficina" 
            className="h-24 object-contain" 
          />
        ) : (
          <h1 className="text-3xl font-bold text-gray-900">{oficina.nome_oficina}</h1>
        )}
      </div>

      {/* LADO DIREITO: DADOS E CONTACTOS */}
      <div className="w-1/2 text-right text-sm text-gray-600 space-y-1">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{oficina.nome_oficina}</h2>
        <p>{oficina.morada}</p>
        <p>{oficina.codigo_postal} {oficina.localidade}</p>
        <p className="pt-2"><strong>NIF:</strong> {oficina.nif}</p>
        <p><strong>Tel:</strong> {oficina.telemovel}</p>
        <p><strong>Email:</strong> {oficina.email}</p>
      </div>
    </div>
  )
}