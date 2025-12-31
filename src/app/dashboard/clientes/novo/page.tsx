'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  User, Phone, Mail, MapPin, Save, ArrowLeft, 
  Loader2, FileText, Car, Plus, Trash2 
} from 'lucide-react'
import Link from 'next/link'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Estado do Cliente
  const [clientData, setClientData] = useState({
    nome: '',
    nif: '',
    telemovel: '',
    email: '',
    morada: ''
  })

  // Estado das Viaturas (Começa com uma vazia para incentivar)
  const [vehicles, setVehicles] = useState([
    { matricula: '', marca: '', modelo: '', vin: '', ano: '' }
  ])

  // --- LÓGICA DE VIATURAS ---
  const addVehicleRow = () => {
    setVehicles([...vehicles, { matricula: '', marca: '', modelo: '', vin: '', ano: '' }])
  }

  const removeVehicleRow = (index: number) => {
    setVehicles(vehicles.filter((_, i) => i !== index))
  }

  const updateVehicle = (index: number, field: string, value: string) => {
    const newVehicles = [...vehicles]
    // @ts-ignore
    newVehicles[index][field] = value
    setVehicles(newVehicles)
  }

  // --- AÇÃO: GRAVAR TUDO ---
  const handleSaveAll = async () => {
    if (!clientData.nome) {
      alert("O nome do cliente é obrigatório.")
      return
    }

    // Validar se as viaturas preenchidas têm matrícula
    const vehiclesToSave = vehicles.filter(v => v.matricula.trim() !== '')
    const invalidVehicles = vehiclesToSave.some(v => !v.marca)
    
    if (invalidVehicles) {
        alert("Se adicionar uma matrícula, a marca também é obrigatória.")
        return
    }

    setLoading(true)

    try {
      // 1. Obter User e Oficina
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Não autenticado.")

      const { data: oficina } = await supabase.from('oficinas').select('id').eq('user_id', user.id).single()
      if (!oficina) throw new Error("Oficina não encontrada.")

      // 2. Criar Cliente
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          workshop_id: oficina.id,
          ...clientData
        })
        .select()
        .single()

      if (clientError) throw clientError

      // 3. Criar Viaturas (se houver)
      if (vehiclesToSave.length > 0) {
          const vehiclesPayload = vehiclesToSave.map(v => ({
              workshop_id: oficina.id,
              client_id: newClient.id, // Liga ao novo cliente
              matricula: v.matricula.toUpperCase(),
              marca: v.marca,
              modelo: v.modelo,
              vin: v.vin,
              ano: v.ano
          }))

          const { error: vehicleError } = await supabase
            .from('vehicles')
            .insert(vehiclesPayload)
          
          if (vehicleError) throw vehicleError
      }

      // 4. Sucesso -> Ir para a Ficha
      router.push(`/dashboard/clientes/${newClient.id}`)

    } catch (error: any) {
      console.error(error)
      alert("Erro ao gravar: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50 flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/clientes">
          <button className="h-10 w-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500 hover:text-black transition-colors shadow-sm">
            <ArrowLeft size={20}/>
          </button>
        </Link>
        <div>
           <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">Novo Cliente</h1>
           <p className="text-zinc-500 text-sm font-medium">Preencha os dados e adicione viaturas.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full grid gap-8">
         
         {/* --- CARTÃO 1: DADOS DO CLIENTE --- */}
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 pb-4">
                <User className="text-blue-600" size={24}/>
                <h2 className="text-xl font-bold text-zinc-900">Dados Pessoais</h2>
            </div>

            <div className="space-y-6">
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Nome Completo *</label>
                  <input className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-lg text-zinc-900 focus:ring-2 focus:ring-zinc-900 outline-none placeholder:font-normal"
                    placeholder="Ex: João Antunes" autoFocus value={clientData.nome} onChange={e => setClientData({...clientData, nome: e.target.value})} />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2"><Phone size={14}/> Telemóvel</label>
                     <input className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 outline-none"
                       placeholder="910 000 000" value={clientData.telemovel} onChange={e => setClientData({...clientData, telemovel: e.target.value})} />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2"><FileText size={14}/> NIF</label>
                     <input className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 outline-none"
                       placeholder="123 456 789" value={clientData.nif} onChange={e => setClientData({...clientData, nif: e.target.value})} />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2"><Mail size={14}/> Email</label>
                     <input type="email" className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 outline-none"
                       placeholder="cliente@exemplo.com" value={clientData.email} onChange={e => setClientData({...clientData, email: e.target.value})} />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2"><MapPin size={14}/> Morada</label>
                     <input className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-medium focus:ring-2 focus:ring-zinc-900 outline-none"
                       placeholder="Rua, Localidade..." value={clientData.morada} onChange={e => setClientData({...clientData, morada: e.target.value})} />
                  </div>
               </div>
            </div>
         </div>

         {/* --- CARTÃO 2: VIATURAS --- */}
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
            <div className="flex items-center justify-between mb-6 border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2">
                    <Car className="text-blue-600" size={24}/>
                    <h2 className="text-xl font-bold text-zinc-900">Adicionar Viaturas</h2>
                </div>
                <button onClick={addVehicleRow} className="text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus size={14}/> Adicionar Carro
                </button>
            </div>

            <div className="space-y-4">
                {vehicles.map((v, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-3 items-start p-4 border border-zinc-100 rounded-xl bg-zinc-50/50 relative group">
                        <div className="w-full md:w-1/4">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Matrícula</label>
                            <input className="w-full p-2 border border-zinc-200 rounded-lg uppercase font-bold text-zinc-900 focus:bg-white focus:border-blue-500 outline-none"
                                placeholder="AA-00-AA" value={v.matricula} onChange={e => updateVehicle(idx, 'matricula', e.target.value)} />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Marca</label>
                            <input className="w-full p-2 border border-zinc-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none"
                                placeholder="Ex: BMW" value={v.marca} onChange={e => updateVehicle(idx, 'marca', e.target.value)} />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Modelo</label>
                            <input className="w-full p-2 border border-zinc-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none"
                                placeholder="Ex: Série 3" value={v.modelo} onChange={e => updateVehicle(idx, 'modelo', e.target.value)} />
                        </div>
                        <div className="w-full md:w-1/6">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase mb-1 block">Ano</label>
                            <input type="number" className="w-full p-2 border border-zinc-200 rounded-lg focus:bg-white focus:border-blue-500 outline-none"
                                placeholder="2020" value={v.ano} onChange={e => updateVehicle(idx, 'ano', e.target.value)} />
                        </div>
                        
                        {/* Botão Remover Linha */}
                        {vehicles.length > 1 && (
                            <button onClick={() => removeVehicleRow(idx)} className="absolute -top-2 -right-2 md:static md:mt-6 bg-white md:bg-transparent shadow-sm md:shadow-none p-1.5 rounded-full text-zinc-400 hover:text-blue-500 border md:border-none transition-colors">
                                <Trash2 size={18}/>
                            </button>
                        )}
                    </div>
                ))}
            </div>
         </div>

         {/* BOTÃO FINAL */}
         <div className="flex justify-end pt-4">
            <button 
                onClick={handleSaveAll}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-green-200 flex items-center gap-3 text-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="animate-spin" size={24}/> : <Save size={24}/>} 
                Gravar Cliente e Viaturas
            </button>
         </div>

      </div>
    </div>
  )
}