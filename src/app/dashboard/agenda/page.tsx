'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Calendar, ChevronLeft, ChevronRight, Filter, 
  Loader2, Clock, LayoutGrid, List, 
  CalendarDays, Plus, Search, X, Tag
} from 'lucide-react'

// --- TEMA E CONFIGURAÇÕES ---
const THEME = {
  primary: 'bg-blue-600',
  primaryHover: 'hover:bg-blue-700',
  secondary: 'bg-zinc-900',
  accent: 'text-blue-600',
  border: 'border-zinc-200',
  bgBody: 'bg-zinc-50'
}

// Serviços comuns para agilizar o preenchimento
const SERVICOS_RAPIDOS = [
  "Revisão Geral", "Mudança de Óleo", "Substituição de Travões", 
  "Diagnóstico", "Carregamento AC", "Pneus", "Distribuição", "IPO"
]

// --- AUXILIARES DE DATA ---
const formatarDataISO = (d: Date) => d.toISOString().split('T')[0]

const getInicioSemana = (d: Date) => {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Ajuste para Segunda-feira ser o dia 1
  return new Date(date.setDate(diff))
}

const getDiasDoMes = (d: Date) => {
  const ano = d.getFullYear()
  const mes = d.getMonth()
  const data = new Date(ano, mes, 1)
  const dias = []
  while (data.getMonth() === mes) {
    dias.push(new Date(data))
    data.setDate(data.getDate() + 1)
  }
  return dias
}

export default function AgendaPage() {
  const router = useRouter()
  
  // --- ESTADOS GLOBAIS ---
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [workshopId, setWorkshopId] = useState<number | null>(null)
  
  // --- DADOS ---
  const [mecanicos, setMecanicos] = useState<any[]>([])
  const [tarefas, setTarefas] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([]) // Para o modal de criação
  
  // --- UI ---
  const [dataAtual, setDataAtual] = useState(new Date())
  const [vista, setVista] = useState<'dia' | 'semana' | 'mes'>('dia')
  const [mecanicoFiltro, setMecanicoFiltro] = useState('todos')
  
  // --- MODAL ---
  const [modalAberto, setModalAberto] = useState(false)
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null)
  const [viaturaSelecionada, setViaturaSelecionada] = useState('')
  const [formAgendamento, setFormAgendamento] = useState({
    data: formatarDataISO(new Date()),
    hora: '09:00',
    mecanicoId: '',
    notas: ''
  })

  // --- CARREGAMENTO DE DADOS (ROBUSTO) ---
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const role = user.user_metadata?.role || 'owner'
      setUserRole(role)

      // 1. Descobrir a Oficina (Segurança Crítica)
      let idOficina = null
      if (role === 'mechanic') {
        const { data: mec } = await supabase.from('mecanicos').select('workshop_id').eq('email', user.email).single()
        idOficina = mec?.workshop_id
      } else {
        const { data: ofi } = await supabase.from('oficinas').select('id').eq('user_id', user.id).single()
        idOficina = ofi?.id
      }

      if (!idOficina) {
        console.error("Oficina não encontrada para este utilizador.")
        setLoading(false)
        return
      }
      setWorkshopId(idOficina)

      // 2. Carregar Mecânicos
      let qMecs = supabase.from('mecanicos').select('*').eq('workshop_id', idOficina).eq('status', 'Ativo')
      if (role === 'mechanic') {
        qMecs = qMecs.eq('email', user.email) // Mecânico só vê a si próprio na lista principal
      }
      const { data: mecsData } = await qMecs
      setMecanicos(mecsData || [])

      // 3. Carregar Agendamentos (Quotes)
      const { data: quotesData } = await supabase
        .from('quotes')
        .select(`
            id, schedule_date, schedule_time, schedule_notes, mechanic_id, status,
            client:clients(id, nome, telemovel),
            vehicle:vehicles(id, matricula, marca, modelo)
        `)
        .eq('workshop_id', idOficina)
        .eq('status', 'Agendado')
      
      const tarefasFormatadas = quotesData?.map(q => ({
        id: q.id,
        data: q.schedule_date,
        hora: q.schedule_time?.slice(0,5),
        // FIX: Usar "as any" para evitar erro de propriedade 'nome' no TypeScript durante o Build
        cliente: (q.client as any)?.nome || 'Desconhecido',
        telemovel: (q.client as any)?.telemovel || 'N/A',
        viatura: q.vehicle ? `${(q.vehicle as any).marca} ${(q.vehicle as any).modelo}` : 'Viatura s/ dados',
        matricula: (q.vehicle as any)?.matricula || '---',
        servico: q.schedule_notes || 'Serviço Geral',
        mecanicoId: q.mechanic_id
      })) || []
      
      setTarefas(tarefasFormatadas)

      // 4. Carregar Clientes (apenas se for dono, para criar agendamentos)
      if (role !== 'mechanic') {
        const { data: clis } = await supabase.from('clients').select('*, vehicles(*)').eq('workshop_id', idOficina)
        setClientes(clis || [])
      }

    } catch (err) {
      console.error("Erro fatal na agenda:", err)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchData() }, [fetchData])

  // --- AÇÕES ---
  const navegar = (dir: number) => {
    const nova = new Date(dataAtual)
    if (vista === 'dia') nova.setDate(nova.getDate() + dir)
    if (vista === 'semana') nova.setDate(nova.getDate() + (dir * 7))
    if (vista === 'mes') nova.setMonth(nova.getMonth() + dir)
    setDataAtual(nova)
  }

  const criarAgendamento = async () => {
    if(!clienteSelecionado || !formAgendamento.mecanicoId || !workshopId) return
    try {
      let veiculoId = null
      if(viaturaSelecionada && viaturaSelecionada !== 'nova'){
         const mat = viaturaSelecionada.split(' - ')[0]
         veiculoId = clienteSelecionado.vehicles.find((v:any) => v.matricula === mat)?.id
      }

      const { error } = await supabase.from('quotes').insert({
        workshop_id: workshopId,
        client_id: clienteSelecionado.id,
        vehicle_id: veiculoId,
        mechanic_id: formAgendamento.mecanicoId,
        schedule_date: formAgendamento.data,
        schedule_time: formAgendamento.hora,
        schedule_notes: formAgendamento.notas,
        status: 'Agendado'
      })

      if (error) throw error
      setModalAberto(false)
      fetchData() // Recarregar
    } catch(err) { alert("Erro ao agendar.") }
  }

  // --- SUB-COMPONENTES DE VISTA ---

  // 1. VISTA DIÁRIA (Colunas por Mecânico)
  const VistaDia = () => (
    <div className={`grid gap-6 ${mecanicos.length > 3 ? 'grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
      {mecanicos.filter(m => mecanicoFiltro === 'todos' || m.id === mecanicoFiltro).map(mec => {
        const tarefasDoMecanico = tarefas.filter(t => t.data === formatarDataISO(dataAtual) && t.mecanicoId === mec.id).sort((a,b) => a.hora.localeCompare(b.hora))
        const corBase = mec.cor?.replace('bg-', '')?.replace('-500', '') || 'blue'
        
        return (
          <div key={mec.id} className="bg-white rounded-[24px] shadow-sm border border-zinc-200 flex flex-col min-h-[600px] overflow-hidden">
             {/* Cabeçalho do Mecânico */}
             <div className={`p-4 border-b flex justify-between items-center bg-${corBase}-50/50`}>
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black bg-${corBase}-500 shadow-lg shadow-${corBase}-200`}>
                      {mec.nome[0].toUpperCase()}
                   </div>
                   <div>
                      <h3 className={`font-black text-sm uppercase text-${corBase}-900`}>{mec.nome}</h3>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Agenda Diária</p>
                   </div>
                </div>
                <span className="bg-white px-2 py-1 rounded-lg text-[10px] font-black border border-zinc-100">{tarefasDoMecanico.length}</span>
             </div>

             {/* Lista de Tarefas */}
             <div className="p-3 space-y-3 flex-1 bg-zinc-50/30 overflow-y-auto">
                {tarefasDoMecanico.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-zinc-300 opacity-60">
                      <Clock size={32} className="mb-2"/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Livre</span>
                   </div>
                ) : (
                   tarefasDoMecanico.map(t => (
                     <div key={t.id} onClick={() => router.push(`/dashboard/orcamentos/${t.id}`)} className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${corBase}-500`}></div>
                        <div className="flex justify-between items-start mb-2">
                           <span className="font-black text-sm text-zinc-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{t.viatura}</span>
                           <span className="text-[10px] bg-zinc-900 text-white px-1.5 py-0.5 rounded font-mono font-bold">{t.hora}</span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-bold flex items-center gap-1 mb-2"><Tag size={12}/> {t.matricula}</div>
                        <p className="text-[10px] text-zinc-400 font-medium line-clamp-2 bg-zinc-50 p-2 rounded-lg italic">{t.servico}</p>
                     </div>
                   ))
                )}
                
                {/* Botão de Agendar Rápido (Só Dono) */}
                {userRole !== 'mechanic' && (
                   <button onClick={() => { setFormAgendamento({...formAgendamento, mecanicoId: mec.id}); setModalAberto(true) }} className="w-full border-2 border-dashed border-zinc-200 rounded-xl py-3 text-zinc-300 text-[10px] font-black uppercase hover:border-blue-400 hover:text-blue-600 hover:bg-white transition-all">
                      + Slot
                   </button>
                )}
             </div>
          </div>
        )
      })}
    </div>
  )

  // 2. VISTA SEMANAL (7 Dias)
  const VistaSemana = () => {
    const inicio = getInicioSemana(dataAtual)
    const diasSemana = Array.from({length: 7}).map((_, i) => {
       const d = new Date(inicio)
       d.setDate(d.getDate() + i)
       return d
    })

    return (
      <div className="grid grid-cols-7 gap-3 min-w-[1200px] overflow-x-auto pb-4">
        {diasSemana.map((dia, idx) => {
           const diaStr = formatarDataISO(dia)
           const tarefasDia = tarefas.filter(t => t.data === diaStr && (mecanicoFiltro === 'todos' || t.mecanicoId === mecanicoFiltro))
           const isHoje = formatarDataISO(new Date()) === diaStr

           return (
             <div key={idx} className={`rounded-2xl border ${isHoje ? 'border-blue-500 bg-blue-50/20' : 'border-zinc-200 bg-white'} min-h-[500px] flex flex-col`}>
                <div className={`p-3 text-center border-b ${isHoje ? 'border-blue-200 bg-blue-100/50' : 'border-zinc-100'}`}>
                   <span className="text-[10px] font-black text-zinc-400 uppercase block">{dia.toLocaleDateString('pt-PT', {weekday: 'short'})}</span>
                   <span className={`text-xl font-black ${isHoje ? 'text-blue-600' : 'text-zinc-900'}`}>{dia.getDate()}</span>
                </div>
                <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                   {tarefasDia.map(t => (
                      <div key={t.id} onClick={() => router.push(`/dashboard/orcamentos/${t.id}`)} className="bg-white border border-zinc-100 p-2 rounded-xl shadow-sm text-left hover:border-blue-400 cursor-pointer">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-mono bg-zinc-900 text-white px-1 rounded">{t.hora}</span>
                         </div>
                         <p className="text-[10px] font-black truncate text-zinc-800">{t.viatura}</p>
                         <p className="text-[9px] text-zinc-400 truncate">{t.cliente}</p>
                      </div>
                   ))}
                </div>
             </div>
           )
        })}
      </div>
    )
  }

  // 3. VISTA MENSAL
  const VistaMes = () => {
    const dias = getDiasDoMes(dataAtual)
    const padding = new Date(dias[0]).getDay() === 0 ? 6 : new Date(dias[0]).getDay() - 1 // Padding para alinhar com Seg

    return (
       <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          {/* Cabeçalho da Semana */}
          <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50">
             {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
                <div key={d} className="py-3 text-center text-[11px] font-black text-zinc-400 uppercase tracking-widest">{d}</div>
             ))}
          </div>
          {/* Grelha */}
          <div className="grid grid-cols-7 auto-rows-[120px]">
             {Array.from({length: padding}).map((_,i) => <div key={`pad-${i}`} className="bg-zinc-50/30 border-r border-b border-zinc-100"></div>)}
             
             {dias.map(dia => {
                const diaStr = formatarDataISO(dia)
                const tarefasDia = tarefas.filter(t => t.data === diaStr && (mecanicoFiltro === 'todos' || t.mecanicoId === mecanicoFiltro))
                const isHoje = formatarDataISO(new Date()) === diaStr

                return (
                   <div key={diaStr} className={`border-r border-b border-zinc-100 p-2 transition-all hover:bg-blue-50/30 relative group ${isHoje ? 'bg-blue-50/50' : ''}`}>
                      <span className={`text-xs font-bold mb-2 block ${isHoje ? 'text-blue-600' : 'text-zinc-500'}`}>{dia.getDate()}</span>
                      <div className="space-y-1 max-h-[80px] overflow-y-auto custom-scrollbar">
                         {tarefasDia.map(t => (
                            <div key={t.id} onClick={() => router.push(`/dashboard/orcamentos/${t.id}`)} className="text-[9px] bg-white border border-zinc-200 p-1 rounded font-bold truncate text-zinc-700 hover:border-blue-400 cursor-pointer shadow-sm">
                               {t.hora} • {t.viatura}
                            </div>
                         ))}
                      </div>
                      {userRole !== 'mechanic' && (
                         <button onClick={() => { setFormAgendamento({...formAgendamento, data: diaStr}); setModalAberto(true) }} className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-1 rounded-full shadow-lg transition-all">
                            <Plus size={12}/>
                         </button>
                      )}
                   </div>
                )
             })}
          </div>
       </div>
    )
  }

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-blue-600" size={40}/></div>

  return (
    <div className="p-6 max-w-[1800px] mx-auto min-h-screen flex flex-col gap-6 animate-in fade-in">
       
       {/* HEADER PRINCIPAL */}
       <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200 flex flex-col lg:flex-row justify-between items-center gap-6 sticky top-4 z-20">
          
          {/* Navegação e Título */}
          <div className="flex items-center gap-6 w-full lg:w-auto">
             <div className="flex bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
                <button onClick={()=>navegar(-1)} className="p-2 hover:bg-white rounded-xl transition-all text-zinc-600"><ChevronLeft size={20}/></button>
                <button onClick={()=>setDataAtual(new Date())} className="px-4 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-blue-600 transition-colors">Hoje</button>
                <button onClick={()=>navegar(1)} className="p-2 hover:bg-white rounded-xl transition-all text-zinc-600"><ChevronRight size={20}/></button>
             </div>
             <div className="flex flex-col">
                <h1 className="text-2xl font-black text-zinc-900 capitalize tracking-tight leading-none">
                   {dataAtual.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                </h1>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">CarManager Agenda</span>
             </div>
          </div>

          {/* Controlos de Vista */}
          <div className="flex flex-wrap items-center justify-end gap-3 w-full lg:w-auto">
             <div className="bg-zinc-100 p-1 rounded-2xl flex border border-zinc-200">
                {[
                  { id: 'dia', label: 'Dia', icon: List },
                  { id: 'semana', label: 'Semana', icon: LayoutGrid },
                  { id: 'mes', label: 'Mês', icon: CalendarDays }
                ].map((v) => (
                  <button key={v.id} onClick={() => setVista(v.id as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${vista === v.id ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}>
                     <v.icon size={14}/> {v.label}
                  </button>
                ))}
             </div>

             {userRole !== 'mechanic' && (
                <>
                   <div className="h-8 w-px bg-zinc-200 mx-2 hidden lg:block"></div>
                   <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-2.5 rounded-2xl">
                      <Filter size={14} className="text-zinc-400"/>
                      <select value={mecanicoFiltro} onChange={e=>setMecanicoFiltro(e.target.value)} className="bg-transparent text-xs font-bold uppercase text-zinc-600 outline-none cursor-pointer">
                         <option value="todos">Toda a Equipa</option>
                         {mecanicos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                      </select>
                   </div>
                   <button onClick={() => { setFormAgendamento({...formAgendamento, data: formatarDataISO(dataAtual)}); setModalAberto(true) }} className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 hover:scale-105 active:scale-95">
                      <Plus size={16}/> Novo
                   </button>
                </>
             )}
          </div>
       </div>

       {/* ÁREA DE CONTEÚDO */}
       <div className="flex-1 overflow-x-auto">
          {vista === 'dia' && <VistaDia />}
          {vista === 'semana' && <VistaSemana />}
          {vista === 'mes' && <VistaMes />}
       </div>

       {/* MODAL DE CRIAÇÃO (Apenas para donos) */}
       {modalAberto && (
          <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
                <div className="bg-zinc-900 p-6 flex justify-between items-center text-white">
                   <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-2 rounded-xl text-white"><Calendar size={20}/></div>
                      <h2 className="font-black text-lg uppercase tracking-tight">Novo Agendamento</h2>
                   </div>
                   <button onClick={()=>setModalAberto(false)} className="hover:rotate-90 transition-transform"><X/></button>
                </div>
                
                <div className="p-8 space-y-6">
                   {/* Seleção de Cliente */}
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Cliente</label>
                      {!clienteSelecionado ? (
                         <div className="relative">
                            <Search className="absolute left-4 top-4 text-zinc-400" size={18}/>
                            <input 
                               className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 pl-12 font-bold outline-none focus:border-blue-500 transition-all" 
                               placeholder="Pesquisar nome..." 
                               value={termoPesquisa} 
                               onChange={e=>setTermoPesquisa(e.target.value)}
                            />
                            {termoPesquisa.length > 1 && (
                               <div className="absolute top-full left-0 w-full bg-white shadow-xl border border-zinc-100 mt-2 rounded-2xl z-20 max-h-48 overflow-y-auto">
                                  {clientes.filter(c => c.nome.toLowerCase().includes(termoPesquisa.toLowerCase())).map(c => (
                                     <div key={c.id} onClick={()=>{setClienteSelecionado(c); setTermoPesquisa('')}} className="p-3 hover:bg-blue-50 cursor-pointer border-b border-zinc-50">
                                        <p className="font-bold text-sm text-zinc-800">{c.nome}</p>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase">{c.telemovel}</p>
                                     </div>
                                  ))}
                               </div>
                            )}
                         </div>
                      ) : (
                         <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex justify-between items-center">
                            <div>
                               <p className="font-black text-blue-900 text-sm uppercase">{clienteSelecionado.nome}</p>
                               <p className="text-[10px] font-bold text-blue-400 uppercase">Cliente Selecionado</p>
                            </div>
                            <button onClick={()=>setClienteSelecionado(null)} className="p-2 bg-white rounded-xl text-zinc-400 hover:text-red-500"><X size={16}/></button>
                         </div>
                      )}
                   </div>

                   {/* Detalhes do Serviço */}
                   <div className={`grid grid-cols-2 gap-6 transition-all ${!clienteSelecionado ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                      <div>
                         <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Viatura</label>
                         <select className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-2xl font-bold text-sm outline-none" value={viaturaSelecionada} onChange={e=>setViaturaSelecionada(e.target.value)}>
                            <option value="">Selecione...</option>
                            {clienteSelecionado?.vehicles?.map((v:any, i:number) => (
                               <option key={i} value={`${v.matricula} - ${v.marca}`}>{v.matricula} ({v.marca})</option>
                            ))}
                         </select>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Hora</label>
                         <input type="time" className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-2xl font-bold text-sm outline-none" value={formAgendamento.hora} onChange={e=>setFormAgendamento({...formAgendamento, hora:e.target.value})}/>
                      </div>
                   </div>

                   <div className={`${!clienteSelecionado ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Mecânico Responsável</label>
                      <div className="flex flex-wrap gap-2">
                         {mecanicos.map(mec => (
                            <button key={mec.id} onClick={()=>setFormAgendamento({...formAgendamento, mecanicoId: mec.id})} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${formAgendamento.mecanicoId === mec.id ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400'}`}>
                               {mec.nome}
                            </button>
                         ))}
                      </div>
                   </div>
                   
                   <div className={`${!clienteSelecionado ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Serviço</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                         {SERVICOS_RAPIDOS.map(s => (
                            <button key={s} onClick={()=>setFormAgendamento({...formAgendamento, notas: s})} className="text-[9px] bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-lg font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">{s}</button>
                         ))}
                      </div>
                      <textarea className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl font-bold text-sm outline-none h-24" placeholder="Descrição..." value={formAgendamento.notas} onChange={e=>setFormAgendamento({...formAgendamento, notas:e.target.value})}/>
                   </div>

                   <div className="pt-4 border-t border-zinc-100 flex gap-4">
                      <button onClick={()=>setModalAberto(false)} className="flex-1 py-4 font-black text-zinc-400 uppercase text-xs hover:bg-zinc-50 rounded-2xl">Cancelar</button>
                      <button onClick={criarAgendamento} disabled={!clienteSelecionado || !formAgendamento.mecanicoId} className="flex-1 bg-blue-600 text-white font-black uppercase text-xs py-4 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all">Confirmar Agendamento</button>
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  )
}