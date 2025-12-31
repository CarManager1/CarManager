'use client'

import { useEffect, useState, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  MapPin, Phone, Mail, Printer, MessageCircle, CheckCircle, 
  Calendar, X, Edit2, Save, ArrowLeft, Loader2, Trash2, Plus, 
  ChevronDown, Camera, Image as ImageIcon, FileText, UploadCloud,
  Wrench, CreditCard // <--- Wrench e CreditCard importados corretamente
} from 'lucide-react'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
}

export default function QuoteDetailsPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  
  // --- ESTADOS ---
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  
  // Dados Principais
  const [quote, setQuote] = useState<any>(null)
  const [client, setClient] = useState<any>(null)
  const [vehicle, setVehicle] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [workshop, setWorkshop] = useState<any>(null)
  const [dbMechanics, setDbMechanics] = useState<any[]>([])

  // Dados de Execução (Mecânico)
  const [mechanicNotes, setMechanicNotes] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  // Modal Agendamento
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    mechanicId: '',
    notes: ''
  })

  // --- CARREGAR DADOS ---
  const fetchData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUserRole(user?.user_metadata?.role || 'owner')

      // 1. Buscar Orçamento e Relacionamentos
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .select(`*, client:clients(*), vehicle:vehicles(*), workshop:oficinas(*)`)
        .eq('id', id)
        .single()

      if (quoteError) throw quoteError

      // 2. Buscar Itens do Orçamento
      const { data: itemsData } = await supabase
        .from('quote_items')
        .select('*')
        .eq('quote_id', id)
        .order('created_at', { ascending: true })

      // 3. Buscar Mecânicos da Oficina (para o modal de agendamento)
      if (quoteData.workshop_id) {
          const { data: mecs } = await supabase
            .from('mecanicos')
            .select('*')
            .eq('workshop_id', quoteData.workshop_id)
          
          setDbMechanics(mecs || [])
          if (mecs && mecs.length > 0) {
            setScheduleForm(prev => ({ ...prev, mechanicId: mecs[0].id }))
          }
      }

      // Definir Estados
      setQuote(quoteData)
      setClient(quoteData.client)
      setVehicle(quoteData.vehicle)
      setWorkshop(quoteData.workshop)
      setItems(itemsData || [])
      
      // Carregar dados de execução existentes
      setMechanicNotes(quoteData.mechanic_notes || '')
      setPhotos(quoteData.photos || [])

    } catch (err) { 
      console.error(err) 
    } finally { 
      setLoading(false) 
    }
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  // --- CÁLCULOS FINANCEIROS ---
  const totalNet = items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unit_price)), 0)
  const vatValue = totalNet * 0.23
  const totalGross = totalNet + vatValue

  // --- AÇÕES GERAIS (Gravar, Status) ---
  const handleSaveChanges = async () => {
    setSaving(true)
    try {
        // Atualizar valor total no cabeçalho
        await supabase.from('quotes').update({ valor_total: totalNet }).eq('id', id)
        
        // Substituir itens (Apagar antigos -> Inserir novos)
        await supabase.from('quote_items').delete().eq('quote_id', id)
        
        const itemsToInsert = items.map(item => ({ 
            quote_id: id, 
            description: item.description, 
            quantity: item.quantity, 
            unit_price: item.unit_price, 
            total_price: item.quantity * item.unit_price, 
            type: item.type || 'service' 
        }))
        
        await supabase.from('quote_items').insert(itemsToInsert)
        setIsEditing(false)
        alert("Orçamento atualizado com sucesso!")
    } catch (err) { 
        alert("Erro ao gravar alterações.") 
    } finally { 
        setSaving(false) 
    }
  }

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStatus = e.target.value
      if (newStatus === 'Agendado' && quote.status !== 'Agendado') {
          setShowScheduleModal(true)
          return
      }
      
      const { error } = await supabase.from('quotes').update({ status: newStatus }).eq('id', id)
      if (!error) { 
          setQuote({ ...quote, status: newStatus })
          router.refresh() 
      }
  }

  const handleConfirmSchedule = async () => {
    if (!scheduleForm.mechanicId) return
    const { error } = await supabase.from('quotes').update({
        status: 'Agendado',
        mechanic_id: scheduleForm.mechanicId,
        schedule_date: scheduleForm.date,
        schedule_time: scheduleForm.time,
        schedule_notes: scheduleForm.notes
    }).eq('id', id)
    
    if (!error) {
        setQuote({ ...quote, status: 'Agendado' })
        setShowScheduleModal(false)
    }
  }

  // --- INTEGRAÇÃO COM FATURAÇÃO ---
  const handleEmitirFatura = async () => {
    if (!confirm("Deseja converter este orçamento numa Fatura Proforma/Interna?")) return
    setLoading(true)

    try {
        // Gerar número de fatura sequencial simples (Ano/ID)
        const invNum = `FT ${new Date().getFullYear()}/${id.substring(0,4).toUpperCase()}`

        // 1. Criar Registo na Tabela de Faturas
        const { data: inv, error: invErr } = await supabase.from('invoices').insert({
            workshop_id: workshop.id,
            client_id: client.id,
            quote_id: id,
            invoice_number: invNum,
            total_net: totalNet,
            total_vat: vatValue,
            total_gross: totalGross,
            status: 'Pendente',
            due_date: new Date().toISOString()
        }).select().single()

        if (invErr) throw invErr

        // 2. Copiar Itens para a Fatura
        const invItems = items.map(i => ({
            invoice_id: inv.id,
            description: i.description,
            quantity: i.quantity,
            unit_price: i.unit_price,
            total_price: Number(i.quantity) * Number(i.unit_price),
            vat_rate: 23
        }))
        
        const { error: itemsErr } = await supabase.from('invoice_items').insert(invItems)
        if (itemsErr) throw itemsErr

        alert("Fatura gerada com sucesso!")
        router.push(`/dashboard/faturacao/${inv.id}`)

    } catch (err: any) {
        alert("Erro ao emitir fatura: " + err.message)
        setLoading(false)
    }
  }

  // --- ÁREA DO MECÂNICO (FOTOS E NOTAS) ---
  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    
    try {
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload
      const { error: uploadError } = await supabase.storage
        .from('service-photos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from('service-photos')
        .getPublicUrl(filePath)

      // Atualizar BD
      const newPhotos = [...photos, publicUrl]
      await supabase.from('quotes').update({ photos: newPhotos }).eq('id', id)
      setPhotos(newPhotos)

    } catch (error: any) {
      alert('Erro no upload: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveNotes = async () => {
    await supabase.from('quotes').update({ mechanic_notes: mechanicNotes }).eq('id', id)
    alert("Notas guardadas no sistema.")
  }

  const handleFinishJob = async () => {
    if (!confirm("Tem a certeza que o serviço está concluído?")) return
    
    await supabase.from('quotes').update({ 
        mechanic_notes: mechanicNotes,
        status: 'Concluído'
    }).eq('id', id)
    
    setQuote({ ...quote, status: 'Concluído' })
    alert("Serviço marcado como CONCLUÍDO!")
    router.push('/dashboard/agenda')
  }

  // --- HELPERS VISUAIS ---
  const getStatusColor = (s: string) => {
      if(s === 'Agendado') return 'bg-blue-100 text-blue-700 border-blue-200'
      if(s === 'Aprovado') return 'bg-green-100 text-green-700 border-green-200'
      if(s === 'Concluído') return 'bg-zinc-800 text-white border-zinc-900'
      if(s === 'Cancelado') return 'bg-red-50 text-red-700 border-red-200'
      return 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }

  const handleUpdateItem = (i: number, f: string, v: any) => { const n = [...items]; n[i][f] = v; setItems(n) }
  const handleRemoveItem = (i: number) => { setItems(items.filter((_, idx) => idx !== i)) }
  const handleAddItem = () => { setItems([...items, { description: "", quantity: 1, unit_price: 0, total_price: 0, type: 'service' }]) }

  if (loading) return <div className="flex h-screen items-center justify-center gap-2 text-blue-600"><Loader2 className="animate-spin"/></div>

  return (
    <div className="min-h-screen bg-zinc-50 p-8 flex flex-col items-center gap-6 relative animate-in fade-in">
      
      {/* MODAL AGENDAR */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
            <h3 className="text-xl font-black uppercase text-zinc-900 mb-4">Agendar Serviço</h3>
            <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Data</label>
                   <input type="date" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-bold outline-none focus:border-blue-500" value={scheduleForm.date} onChange={e=>setScheduleForm({...scheduleForm, date:e.target.value})}/>
                </div>
                <div>
                   <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Hora</label>
                   <input type="time" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-bold outline-none focus:border-blue-500" value={scheduleForm.time} onChange={e=>setScheduleForm({...scheduleForm, time:e.target.value})}/>
                </div>
                <div>
                   <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Mecânico</label>
                   <select className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-bold outline-none focus:border-blue-500" value={scheduleForm.mechanicId} onChange={e=>setScheduleForm({...scheduleForm, mechanicId:e.target.value})}>
                      {dbMechanics.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                   </select>
                </div>
                <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowScheduleModal(false)} className="flex-1 text-zinc-500 font-bold p-3 hover:bg-zinc-50 rounded-xl">Cancelar</button>
                    <button onClick={handleConfirmSchedule} className="flex-1 bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Confirmar</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* BARRA DE FERRAMENTAS SUPERIOR */}
      <div className="w-full max-w-[210mm] bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div className="flex items-center gap-2 w-full md:w-auto">
            <button onClick={() => router.back()} className="p-2.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all"><ArrowLeft size={20}/></button>
            
            {/* Botão de Edição (Apenas se não for mecânico ou se tiver permissão) */}
            {isEditing ? (
                <button onClick={handleSaveChanges} disabled={saving} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all">
                    {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Gravar
                </button>
            ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">
                    <Edit2 size={16}/> Editar
                </button>
            )}
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Seletor de Estado */}
            <div className="relative group">
                <select 
                    value={quote?.status || 'Rascunho'}
                    onChange={handleStatusChange}
                    disabled={userRole === 'mechanic'}
                    className={`appearance-none pl-4 pr-10 py-2.5 rounded-xl text-xs font-black uppercase border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 transition-all ${getStatusColor(quote?.status)} ${userRole === 'mechanic' ? 'opacity-80 pointer-events-none' : ''}`}
                >
                    <option value="Rascunho">Rascunho</option>
                    <option value="Por Aprovar">Por Aprovar</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Agendado">Agendado</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"/>
            </div>

            {/* Botão de Faturação (Só Dono) */}
            {userRole !== 'mechanic' && (
               <button onClick={handleEmitirFatura} className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 text-sm font-bold transition-all hover:scale-105 active:scale-95">
                  <CreditCard size={16}/> Faturar
               </button>
            )}

            <div className="w-px h-6 bg-zinc-200 mx-1 hidden md:block"></div>
            
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl hover:bg-zinc-800 shadow-md text-sm font-bold transition-all hover:scale-105 active:scale-95">
                <Printer size={16}/> <span className="hidden md:inline">Imprimir</span>
            </button>
        </div>
      </div>

      {/* --- DOCUMENTO A4 (ORÇAMENTO/RELATÓRIO) --- */}
      <div id="area-impressao" className="bg-white text-black shadow-2xl w-full max-w-[210mm] min-h-[297mm] p-12 relative flex flex-col justify-between">
        
        {/* Marca d'água de Concluído */}
        {quote?.status === 'Concluído' && (
            <div className="absolute top-12 right-12 border-[8px] border-zinc-900 text-zinc-900 font-black text-6xl px-10 py-4 opacity-10 -rotate-12 pointer-events-none select-none z-0 tracking-tighter">
                CONCLUÍDO
            </div>
        )}

        <div className="relative z-10">
          {/* Cabeçalho do Documento */}
          <div className="flex justify-between items-start mb-10">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tight mb-4 leading-none">
                    {workshop?.nome_oficina || "OFICINA AUTO"}
                </h1>
                <div className="text-sm text-zinc-600 space-y-1.5 font-medium">
                    <p className="flex items-center gap-2"><MapPin size={14} className="text-blue-600"/> {workshop?.morada}</p>
                    <p className="flex items-center gap-2"><Phone size={14} className="text-blue-600"/> {workshop?.telefone || workshop?.telemovel}</p>
                    <p className="font-bold mt-2 text-zinc-900 bg-zinc-100 w-fit px-2 py-0.5 rounded">NIF: {workshop?.nif || workshop?.nipc}</p>
                </div>
            </div>
            <div className="text-right">
                <h2 className="text-4xl font-black text-zinc-900 uppercase tracking-widest mb-1">ORÇAMENTO</h2>
                <p className="text-blue-600 font-bold text-xl mb-3">#{id.toString().substring(0,8).toUpperCase()}</p>
                <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                    <p>Data: <span className="text-zinc-900">{new Date(quote?.created_at).toLocaleDateString()}</span></p>
                </div>
            </div>
          </div>
          
          <div className="w-full h-1 bg-blue-600 mb-10"></div>
          
          {/* Info Cliente e Viatura */}
          <div className="grid grid-cols-2 gap-12 mb-12">
             <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4 pb-1 border-b border-blue-100">Cliente</h3>
                <p className="text-xl font-bold text-zinc-900 mb-2">{client?.nome}</p>
                <div className="text-sm text-zinc-600 space-y-1">
                    <p><span className="font-bold text-zinc-400 uppercase text-xs">NIF:</span> {client?.nif}</p>
                    <p><span className="font-bold text-zinc-400 uppercase text-xs">Tel:</span> {client?.telemovel}</p>
                </div>
             </div>
             <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4 pb-1 border-b border-blue-100">Viatura</h3>
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-zinc-900 text-white px-2 py-1 rounded font-mono font-bold text-sm">{vehicle?.matricula}</span>
                    <span className="font-bold text-zinc-900">{vehicle?.marca}</span>
                </div>
                <div className="text-sm text-zinc-600">
                    <p><span className="font-bold text-zinc-400 uppercase text-xs">VIN:</span> {vehicle?.vin || '---'}</p>
                    <p><span className="font-bold text-zinc-400 uppercase text-xs">Modelo:</span> {vehicle?.modelo}</p>
                </div>
             </div>
          </div>

          {/* Tabela de Itens */}
          <table className="w-full mb-8">
            <thead>
                <tr className="border-b-2 border-zinc-900">
                    <th className="text-left py-3 text-xs font-black uppercase text-zinc-900 w-[50%] tracking-wider">Descrição</th>
                    <th className="text-center py-3 text-xs font-black uppercase text-zinc-900 w-[10%] tracking-wider">Qtd</th>
                    <th className="text-right py-3 text-xs font-black uppercase text-zinc-900 w-[20%] tracking-wider">Unitário</th>
                    <th className="text-right py-3 text-xs font-black uppercase text-zinc-900 w-[20%] tracking-wider">Total</th>
                    {isEditing && <th className="w-[5%] print:hidden"></th>}
                </tr>
            </thead>
            <tbody className="text-sm">
                {items.map((item, idx) => (
                   <tr key={idx} className="border-b border-zinc-100 group hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 pr-2 align-middle">
                          {isEditing ? (
                              <input className="w-full bg-zinc-50 p-2 rounded-lg border border-zinc-200 outline-none focus:border-blue-500 font-medium" value={item.description} onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}/>
                          ) : (
                              <span className="font-bold text-zinc-700">{item.description}</span>
                          )}
                      </td>
                      <td className="py-3 text-center align-middle">
                          {isEditing ? (
                              <input type="number" className="w-full text-center bg-zinc-50 p-2 rounded-lg border border-zinc-200 outline-none focus:border-blue-500 font-bold" value={item.quantity} onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)}/>
                          ) : (
                              <span className="text-zinc-600 font-medium">{item.quantity}</span>
                          )}
                      </td>
                      <td className="py-3 text-right align-middle">
                          {isEditing ? (
                              <input type="number" className="w-full text-right bg-zinc-50 p-2 rounded-lg border border-zinc-200 outline-none focus:border-blue-500 font-mono" value={item.unit_price} onChange={(e) => handleUpdateItem(idx, 'unit_price', e.target.value)}/>
                          ) : (
                              <span className="font-mono text-zinc-600">{Number(item.unit_price).toFixed(2)} €</span>
                          )}
                      </td>
                      <td className="py-3 text-right font-black text-zinc-900 align-middle font-mono">
                          {(Number(item.quantity) * Number(item.unit_price)).toFixed(2)} €
                      </td>
                      {isEditing && (
                          <td className="print:hidden pl-2 text-center align-middle">
                              <button onClick={() => handleRemoveItem(idx)} className="text-zinc-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                          </td>
                      )}
                   </tr>
                ))}
            </tbody>
          </table>

          {/* Botão Adicionar Linha (Edição) */}
          {isEditing && (
              <button onClick={handleAddItem} className="print:hidden mb-8 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-100 w-fit transition-colors">
                  <Plus size={14}/> Adicionar Linha
              </button>
          )}

          {/* Totais */}
          <div className="flex justify-end mb-12">
             <div className="w-72 bg-zinc-50 p-6 rounded-2xl border border-zinc-100 space-y-3">
                <div className="flex justify-between text-sm text-zinc-600 font-medium"><span>Total Ilíquido</span><span>{totalNet.toFixed(2)} €</span></div>
                <div className="flex justify-between text-sm text-zinc-600 border-b border-zinc-200 pb-3 font-medium"><span>IVA (23%)</span><span>{vatValue.toFixed(2)} €</span></div>
                <div className="flex justify-between text-2xl font-black text-blue-600 pt-1"><span>Total</span><span>{totalGross.toFixed(2)} €</span></div>
             </div>
          </div>
          
          {/* RELATÓRIO TÉCNICO E FOTOS (Visível na impressão se houver conteúdo) */}
          {(mechanicNotes || photos.length > 0) && (
              <div className="mt-8 pt-8 border-t border-zinc-200 break-inside-avoid">
                 <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <FileText size={16} className="text-blue-600"/> Relatório Técnico & Fotos
                 </h3>
                 
                 {mechanicNotes && (
                     <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100 mb-6 text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                        {mechanicNotes}
                     </div>
                 )}
    
                 {photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                       {photos.map((url, i) => (
                          <div key={i} className="aspect-square rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50">
                             <img src={url} alt="Registo fotográfico" className="w-full h-full object-cover"/>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
          )}
        </div>

        {/* Rodapé do Documento */}
        <div className="mt-auto pt-8 border-t border-zinc-200 grid grid-cols-2 gap-8 text-[10px] text-zinc-500 relative z-10">
            <div>
                <p className="font-bold text-zinc-900 mb-1 uppercase tracking-wider">Dados Bancários</p>
                <p className="font-mono">IBAN: PT50 0000 0000 0000 0000 0000 0</p>
                <p>Banco: Nome do Banco</p>
            </div>
            <div className="text-right">
                <p className="mb-1 uppercase font-bold text-zinc-400">Software Certificado</p>
                <p>Processado por <strong className="text-blue-600 font-black">CarManager</strong></p>
            </div>
        </div>
      </div>

      {/* --- ÁREA DE EXECUÇÃO (PAINEL DO MECÂNICO) --- */}
      {/* Esta área é fundamental para o fluxo de trabalho mas não aparece na impressão */}
      <div className="w-full max-w-[210mm] bg-zinc-900 text-white p-8 rounded-3xl shadow-xl border border-zinc-800 print:hidden mb-12 relative overflow-hidden">
         {/* Brilho de fundo */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-[120px] opacity-20 pointer-events-none"></div>

         <div className="relative z-10">
             <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-900/50"><Wrench size={24} className="text-white"/></div>
                <div>
                   <h2 className="text-2xl font-black uppercase tracking-tight italic">Área de Execução</h2>
                   <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Painel Técnico do Mecânico</p>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-10">
                {/* Coluna Notas */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block pl-1">Observações Técnicas</label>
                   <textarea 
                      className="w-full h-40 bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500 focus:bg-zinc-800 outline-none transition-all resize-none leading-relaxed"
                      placeholder="Descreva o serviço efetuado, anomalias encontradas ou notas importantes..."
                      value={mechanicNotes}
                      onChange={e => setMechanicNotes(e.target.value)}
                   />
                   <div className="flex justify-end">
                       <button onClick={handleSaveNotes} className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-lg transition-colors">
                           <Save size={14}/> Guardar Rascunho
                       </button>
                   </div>
                </div>

                {/* Coluna Fotos */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block pl-1">Galeria Multimédia</label>
                   
                   <div className="grid grid-cols-3 gap-4">
                      {photos.map((url, i) => (
                          <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-zinc-700 relative group cursor-pointer">
                              <img src={url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"/>
                          </div>
                      ))}
                      
                      {/* Botão Upload Estilizado */}
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-zinc-700 hover:border-blue-500 hover:bg-blue-600/10 transition-all cursor-pointer flex flex-col items-center justify-center text-zinc-500 hover:text-blue-500 group">
                          {uploading ? <Loader2 className="animate-spin text-blue-500"/> : <Camera size={28} className="group-hover:scale-110 transition-transform"/>}
                          <span className="text-[9px] font-black mt-3 uppercase tracking-widest">{uploading ? 'A enviar...' : 'Adicionar'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleUploadPhoto} disabled={uploading}/>
                      </label>
                   </div>
                </div>
             </div>

             <div className="mt-10 pt-8 border-t border-zinc-800 flex justify-between items-center">
                <p className="text-xs text-zinc-500 font-medium flex items-center gap-2">
                    <CheckCircle size={14}/>
                    Todas as alterações são registadas no histórico.
                </p>
                <button 
                   onClick={handleFinishJob}
                   className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-green-900/20 flex items-center gap-3 hover:scale-105 transition-all active:scale-95"
                >
                   <CheckCircle size={20}/> Finalizar Serviço
                </button>
             </div>
         </div>
      </div>

    </div>
  )
}