'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, Users, Calendar, Wrench, 
  DollarSign, Loader2, ArrowUpRight
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import Link from 'next/link'

// Tipos auxiliares
type ChartView = 'mes' | 'semestre' | 'ano'

export default function VisaoGeralPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  // Dados brutos
  const [faturasRaw, setFaturasRaw] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  
  // Estados de Visualização
  const [chartView, setChartView] = useState<ChartView>('ano')
  const [stats, setStats] = useState({
    faturacaoMes: 0,
    clientesTotal: 0,
    agendamentosHoje: 0,
    orcamentosPendentes: 0
  })

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Descobrir ID da Oficina
        const { data: ofi } = await supabase.from('oficinas').select('id').eq('user_id', user.id).single()
        const wid = ofi?.id
        if (!wid) return

        // --- CARREGAR FATURAS ---
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
        
        const { data: invs } = await supabase
            .from('invoices')
            .select('id, total_gross, created_at, issue_date')
            .eq('workshop_id', wid)
            .gte('created_at', oneYearAgo.toISOString())
            .order('created_at', { ascending: true })
        
        setFaturasRaw(invs || [])

        // --- CÁLCULO KPI ---
        const now = new Date()
        const currentMonthInvs = invs?.filter(i => {
            const d = new Date(i.issue_date || i.created_at)
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        })
        const totalFat = currentMonthInvs?.reduce((acc, curr) => acc + Number(curr.total_gross), 0) || 0

        // --- OUTROS KPIs ---
        const { count: cliCount } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('workshop_id', wid)
        
        const todayStr = new Date().toISOString().split('T')[0]
        const { count: scheduleCount } = await supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('workshop_id', wid).eq('status', 'Agendado').eq('schedule_date', todayStr)
        
        const { count: pendingCount } = await supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('workshop_id', wid).in('status', ['Rascunho', 'Por Aprovar'])

        setStats({
            faturacaoMes: totalFat,
            clientesTotal: cliCount || 0,
            agendamentosHoje: scheduleCount || 0,
            orcamentosPendentes: pendingCount || 0
        })

        // --- ATIVIDADE RECENTE ---
        const { data: recent } = await supabase
            .from('quotes')
            .select('id, created_at, status, client:clients(nome), vehicle:vehicles(marca, matricula)')
            .eq('workshop_id', wid)
            .order('created_at', { ascending: false })
            .limit(5)
        
        setRecentActivity(recent || [])

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  // --- PROCESSAMENTO DO GRÁFICO ---
  const chartData = useMemo(() => {
    if (!faturasRaw.length) return []

    const now = new Date()
    const dataAgrupada: Record<string, number> = {}
    let resultado: any[] = []

    if (chartView === 'mes') {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        for (let d = 1; d <= daysInMonth; d++) { dataAgrupada[d] = 0 }

        faturasRaw.forEach(inv => {
            const d = new Date(inv.issue_date || inv.created_at)
            if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
                const dia = d.getDate()
                dataAgrupada[dia] = (dataAgrupada[dia] || 0) + Number(inv.total_gross)
            }
        })
        resultado = Object.keys(dataAgrupada).map(dia => ({ name: dia, total: dataAgrupada[dia] }))

    } else if (chartView === 'semestre') {
        const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const key = `${mesesNomes[d.getMonth()]}`
            resultado.push({ name: key, total: 0, monthIndex: d.getMonth(), year: d.getFullYear() })
        }
        faturasRaw.forEach(inv => {
            const d = new Date(inv.issue_date || inv.created_at)
            const item = resultado.find(r => r.monthIndex === d.getMonth() && r.year === d.getFullYear())
            if (item) item.total += Number(inv.total_gross)
        })

    } else {
        const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        mesesNomes.forEach((mes, idx) => { resultado.push({ name: mes, total: 0, monthIndex: idx }) })
        faturasRaw.forEach(inv => {
            const d = new Date(inv.issue_date || inv.created_at)
            if (d.getFullYear() === now.getFullYear()) {
                const item = resultado.find(r => r.monthIndex === d.getMonth())
                if (item) item.total += Number(inv.total_gross)
            }
        })
    }
    return resultado
  }, [faturasRaw, chartView])

  if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="animate-spin text-blue-600" size={40}/></div>

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
            <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tight mb-2">Visão Geral</h1>
            <p className="text-zinc-500 font-medium">Bem-vindo ao cockpit do <span className="text-blue-600 font-bold">CarManager</span>.</p>
        </div>
        <div className="flex gap-2">
            <Link href="/dashboard/orcamentos/novo" className="bg-zinc-900 text-white px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2">
                <DollarSign size={16}/> Faturar
            </Link>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 blur-[80px] opacity-10 group-hover:opacity-20 transition-all"></div>
            <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><DollarSign size={24}/></div>
                <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg uppercase tracking-wider">Este Mês</span>
            </div>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Faturação</p>
            <h3 className="text-3xl font-black text-zinc-900">{stats.faturacaoMes.toFixed(2)}€</h3>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-sm relative overflow-hidden group hover:border-zinc-300 transition-all">
            <div className="flex justify-between items-start mb-4"><div className="bg-zinc-100 p-3 rounded-2xl text-zinc-600"><Calendar size={24}/></div></div>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Agenda Hoje</p>
            <h3 className="text-3xl font-black text-zinc-900">{stats.agendamentosHoje} <span className="text-sm text-zinc-400 font-bold">viaturas</span></h3>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-sm relative overflow-hidden group hover:border-purple-200 transition-all">
            <div className="flex justify-between items-start mb-4"><div className="bg-purple-50 p-3 rounded-2xl text-purple-600"><Users size={24}/></div></div>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Clientes</p>
            <h3 className="text-3xl font-black text-zinc-900">{stats.clientesTotal}</h3>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-zinc-100 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-all">
            <div className="flex justify-between items-start mb-4"><div className="bg-orange-50 p-3 rounded-2xl text-orange-600"><Wrench size={24}/></div></div>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Pendentes</p>
            <h3 className="text-3xl font-black text-zinc-900">{stats.orcamentosPendentes}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* GRÁFICO */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="font-black text-zinc-900 uppercase tracking-tight text-lg">Análise Financeira</h3>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Evolução de Faturação</p>
                </div>
                <div className="bg-zinc-100 p-1 rounded-xl flex">
                    {(['mes', 'semestre', 'ano'] as ChartView[]).map((v) => (
                        <button key={v} onClick={() => setChartView(v)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${chartView === v ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}>
                            {v === 'ano' ? 'Este Ano' : v === 'mes' ? 'Este Mês' : 'Semestre'}
                        </button>
                    ))}
                </div>
             </div>
             
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs><linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5"/>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 10, fontWeight: 700}} dy={10}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 10, fontWeight: 700}} tickFormatter={(value) => `${(Number(value)/1000).toFixed(0)}k`}/>
                        
                        {/* --- CORREÇÃO DO ERRO DA LINHA 223 AQUI --- */}
                        <Tooltip 
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}} 
                            itemStyle={{color: '#2563eb', fontWeight: 900, fontSize: '14px'}} 
                            formatter={(value: any) => [`${Number(value).toFixed(2)} €`, 'Faturado']} 
                            labelStyle={{color: '#71717a', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px'}}
                        />
                        {/* ----------------------------------------- */}

                        <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" activeDot={{r: 6, strokeWidth: 0, fill: '#1e3a8a'}}/>
                    </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* ATIVIDADE RECENTE */}
          <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm flex flex-col h-[500px]">
             <div className="mb-6">
                 <h3 className="font-black text-zinc-900 uppercase tracking-tight text-lg">Atividade</h3>
                 <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Últimos movimentos</p>
             </div>
             
             <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {recentActivity.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-300 opacity-50">
                        <Wrench size={32} className="mb-2"/>
                        <p className="text-xs font-bold uppercase">Sem registos</p>
                    </div>
                ) : (
                    recentActivity.map((item: any) => (
                        <div 
                            key={item.id} 
                            className="group flex items-center gap-4 p-4 hover:bg-zinc-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-zinc-100" 
                            onClick={() => router.push(`/dashboard/orcamentos/${item.id}`)}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                item.status === 'Concluído' ? 'bg-zinc-900 text-white' : 
                                item.status === 'Agendado' ? 'bg-blue-100 text-blue-600' : 
                                item.status === 'Pago' ? 'bg-green-100 text-green-600' :
                                'bg-orange-50 text-orange-400'
                            }`}>
                                {item.status === 'Concluído' ? <Wrench size={16}/> : <ArrowUpRight size={16}/>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-zinc-900 truncate">
                                    {(item.vehicle as any)?.marca} <span className="text-zinc-400 font-medium ml-1">{(item.vehicle as any)?.matricula}</span>
                                </p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate">
                                    {(item.client as any)?.nome}
                                </p>
                            </div>
                        </div>
                    ))
                )}
             </div>
             
             <Link href="/dashboard/orcamentos" className="mt-4 w-full py-4 rounded-2xl bg-zinc-50 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-900 hover:text-white transition-all text-center flex items-center justify-center gap-2">
                Ver Histórico Completo
             </Link>
          </div>
      </div>
    </div>
  )
}