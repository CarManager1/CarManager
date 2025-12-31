'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Users, Plus, Search, Car, Phone, 
  ChevronRight, Loader2, UserPlus 
} from 'lucide-react'
import Link from 'next/link'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [termo, setTermo] = useState('')
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    async function carregarDados() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        
        const role = user.user_metadata?.role || 'owner'
        setUserRole(role)

        let oficinaId = null

        // Lógica de descoberta da Oficina
        if (role === 'mechanic') {
          const { data: mec } = await supabase.from('mecanicos').select('workshop_id').eq('email', user.email).single()
          oficinaId = mec?.workshop_id
        } else {
          const { data: ofi } = await supabase.from('oficinas').select('id').eq('user_id', user.id).single()
          oficinaId = ofi?.id
        }

        if (oficinaId) {
          const { data } = await supabase
            .from('clients')
            .select('*, vehicles(*)')
            .eq('workshop_id', oficinaId)
            .order('nome', { ascending: true })
          setClientes(data || [])
        }
      } catch (err) {
        console.error("Erro ao carregar clientes:", err)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  const filtrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(termo.toLowerCase()) || 
    c.nif?.includes(termo)
  )

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-zinc-900" /></div>

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 uppercase flex items-center gap-3">
            <Users className="text-blue-600"/> Clientes
          </h1>
          <p className="text-zinc-500 font-medium">Base de dados da oficina</p>
        </div>
        
        {userRole !== 'mechanic' && (
          <Link href="/dashboard/clientes/novo" className="bg-zinc-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
            <UserPlus size={20}/> Novo Cliente
          </Link>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-4 text-zinc-400" size={20}/>
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou NIF..." 
          className="w-full pl-12 p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-zinc-900 transition-all font-medium"
          value={termo}
          onChange={e => setTermo(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map(cliente => (
          <Link key={cliente.id} href={`/dashboard/clientes/${cliente.id}`} className="bg-white p-6 rounded-3xl border border-zinc-200 hover:border-zinc-900 transition-all group shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-900 font-black text-xl group-hover:bg-zinc-900 group-hover:text-white transition-colors uppercase">
                {cliente.nome[0]}
              </div>
              <ChevronRight className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
            </div>
            
            <h3 className="font-black text-lg text-zinc-900 mb-1 truncate uppercase tracking-tighter">{cliente.nome}</h3>
            <p className="text-zinc-400 text-xs font-bold mb-4 flex items-center gap-2">
              <Phone size={12}/> {cliente.telemovel || '---'}
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-50">
              {cliente.vehicles?.length > 0 ? cliente.vehicles.map((v: any) => (
                <span key={v.id} className="bg-zinc-50 text-[10px] font-black px-2 py-1 rounded-lg border border-zinc-100 uppercase flex items-center gap-1">
                  <Car size={10}/> {v.matricula}
                </span>
              )) : (
                <span className="text-[10px] text-zinc-300 font-bold uppercase italic tracking-widest">Sem viaturas</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}