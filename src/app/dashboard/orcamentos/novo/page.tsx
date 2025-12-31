'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  ArrowLeft, Save, User, Car, Plus, Search, 
  Trash2, FileText, Wrench, ChevronDown, ChevronUp, Loader2, Tag
} from 'lucide-react'

// --- CATÁLOGO DE SERVIÇOS (Dados Estáticos para Agilidade) ---
const CATALOGO = [
  {
    categoria: "Serviços Rápidos",
    icon: Wrench,
    items: [
      { nome: "Revisão Simples", preco: 85.00 },
      { nome: "Mudança de Óleo", preco: 45.00 },
      { nome: "Substituição Filtros", preco: 30.00 },
      { nome: "Pastilhas Travão (Frente)", preco: 60.00 },
      { nome: "Escovas Limpa-Para-brisas", preco: 25.00 },
      { nome: "Carregamento AC", preco: 50.00 }
    ]
  },
  {
    categoria: "Mecânica Geral",
    icon: Wrench,
    items: [
      { nome: "Kit Distribuição", preco: 350.00 },
      { nome: "Embraiagem", preco: 400.00 },
      { nome: "Amortecedores (Par)", preco: 180.00 },
      { nome: "Bateria 70Ah", preco: 90.00 },
      { nome: "Alternador", preco: 150.00 }
    ]
  },
  {
    categoria: "Pneus & Rodas",
    icon: Car,
    items: [
      { nome: "Alinhamento Direção", preco: 30.00 },
      { nome: "Calibragem (Unid)", preco: 10.00 },
      { nome: "Reparação Furo", preco: 15.00 }
    ]
  }
]

export default function NovoOrcamentoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // --- DADOS ---
  const [clientes, setClientes] = useState<any[]>([])
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null)
  const [viaturaSelecionada, setViaturaSelecionada] = useState<any>(null)
  
  // --- ITENS DO ORÇAMENTO ---
  const [itens, setItens] = useState<any[]>([
    { id: 1, descricao: "Mão de Obra (Estimada)", qtd: 1, preco: 35.00, tipo: 'servico' }
  ])
  
  // --- ESTADOS DE UI ---
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [novoItemManual, setNovoItemManual] = useState('')
  const [categoriaAberta, setCategoriaAberta] = useState<string | null>("Serviços Rápidos")

  // --- BUSCAR CLIENTES ---
  useEffect(() => {
    const fetchClientes = async () => {
      // Busca segura: tenta buscar, se falhar ou vazio, array vazio
      const { data: { user } } = await supabase.auth.getUser()
      if(!user) return

      const { data: mec } = await supabase.from('mecanicos').select('workshop_id').eq('email', user.email).single()
      const { data: ofi } = await supabase.from('oficinas').select('id').eq('user_id', user.id).single()
      const wid = mec?.workshop_id || ofi?.id

      if(wid) {
          const { data } = await supabase.from('clients').select('*, vehicles(*)').eq('workshop_id', wid)
          setClientes(data || [])
      }
    }
    fetchClientes()
  }, [])

  // --- LÓGICA DE ITENS ---
  const adicionarItem = (nome: string, preco: number) => {
    const novo = {
      id: Date.now(),
      descricao: nome,
      qtd: 1,
      preco: preco,
      tipo: 'peca'
    }
    setItens([...itens, novo])
  }

  const removerItem = (id: number) => {
    setItens(itens.filter(i => i.id !== id))
  }

  const atualizarQtd = (id: number, delta: number) => {
    setItens(itens.map(i => {
      if (i.id === id) {
        const novaQtd = Math.max(0.5, i.qtd + delta)
        return { ...i, qtd: novaQtd }
      }
      return i
    }))
  }

  // --- CÁLCULO TOTAL ---
  const totalEstimado = itens.reduce((acc, item) => acc + (item.preco * item.qtd), 0)

  // --- GUARDAR ---
  const handleGuardar = async () => {
    if(!clienteSelecionado) { alert('Selecione um cliente.'); return }
    setLoading(true)
    
    try {
        const { data: { user } } = await supabase.auth.getUser()
        // Obter Workshop ID (Lógica simplificada, idealmente viria de um Contexto)
        const { data: mec } = await supabase.from('mecanicos').select('workshop_id').eq('email', user?.email).single()
        const { data: ofi } = await supabase.from('oficinas').select('id').eq('user_id', user?.id).single()
        const wid = mec?.workshop_id || ofi?.id

        if(!wid) throw new Error("Oficina não identificada")

        // 1. Criar Orçamento
        const { data: quote, error: errQuote } = await supabase.from('quotes').insert({
            workshop_id: wid,
            client_id: clienteSelecionado.id,
            vehicle_id: viaturaSelecionada?.id || null,
            status: 'Rascunho',
            valor_total: totalEstimado,
            created_at: new Date()
        }).select().single()

        if(errQuote) throw errQuote

        // 2. Inserir Itens
        const itensFormatados = itens.map(i => ({
            quote_id: quote.id,
            description: i.descricao,
            quantity: i.qtd,
            unit_price: i.preco,
            total_price: i.qtd * i.preco,
            type: i.tipo
        }))

        const { error: errItems } = await supabase.from('quote_items').insert(itensFormatados)
        if(errItems) throw errItems

        router.push(`/dashboard/orcamentos/${quote.id}`)

    } catch (err: any) {
        alert("Erro: " + err.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 animate-in fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="bg-white p-3 rounded-xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Novo Orçamento</h1>
            <p className="text-sm text-zinc-500 font-medium">Configuração e Itens</p>
          </div>
        </div>
        
        <button 
            onClick={handleGuardar} 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Gerar Rascunho</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA DA ESQUERDA (CLIENTE & ITENS) */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* CARTÃO CLIENTE */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200">
                <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={14}/> Cliente & Viatura
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Cliente</label>
                        <select 
                            className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl font-bold text-zinc-700 outline-none focus:border-blue-500 transition-all"
                            onChange={(e) => {
                                const cli = clientes.find(c => c.id === e.target.value)
                                setClienteSelecionado(cli)
                                setViaturaSelecionada(null)
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Selecione...</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Viatura</label>
                        <select 
                            className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl font-bold text-zinc-700 outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                            disabled={!clienteSelecionado}
                            onChange={(e) => {
                                const v = clienteSelecionado?.vehicles.find((v:any) => v.id === e.target.value)
                                setViaturaSelecionada(v)
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Selecione...</option>
                            {clienteSelecionado?.vehicles?.map((v:any) => (
                                <option key={v.id} value={v.id}>{v.marca} - {v.matricula}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* LISTA DE ITENS (RECEIPT STYLE) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={14}/> Itens ({itens.length})
                    </h2>
                    {itens.length > 0 && (
                        <button onClick={() => setItens([])} className="text-[10px] font-bold text-zinc-400 hover:text-blue-500 uppercase">Limpar</button>
                    )}
                </div>

                <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {itens.map((item) => (
                        <div key={item.id} className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 group hover:border-blue-200 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-bold text-zinc-900 leading-tight w-[70%]">{item.descricao}</span>
                                <button onClick={() => removerItem(item.id)} className="text-zinc-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center bg-white rounded-lg border border-zinc-200">
                                    <button onClick={() => atualizarQtd(item.id, -0.5)} className="px-2 py-1 hover:bg-zinc-100 rounded-l-lg">-</button>
                                    <span className="text-xs font-mono font-bold w-8 text-center">{item.qtd}</span>
                                    <button onClick={() => atualizarQtd(item.id, 0.5)} className="px-2 py-1 hover:bg-zinc-100 rounded-r-lg">+</button>
                                </div>
                                <span className="text-sm font-black text-zinc-900">{(item.preco * item.qtd).toFixed(2)}€</span>
                            </div>
                        </div>
                    ))}
                    {itens.length === 0 && (
                        <div className="text-center py-8 text-zinc-300 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-zinc-100 rounded-xl">
                            Sem itens adicionados
                        </div>
                    )}
                </div>

                <div className="border-t-2 border-dashed border-zinc-100 pt-4">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-zinc-400 uppercase">Total Estimado</span>
                        <span className="text-3xl font-black text-zinc-900 tracking-tighter">{totalEstimado.toFixed(2)}€</span>
                    </div>
                </div>
            </div>
        </div>

        {/* COLUNA DA DIREITA (CATÁLOGO & PESQUISA) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* BOX ESCURA DE PESQUISA (Identidade Visual Forte) */}
            <div className="bg-zinc-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-[100px] opacity-20 pointer-events-none"></div>
                
                <div className="relative z-10 grid gap-6">
                    <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Pesquisar Catálogo</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20}/>
                            <input 
                                className="w-full bg-zinc-800 border border-zinc-700 p-4 pl-12 rounded-2xl font-bold text-white placeholder:text-zinc-600 focus:border-blue-500 outline-none transition-all"
                                placeholder="Ex: Óleo, Pneus, Motor..."
                                value={termoPesquisa}
                                onChange={(e) => setTermoPesquisa(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 items-end">
                        <div className="flex-1">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Adicionar Manual</label>
                            <input 
                                className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl font-bold text-white placeholder:text-zinc-600 focus:border-blue-500 outline-none transition-all"
                                placeholder="Nome do Serviço..."
                                value={novoItemManual}
                                onChange={(e) => setNovoItemManual(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && novoItemManual && adicionarItem(novoItemManual, 0)}
                            />
                        </div>
                        <button 
                            onClick={() => { if(novoItemManual) { adicionarItem(novoItemManual, 0); setNovoItemManual('') } }}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl shadow-lg transition-all active:scale-95"
                        >
                            <Plus size={24}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* ACORDEÃO DE SERVIÇOS */}
            <div className="space-y-4">
                {CATALOGO.map((cat, idx) => {
                    const isOpen = categoriaAberta === cat.categoria
                    return (
                        <div key={idx} className={`bg-white rounded-2xl border transition-all ${isOpen ? 'border-blue-200 shadow-md' : 'border-zinc-200 shadow-sm'}`}>
                            <button 
                                onClick={() => setCategoriaAberta(isOpen ? null : cat.categoria)}
                                className="w-full flex justify-between items-center p-5 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-500'}`}>
                                        <cat.icon size={20}/>
                                    </div>
                                    <span className={`font-black uppercase tracking-tight ${isOpen ? 'text-zinc-900' : 'text-zinc-500'}`}>
                                        {cat.categoria}
                                    </span>
                                </div>
                                {isOpen ? <ChevronUp size={20} className="text-zinc-400"/> : <ChevronDown size={20} className="text-zinc-400"/>}
                            </button>

                            {isOpen && (
                                <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 animate-in slide-in-from-top-2">
                                    {cat.items.filter(i => i.nome.toLowerCase().includes(termoPesquisa.toLowerCase())).map((item, iIdx) => (
                                        <button 
                                            key={iIdx}
                                            onClick={() => adicionarItem(item.nome, item.preco)}
                                            className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all group text-left"
                                        >
                                            <span className="text-xs font-bold text-zinc-700 group-hover:text-zinc-900">{item.nome}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-zinc-400 group-hover:text-blue-600">{item.preco}€</span>
                                                <Plus size={14} className="text-zinc-300 group-hover:text-blue-600"/>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

        </div>
      </div>
    </div>
  )
}