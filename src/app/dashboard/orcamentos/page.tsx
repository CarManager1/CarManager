'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  FileText, Search, Plus, Filter, 
  ChevronRight, Loader2, Tag, Calendar
} from 'lucide-react'
import Link from 'next/link'

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [termo, setTermo] = useState('')

  useEffect(() => {
    async function carregarDados() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        
        const role = user.user_metadata?.role || 'owner'
        setUserRole(role)

        let oficinaId = null
        if (role === 'mechanic') {
          const { data: mec } = await supabase.from('mecanicos').select('workshop_id').eq('email', user.email).single()
          oficinaId = mec?.workshop_id
        } else {
          const { data: ofi } = await supabase.from('oficinas').select('id').eq('user_id', user.id).single()
          oficinaId = ofi?.id
        }

        if (oficinaId) {
          const { data } = await supabase
            .from('quotes')
            .select('*, client:clients(nome), vehicle:vehicles(matricula, marca)')
            .eq('workshop_id', oficinaId)
            .order('created_at', { ascending: false })
          setOrcamentos(data || [])
        }
      } catch (err) {
        console.error("Erro ao carregar orçamentos:", err)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  const filtrados = orcamentos.filter(o => 
    o.client?.nome.toLowerCase().includes(termo.toLowerCase()) || 
    o.vehicle?.matricula.toLowerCase().includes(termo.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-700'
      case 'Aprovado': return 'bg-green-100 text-green-700'
      case 'Concluído': return 'bg-zinc-100 text-zinc-900'
      case 'Cancelado': return 'bg-blue-100 text-blue-700'
      default: return 'bg-yellow-100 text-yellow-700'
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-zinc-900" /></div>

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 uppercase flex items-center gap-3">
            <FileText className="text-blue-600"/> Orçamentos
          </h1>
          <p className="text-zinc-500 font-medium">Histórico de serviços da oficina</p>
        </div>
        
        {userRole !== 'mechanic' && (
          <Link href="/dashboard/orcamentos/novo" className="bg-zinc-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
            <Plus size={20}/> Novo Orçamento
          </Link>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-4 text-zinc-400" size={20}/>
        <input 
          type="text" 
          placeholder="Pesquisar por cliente ou matrícula..." 
          className="w-full pl-12 p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-zinc-900 transition-all font-medium"
          value={termo}
          onChange={e => setTermo(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Estado</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">ID</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Cliente / Viatura</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Valor</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtrados.map(o => (
              <tr key={o.id} onClick={() => Link} className="hover:bg-zinc-50 transition-colors cursor-pointer group">
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${getStatusColor(o.status)}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs font-bold text-zinc-400">
                  #{o.id.toString().padStart(5, '0')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-black text-zinc-900 text-sm uppercase tracking-tighter">{o.client?.nome || '---'}</span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">{o.vehicle?.marca} • {o.vehicle?.matricula}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-black text-zinc-900">{(o.valor_total || 0).toFixed(2)} €</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/dashboard/orcamentos/${o.id}`} className="inline-flex p-2 text-zinc-300 group-hover:text-zinc-900">
                    <ChevronRight size={20}/>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}