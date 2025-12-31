'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  ArrowLeft, Printer, CheckCircle, MapPin, Phone, Mail 
} from 'lucide-react'

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  // --- DADOS ---
  const [invoice, setInvoice] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [workshop, setWorkshop] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
       const { data: inv } = await supabase.from('invoices').select('*, client:clients(*)').eq('id', id).single()

       if(inv) {
          setInvoice(inv)
          const { data: its } = await supabase.from('invoice_items').select('*').eq('invoice_id', id)
          setItems(its || [])
          const { data: ws } = await supabase.from('oficinas').select('*').eq('id', inv.workshop_id).single()
          setWorkshop(ws)
       }
       setLoading(false)
    }
    load()
  }, [id])

  const marcarComoPago = async () => {
    if(!confirm("Confirmar pagamento desta fatura?")) return
    await supabase.from('invoices').update({ status: 'Pago' }).eq('id', id)
    setInvoice({...invoice, status: 'Pago'})
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-600 font-bold">A carregar documento...</div>

  return (
    <div className="min-h-screen bg-zinc-100 p-8 flex flex-col items-center gap-6 animate-in fade-in">
       
       {/* --- TOOLBAR (Botões) --- */}
       {/* Nota: Como o CSS esconde tudo o que não for #area-impressao, isto desaparece na impressão automaticamente */}
       <div className="w-full max-w-[210mm] bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 flex justify-between items-center print:hidden">
          <button onClick={()=>router.back()} className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-wider hover:text-zinc-900 transition-colors">
            <ArrowLeft size={16}/> Voltar
          </button>
          
          <div className="flex gap-3">
             {invoice?.status !== 'Pago' && (
                <button onClick={marcarComoPago} className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-green-700 shadow-lg shadow-green-900/10 transition-all">
                   <CheckCircle size={16}/> Registar Pagamento
                </button>
             )}
             {/* Botão simples window.print() */}
             <button onClick={() => window.print()} className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-800 shadow-lg shadow-zinc-900/10 transition-all">
                <Printer size={16}/> Imprimir Fatura
             </button>
          </div>
       </div>

       {/* --- FOLHA A4 (COM O ID MÁGICO) --- */}
       <div id="area-impressao" className="bg-white w-full max-w-[210mm] min-h-[297mm] p-12 shadow-2xl text-black relative flex flex-col justify-between">
          
          {/* MARCAS D'ÁGUA */}
          {invoice?.status === 'Pago' && (
             <div className="absolute top-12 right-12 border-[8px] border-green-600 text-green-600 font-black text-6xl px-10 py-4 opacity-20 -rotate-12 pointer-events-none select-none z-0 tracking-tighter">
                PAGO
             </div>
          )}
          {invoice?.status === 'Anulado' && (
             <div className="absolute top-12 right-12 border-[8px] border-red-600 text-red-600 font-black text-6xl px-10 py-4 opacity-20 -rotate-12 pointer-events-none select-none z-0 tracking-tighter">
                ANULADO
             </div>
          )}

          <div className="relative z-10">
             {/* CABEÇALHO */}
             <div className="flex justify-between items-start mb-12 border-b-4 border-blue-600 pb-8">
                <div>
                   <h1 className="text-2xl font-black uppercase text-zinc-900 tracking-tighter mb-2 leading-none">
                      {workshop?.nome_oficina || 'Sua Oficina'}
                   </h1>
                   <div className="text-xs text-zinc-600 space-y-1 font-medium">
                      <p className="flex items-center gap-2"><MapPin size={12} className="text-blue-600"/> {workshop?.morada}</p>
                      <p className="pl-5">{workshop?.codigo_postal} {workshop?.localidade}</p>
                      <p className="flex items-center gap-2"><Phone size={12} className="text-blue-600"/> {workshop?.telefone || workshop?.telemovel}</p>
                      <p className="flex items-center gap-2"><Mail size={12} className="text-blue-600"/> {workshop?.email_oficina}</p>
                      <p className="font-bold mt-2 text-zinc-900">NIF: {workshop?.nipc || workshop?.nif}</p>
                   </div>
                </div>
                <div className="text-right">
                   <h2 className="text-4xl font-black text-blue-600 uppercase tracking-widest mb-1">FATURA-RECIBO</h2>
                   <p className="text-xl font-bold text-zinc-900">{invoice.invoice_number}</p>
                   <div className="mt-3 text-xs text-zinc-500 font-medium">
                      <p>Emissão: <span className="text-zinc-900 font-bold">{new Date(invoice.issue_date).toLocaleDateString()}</span></p>
                      <p>Vencimento: <span className="text-zinc-900 font-bold">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'Pronto Pagamento'}</span></p>
                   </div>
                </div>
             </div>

             {/* CLIENTE */}
             <div className="mb-12 bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Dados do Cliente</h3>
                <p className="text-lg font-bold text-zinc-900">{invoice.client?.nome || 'Cliente Final'}</p>
                <p className="text-sm text-zinc-600 font-medium mt-1">NIF: {invoice.client?.nif || '999999990'}</p>
                <p className="text-sm text-zinc-600">{invoice.client?.morada}</p>
             </div>

             {/* TABELA */}
             <table className="w-full mb-12">
                <thead className="border-b-2 border-zinc-900">
                   <tr>
                      <th className="text-left py-2 text-xs font-black uppercase tracking-wider w-[50%]">Descrição</th>
                      <th className="text-center py-2 text-xs font-black uppercase tracking-wider w-[10%]">Qtd</th>
                      <th className="text-right py-2 text-xs font-black uppercase tracking-wider w-[15%]">Preço Unit.</th>
                      <th className="text-right py-2 text-xs font-black uppercase tracking-wider w-[10%]">IVA</th>
                      <th className="text-right py-2 text-xs font-black uppercase tracking-wider w-[15%]">Total</th>
                   </tr>
                </thead>
                <tbody className="text-sm">
                   {items.map((item, i) => (
                      <tr key={i} className="border-b border-zinc-100">
                         <td className="py-3 font-medium text-zinc-800">{item.description}</td>
                         <td className="py-3 text-center text-zinc-600 font-mono">{item.quantity}</td>
                         <td className="py-3 text-right text-zinc-600 font-mono">{Number(item.unit_price).toFixed(2)}€</td>
                         <td className="py-3 text-right text-zinc-600 font-mono">{item.vat_rate}%</td>
                         <td className="py-3 text-right font-bold text-zinc-900 font-mono">{Number(item.total_price).toFixed(2)}€</td>
                      </tr>
                   ))}
                </tbody>
             </table>

             {/* TOTAIS */}
             <div className="flex justify-end mb-12">
                <div className="w-72 space-y-2 bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                   <div className="flex justify-between text-sm text-zinc-600 font-medium"><span>Total Ilíquido</span><span>{invoice.total_net.toFixed(2)} €</span></div>
                   <div className="flex justify-between text-sm text-zinc-600 border-b border-zinc-200 pb-2 font-medium"><span>Total IVA</span><span>{invoice.total_vat.toFixed(2)} €</span></div>
                   <div className="flex justify-between text-2xl font-black text-blue-600 pt-2"><span>A PAGAR</span><span>{invoice.total_gross.toFixed(2)} €</span></div>
                </div>
             </div>
          </div>

          {/* RODAPÉ */}
          <div className="mt-auto pt-6 border-t border-zinc-200 grid grid-cols-2 gap-8 text-[10px] text-zinc-500 relative z-10">
             <div>
                <p className="font-bold text-zinc-900 mb-1 uppercase tracking-wider">Pagamento</p>
                <p className="font-mono mb-1">IBAN: PT50 0000 0000 0000 0000 0000 0</p>
                <p>Banco: Nome do Banco</p>
             </div>
             <div className="text-right">
                <p className="mb-1 uppercase font-bold text-zinc-400">Software Interno</p>
                <p className="mb-1">Processado por computador via <strong className="text-blue-600 font-black">CarManager</strong></p>
                <p>Este documento não serve de fatura fiscal (Modo Demonstração).</p>
             </div>
          </div>
       </div>
    </div>
  )
}