'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Users, Plus, Trash2, Mail, Lock, CheckCircle, 
  Loader2, X, Phone, CreditCard, MapPin, Calendar as CalendarIcon, User, Save 
} from 'lucide-react'
import { createMechanicLogin } from '@/app/actions/create-mechanic'

// Paleta visual para identificar mecânicos na Agenda
const PALETA = [
  { nome: 'Azul', value: 'bg-blue-500' },
  { nome: 'Vermelho', value: 'bg-red-500' },
  { nome: 'Verde', value: 'bg-green-500' },
  { nome: 'Roxo', value: 'bg-purple-500' },
  { nome: 'Laranja', value: 'bg-orange-500' },
  { nome: 'Rosa', value: 'bg-pink-500' },
  { nome: 'Cinzento', value: 'bg-zinc-500' },
]

export default function TeamPage() {
  const [loading, setLoading] = useState(true)
  const [mechanics, setMechanics] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedColor, setSelectedColor] = useState(PALETA[0].value)

  // Carregar lista de colaboradores da Base de Dados
  const fetchMechanics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: oficina } = await supabase.from('oficinas').select('id').eq('user_id', user.id).single()
      
      if (oficina) {
        const { data } = await supabase.from('mecanicos').select('*').eq('workshop_id', oficina.id)
        setMechanics(data || [])
      }
    } catch (err) {
      console.error("Erro ao carregar equipa:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMechanics() }, [])

  // Submeter formulário de criação
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      // 1. Criar o acesso (Auth) via Server Action com a Service Role Key
      const result = await createMechanicLogin(formData)

      if (result.error) {
        alert(result.error)
        setIsSubmitting(false)
        return
      }

      // 2. Gravar os dados pessoais detalhados na tabela mecanicos
      const { data: { user } } = await supabase.auth.getUser()
      const { data: oficina } = await supabase.from('oficinas').select('id').eq('user_id', user?.id).single()

      if (!oficina) throw new Error("Oficina não encontrada para o utilizador atual.")

      const { error: dbError } = await supabase.from('mecanicos').insert({
        workshop_id: oficina.id,
        auth_id: result.authId,
        nome: formData.get('nome'),
        email: formData.get('email'),
        telemovel: formData.get('telemovel'),
        nif: formData.get('nif'),
        morada: formData.get('morada'),
        data_contratacao: formData.get('data_contratacao'),
        cor: selectedColor,
        status: 'Ativo'
      })

      if (dbError) throw dbError

      alert("Mecânico registado com sucesso!")
      setIsModalOpen(false)
      fetchMechanics()
    } catch (err: any) {
      alert("Erro ao guardar dados: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Tem a certeza? O mecânico perderá permanentemente o acesso ao sistema.")) return
    try {
        const { error } = await supabase.from('mecanicos').delete().eq('id', id)
        if (error) throw error
        fetchMechanics()
    } catch (err: any) {
        alert("Erro ao eliminar: " + err.message)
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50 animate-in fade-in">
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-black text-zinc-900 uppercase flex items-center gap-3">
             <Users className="text-blue-600"/> Equipa
           </h1>
           <p className="text-zinc-500">Gestão centralizada de colaboradores e dados pessoais.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
        >
            <Plus size={20}/> Novo Colaborador
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-zinc-400"/></div>
      ) : mechanics.length === 0 ? (
        <div className="text-center p-16 border-2 border-dashed border-zinc-200 rounded-3xl bg-white/50">
            <Users size={48} className="mx-auto text-zinc-300 mb-4"/>
            <p className="text-zinc-500 font-medium">A sua equipa ainda está vazia.</p>
            <p className="text-zinc-400 text-sm">Adicione o seu primeiro mecânico para começar a agendar serviços.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mechanics.map(m => (
                <div key={m.id} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative group hover:border-zinc-400 transition-all overflow-hidden">
                    {/* Indicador de Cor Visual */}
                    <div className={`absolute top-0 left-0 w-full h-1.5 ${m.cor || 'bg-zinc-300'}`}></div>
                    
                    <div className="flex items-center gap-4 mb-4 mt-2">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ${m.cor || 'bg-zinc-500'}`}>
                            {m.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900">{m.nome}</h3>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Colaborador Ativo</p>
                        </div>
                    </div>

                    <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-zinc-600 bg-zinc-50 p-2 rounded border border-zinc-100">
                            <Mail size={14} className="text-zinc-400"/> {m.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-600 bg-zinc-50 p-2 rounded border border-zinc-100">
                            <Phone size={14} className="text-zinc-400"/> {m.telemovel || 'Sem telefone'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-600 bg-zinc-50 p-2 rounded border border-zinc-100">
                            <CreditCard size={14} className="text-zinc-400"/> NIF: {m.nif || '---'}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle size={10}/> Acesso Ativo
                        </span>
                        <button 
                            onClick={() => handleDelete(m.id)} 
                            className="text-zinc-300 hover:text-red-600 transition-colors p-1"
                        >
                            <Trash2 size={18}/>
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* MODAL DE CADASTRO COMPLETO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 animate-in zoom-in-95 overflow-y-auto max-h-[95vh]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Ficha Pessoal do Mecânico</h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-zinc-100 rounded-full transition-colors">
                        <X className="text-zinc-400 hover:text-red-500" size={24}/>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bloco: Dados de Identificação */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-zinc-400" size={18}/>
                                <input 
                                    name="nome" 
                                    className="w-full pl-10 p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none font-medium transition-all" 
                                    placeholder="Ex: Carlos Santos" 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Telemóvel</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-zinc-400" size={18}/>
                                <input 
                                    name="telemovel" 
                                    className="w-full pl-10 p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none font-medium transition-all" 
                                    placeholder="912 345 678" 
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email de Acesso</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-zinc-400" size={18}/>
                                <input 
                                    name="email" 
                                    type="email" 
                                    className="w-full pl-10 p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none font-medium transition-all" 
                                    placeholder="carlos@oficina.com" 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">NIF (Fiscal)</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 text-zinc-400" size={18}/>
                                <input 
                                    name="nif" 
                                    className="w-full pl-10 p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none font-medium transition-all" 
                                    placeholder="123456789" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bloco: Morada */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Morada Residencial</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-zinc-400" size={18}/>
                            <input 
                                name="morada" 
                                className="w-full pl-10 p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none font-medium transition-all" 
                                placeholder="Rua, Número, Código Postal, Localidade" 
                            />
                        </div>
                    </div>

                    {/* Bloco: Dados Administrativos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Data de Admissão (Férias)</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-3 text-zinc-400" size={18}/>
                                <input 
                                    name="data_contratacao" 
                                    type="date" 
                                    className="w-full pl-10 p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none font-medium transition-all" 
                                    defaultValue={new Date().toISOString().split('T')[0]} 
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Palavra-passe de Login</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-zinc-400" size={18}/>
                                <input 
                                    name="password" 
                                    type="password" 
                                    className="w-full pl-10 p-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none font-medium transition-all" 
                                    placeholder="Defina uma senha segura (mín. 6)" 
                                    required 
                                    minLength={6} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seletor Visual de Cor */}
                    <div className="pt-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-4 block">Cor de Identificação na Agenda</label>
                        <div className="flex flex-wrap gap-4">
                            {PALETA.map((cor) => (
                                <button
                                    key={cor.value}
                                    type="button"
                                    onClick={() => setSelectedColor(cor.value)}
                                    className={`w-10 h-10 rounded-full border-4 transition-all ${cor.value} ${
                                        selectedColor === cor.value 
                                        ? `ring-2 ring-offset-2 ring-zinc-900 scale-110 border-white shadow-xl` 
                                        : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'
                                    }`}
                                    title={cor.nome}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-4 pt-8 border-t border-zinc-100 mt-6">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)} 
                            className="flex-1 py-4 font-bold text-zinc-500 hover:bg-zinc-100 rounded-2xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="flex-1 py-4 font-bold bg-zinc-900 text-white hover:bg-zinc-800 rounded-2xl flex justify-center items-center gap-2 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={20}/>
                            ) : (
                                <Save size={20}/>
                            )} 
                            Confirmar Registo
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  )
}