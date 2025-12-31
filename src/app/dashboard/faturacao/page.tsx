'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  CreditCard, Search, Filter, Loader2, ChevronRight, CheckCircle2, XCircle, Clock
} from 'lucide-react'
import Link from 'next/link'

export default function FaturacaoPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [termo, setTermo] = useState('')

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Descobrir Oficina (Lógica igual às outras páginas)
        let wid = null
        if (user.user_metadata?.role === 'mechanic') {
           const { data: m } = await supabase.from('mecanicos').select('workshop_id').eq('email', user.email).single()
           wid = m?.workshop_id
        } else {
           const { data: o } = await supabase.from('oficinas').select('id').eq('user_id', user.id).single()
           wid = o?.id
        }

        if (wid) {
          const { data } = await supabase
            .from('invoices')
            .select('*, client:clients(nome, nif)')
            .eq('workshop_id', wid)
            .order('created_at', { ascending: false })
          setInvoices(data || [])
        }
      } catch(e) { console.error(e) } finally { setLoading(false) }
    }
    fetchInvoices()
  }, [])

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pago': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><CheckCircle2 size={12}/> Pago</span>
      case 'Anulado': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><XCircle size={12}/> Anulado</span>
      default: return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><Clock size={12}/> Pendente</span>
    }
  }

  const filtered = invoices.filter(i => 
    i.invoice_number.toLowerCase().includes(termo.toLowerCase()) ||
    i.client?.nome.toLowerCase().includes(termo.toLowerCase())
  )

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600"/></div>

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-black text-zinc-900 uppercase flex items-center gap-3">
             <CreditCard className="text-blue-600"/> Faturação
           </h1>
           <p className="text-zinc-500 font-medium">Controlo financeiro e documentos</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-4 text-zinc-400" size={20}/>
        <input 
          className="w-full pl-12 p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-600 font-bold"
          placeholder="Pesquisar nº fatura ou cliente..."
          value={termo}
          onChange={e=>setTermo(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[24px] border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                 <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400">Estado</th>
                 <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400">Nº Fatura</th>
                 <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400">Cliente</th>
                 <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400">Data</th>
                 <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 text-right">Total</th>
                 <th className="px-6 py-4"></th>
              </tr>
           </thead>
           <tbody className="divide-y divide-zinc-100">
              {filtered.map(inv => (
                 <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">{getStatusBadge(inv.status)}</td>
                    <td className="px-6 py-4 font-black text-zinc-900 text-sm">{inv.invoice_number}</td>
                    <td className="px-6 py-4">
                       <p className="font-bold text-sm text-zinc-800">{inv.client?.nome}</p>
                       <p className="text-[10px] text-zinc-400 font-mono">NIF: {inv.client?.nif || '---'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-zinc-500">{new Date(inv.issue_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-black text-zinc-900">{inv.total_gross.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right">
                       <Link href={`/dashboard/faturacao/${inv.id}`} className="inline-block p-2 text-zinc-300 hover:text-blue-600 hover:bg-white rounded-full transition-all">
                          <ChevronRight size={20}/>
                       </Link>
                    </td>
                 </tr>
              ))}
              {filtered.length === 0 && (
                 <tr><td colSpan={6} className="p-12 text-center text-zinc-400 font-bold text-sm">Sem faturas registadas.</td></tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  )
}