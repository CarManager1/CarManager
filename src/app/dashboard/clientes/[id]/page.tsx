'use client'

import { useEffect, useState, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  User, Phone, Mail, MapPin, Save, 
  Car, Plus, Trash2, ArrowLeft, Loader2, FileText, 
  X, CheckCircle, Clock, File, ChevronRight, TrendingUp, Calendar, AlertCircle
} from 'lucide-react'
import Link from 'next/link'

// Tipo para os params do Next.js 15
type Props = {
  params: Promise<{ id: string }>
}

export default function ClientProfilePage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()

  // --- ESTADOS ---
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [workshopId, setWorkshopId] = useState<number | null>(null)
  
  // Dados do Cliente
  const [client, setClient] = useState<any>({ nome: '', nif: '', telemovel: '', email: '', morada: '' })
  const [vehicles, setVehicles] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  
  // Estatísticas
  const [stats, setStats] = useState({ totalGasto: 0, totalOrcamentos: 0, ultimoServico: '---' })

  // Modal Viatura
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)
  const [newVehicle, setNewVehicle] = useState({ matricula: '', marca: '', modelo: '', vin: '', ano: '' })

  // --- FUNÇÃO PRINCIPAL DE DADOS ---
  const fetchData = useCallback(async () => {
    try {
      // 1. Identificar Oficina
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
          const { data: oficina } = await supabase.from('oficinas').select('id').eq('user_id', user.id).single()
          if (oficina) setWorkshopId(oficina.id)
      }

      // 2. Buscar Cliente
      const { data: clientData, error: clientError } = await supabase.from('clients').select('*').eq('id', id).single()
      if (clientError) throw clientError
      setClient(clientData)

      // 3. Buscar Viaturas
      const { data: vehiclesData } = await supabase.from('vehicles').select('*').eq('client_id', id).order('created_at', { ascending: false })
      setVehicles(vehiclesData || [])

      // 4. Buscar Histórico de Orçamentos (Com dados da viatura)
      const { data: quotesData } = await supabase
        .from('quotes')
        .select(`
          *,
          vehicle:vehicles(matricula, marca, modelo)
        `)
        .eq('client_id', id)
        .order('created_at', { ascending: false })
      
      setQuotes(quotesData || [])

      // 5. Calcular Estatísticas
      if (quotesData) {
          const totalMoney = quotesData
            .filter(q => q.status === 'Aprovado' || q.status === 'Agendado') // Só conta dinheiro "real"
            .reduce((acc, curr) => acc + (curr.valor_total || 0), 0)
          
          const lastDate = quotesData.length > 0 ? new Date(quotesData[0].created_at).toLocaleDateString('pt-PT') : 'Nunca'

          setStats({
              totalGasto: totalMoney,
              totalOrcamentos: quotesData.length,
              ultimoServico: lastDate
          })
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // --- AÇÕES: CLIENTE ---
  const handleUpdateClient = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from('clients').update({
          nome: client.nome, nif: client.nif, telemovel: client.telemovel, email: client.email, morada: client.morada
        }).eq('id', id)
      if (error) throw error
      alert("Ficha de cliente atualizada!")
    } catch (err) { alert("Erro ao gravar.") } finally { setSaving(false) }
  }

  // --- AÇÕES: VIATURAS ---
  const handleAddVehicle = async () => {
    if (!newVehicle.matricula || !newVehicle.marca) { alert("Matrícula e Marca obrigatórias."); return; }
    if (!workshopId) { alert("Erro de permissão. Recarregue a página."); return; }

    try {
      const { data, error } = await supabase.from('vehicles').insert({
          workshop_id: workshopId, client_id: id,
          matricula: newVehicle.matricula.toUpperCase(), marca: newVehicle.marca,
          modelo: newVehicle.modelo, vin: newVehicle.vin, ano: newVehicle.ano
        }).select().single()
      if (error) throw error
      
      setVehicles([data, ...vehicles])
      setIsVehicleModalOpen(false)
      setNewVehicle({ matricula: '', marca: '', modelo: '', vin: '', ano: '' })
    } catch (err: any) { alert("Erro: " + err.message) }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm("Tem a certeza? Apagar a viatura remove o histórico dela.")) return
    try {
        const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId)
        if (error) throw error
        setVehicles(vehicles.filter(v => v.id !== vehicleId))
    } catch (err) { alert("Erro ao apagar viatura.") }
  }

  // --- AÇÕES: ORÇAMENTOS ---
  const handleDeleteQuote = async (quoteId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Apagar este orçamento permanentemente?")) return
    try {
        const { error } = await supabase.from('quotes').delete().eq('id', quoteId)
        if (error) throw error
        setQuotes(quotes.filter(q => q.id !== quoteId))
        // Atualizar stats ligeiramente
        setStats(prev => ({ ...prev, totalOrcamentos: prev.totalOrcamentos - 1 }))
    } catch (err) { alert("Erro ao apagar orçamento.") }
  }

  // --- HELPER VISUAL ---
  const getStatusBadge = (status: string) => {
      const styles: any = {
          'Aprovado': 'bg-green-100 text-green-700 border-green-200',
          'Agendado': 'bg-blue-100 text-blue-700 border-blue-200',
          'Rascunho': 'bg-gray-100 text-gray-600 border-gray-200',
          'Por Aprovar': 'bg-yellow-100 text-yellow-700 border-yellow-200'
      }
      const icons: any = {
          'Aprovado': <CheckCircle size={10}/>,
          'Agendado': <Clock size={10}/>,
          'Rascunho': <File size={10}/>,
          'Por Aprovar': <AlertCircle size={10}/>
      }
      return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles[status] || styles['Rascunho']}`}>
              {icons[status] || icons['Rascunho']} {status}
          </span>
      )
  }

  if (loading) return <div className="flex h-screen items-center justify-center gap-2 text-zinc-400"><Loader2 className="animate-spin"/> A carregar ficha...</div>

  return (
    <div className="p-8 min-h-screen bg-gray-50 flex flex-col gap-8 animate-in fade-in">
      
      {/* === HEADER === */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/clientes">
            <button className="h-12 w-12 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500 hover:text-black transition-all shadow-sm hover:shadow-md">
              <ArrowLeft size={22}/>
            </button>
          </Link>
          <div>
             <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">{client.nome}</h1>
             <div className="flex items-center gap-3 mt-1">
                <span className="bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded text-xs font-mono font-bold">ID: {id}</span>
                {client.nif ? <span className="bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded text-xs font-mono font-bold">NIF: {client.nif}</span> : <span className="text-red-400 text-xs font-bold bg-red-50 px-2 py-0.5 rounded">Falta NIF</span>}
             </div>
          </div>
        </div>
        <Link href={`/dashboard/orcamentos/novo?clientId=${id}`}>
             <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-zinc-200 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                <Plus size={20}/> Novo Orçamento
             </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* === COLUNA ESQUERDA (Info + Stats) - Ocupa 4/12 === */}
        <div className="xl:col-span-4 space-y-6">
           
           {/* CARTÃO DE ESTATÍSTICAS FINANCEIRAS */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1"><TrendingUp size={14}/> Total Gasto</span>
                 <span className="text-3xl font-black text-zinc-900">{stats.totalGasto.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1"><Calendar size={14}/> Último Serviço</span>
                 <span className="text-lg font-bold text-zinc-900">{stats.ultimoServico}</span>
              </div>
           </div>

           {/* CARTÃO DE DADOS PESSOAIS */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
                 <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800"><User className="text-red-600" size={20}/> Dados do Cliente</h2>
                 <button onClick={handleUpdateClient} disabled={saving} className="text-xs font-bold bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2">
                    {saving ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>} Gravar
                 </button>
              </div>
              
              <div className="space-y-5">
                 <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Nome Completo</label>
                    <input className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-medium text-zinc-900 focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none transition-all" 
                        value={client.nome} onChange={e => setClient({...client, nome: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Telemóvel</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3.5 text-zinc-400" size={14}/>
                            <input className="w-full pl-9 p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-medium" 
                                value={client.telemovel} onChange={e => setClient({...client, telemovel: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">NIF</label>
                        <input className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-medium" 
                            value={client.nif} onChange={e => setClient({...client, nif: e.target.value})} />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-zinc-400" size={14}/>
                        <input className="w-full pl-9 p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-medium" 
                            value={client.email} onChange={e => setClient({...client, email: e.target.value})} />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Morada</label>
                    <textarea className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-medium h-28 resize-none focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none" 
                        value={client.morada} onChange={e => setClient({...client, morada: e.target.value})} />
                 </div>
              </div>
           </div>
        </div>

        {/* === COLUNA DIREITA (Garagem + Orçamentos) - Ocupa 8/12 === */}
        <div className="xl:col-span-8 space-y-8">
           
           {/* SECÇÃO GARAGEM */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900"><Car className="text-red-600" size={24}/> Garagem do Cliente</h2>
                    <p className="text-xs text-zinc-400 font-medium mt-1">Viaturas associadas e prontas para serviço.</p>
                 </div>
                 <button onClick={() => setIsVehicleModalOpen(true)} className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
                    <Plus size={16}/> Adicionar Viatura
                 </button>
              </div>

              {vehicles.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-zinc-100 rounded-2xl bg-zinc-50/50">
                    <Car size={48} className="text-zinc-200 mb-3"/>
                    <p className="text-zinc-400 font-medium text-sm">Este cliente ainda não tem viaturas.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.map(v => (
                       <div key={v.id} className="border border-zinc-200 rounded-xl p-5 hover:border-red-200 hover:shadow-md transition-all group relative bg-white">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
                                   <Car size={24}/>
                                </div>
                                <div>
                                   <span className="block font-bold text-zinc-900 text-lg">{v.marca} {v.modelo}</span>
                                   <div className="flex gap-2 mt-1">
                                      <span className="bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-zinc-700 uppercase">{v.matricula}</span>
                                      {v.ano && <span className="text-[10px] text-zinc-400 font-bold self-center">{v.ano}</span>}
                                   </div>
                                </div>
                             </div>
                             <button onClick={() => handleDeleteVehicle(v.id)} className="text-zinc-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity" title="Remover Viatura">
                                <Trash2 size={18}/>
                             </button>
                          </div>
                          
                          {v.vin && <div className="mt-3 pt-3 border-t border-zinc-50 text-[10px] text-zinc-400 font-mono">VIN: {v.vin}</div>}

                          <div className="mt-4">
                             <Link href={`/dashboard/orcamentos/novo?clientId=${id}&vehicleId=${v.id}`}>
                                <button className="w-full text-xs bg-zinc-50 border border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                                   <Plus size={12}/> Criar Orçamento
                                </button>
                             </Link>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>

           {/* SECÇÃO HISTÓRICO */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900"><FileText className="text-blue-600" size={24}/> Histórico de Orçamentos</h2>
                    <p className="text-xs text-zinc-400 font-medium mt-1">Todos os orçamentos emitidos para este cliente.</p>
                 </div>
                 <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    {quotes.length} Registos
                 </div>
              </div>

              {quotes.length === 0 ? (
                 <div className="text-center p-12 border-2 border-dashed border-zinc-100 rounded-2xl bg-zinc-50/50">
                    <FileText size={48} className="mx-auto text-zinc-200 mb-4"/>
                    <p className="text-zinc-400 font-medium text-sm">Sem histórico disponível.</p>
                 </div>
              ) : (
                 <div className="overflow-hidden rounded-xl border border-zinc-200">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-zinc-50 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                          <tr>
                             <th className="px-5 py-3">Número</th>
                             <th className="px-5 py-3">Data</th>
                             <th className="px-5 py-3">Viatura</th>
                             <th className="px-5 py-3 text-right">Valor</th>
                             <th className="px-5 py-3 text-center">Estado</th>
                             <th className="px-5 py-3 text-right">Ações</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-zinc-100 bg-white">
                          {quotes.map(q => (
                             <tr key={q.id} className="hover:bg-zinc-50 transition-colors group cursor-pointer" onClick={() => router.push(`/dashboard/orcamentos/${q.id}`)}>
                                <td className="px-5 py-4 font-mono font-bold text-zinc-700">#{q.id.toString().padStart(6, '0')}</td>
                                <td className="px-5 py-4 text-zinc-500 font-medium">{new Date(q.created_at).toLocaleDateString('pt-PT')}</td>
                                <td className="px-5 py-4">
                                   {q.vehicle ? (
                                      <div className="flex flex-col">
                                         <span className="font-bold text-zinc-800 text-xs">{q.vehicle.matricula}</span>
                                         <span className="text-[10px] text-zinc-400">{q.vehicle.marca} {q.vehicle.modelo}</span>
                                      </div>
                                   ) : <span className="text-zinc-300 italic text-xs">Viatura removida</span>}
                                </td>
                                <td className="px-5 py-4 text-right font-black text-zinc-900">{q.valor_total?.toFixed(2)} €</td>
                                <td className="px-5 py-4 text-center">
                                   {getStatusBadge(q.status)}
                                </td>
                                <td className="px-5 py-4 text-right">
                                   <div className="flex items-center justify-end gap-3">
                                      <button 
                                        onClick={(e) => handleDeleteQuote(q.id, e)} 
                                        className="text-zinc-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Apagar Orçamento"
                                      >
                                        <Trash2 size={16}/>
                                      </button>
                                      <ChevronRight size={16} className="text-zinc-400"/>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* === MODAL ADICIONAR VIATURA === */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="bg-zinc-900 p-5 flex justify-between items-center text-white">
                <h3 className="font-bold flex items-center gap-2 text-lg"><Plus size={20} className="text-green-400"/> Nova Viatura</h3>
                <button onClick={() => setIsVehicleModalOpen(false)} className="hover:text-red-400 transition-colors"><X size={20}/></button>
             </div>
             <div className="p-6 space-y-5">
                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase mb-1.5 block">Matrícula *</label>
                   <input className="w-full p-3 border border-zinc-200 rounded-xl uppercase font-mono font-bold bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none text-lg text-center tracking-widest" 
                      placeholder="AA-00-AA" autoFocus value={newVehicle.matricula} onChange={e => setNewVehicle({...newVehicle, matricula: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-1.5 block">Marca *</label>
                      <input className="w-full p-3 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none font-medium" 
                         placeholder="Ex: BMW" value={newVehicle.marca} onChange={e => setNewVehicle({...newVehicle, marca: e.target.value})} />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-1.5 block">Modelo</label>
                      <input className="w-full p-3 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none font-medium" 
                         placeholder="Ex: 320d" value={newVehicle.modelo} onChange={e => setNewVehicle({...newVehicle, modelo: e.target.value})} />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-1.5 block">Ano</label>
                      <input className="w-full p-3 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none font-medium" type="number"
                         placeholder="2024" value={newVehicle.ano} onChange={e => setNewVehicle({...newVehicle, ano: e.target.value})} />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-1.5 block">VIN</label>
                      <input className="w-full p-3 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-900 outline-none font-medium" 
                         placeholder="WBA..." value={newVehicle.vin} onChange={e => setNewVehicle({...newVehicle, vin: e.target.value})} />
                   </div>
                </div>
                
                <button onClick={handleAddVehicle} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 mt-2 transition-transform hover:scale-[1.02] active:scale-95">
                   Guardar Viatura
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  )
}