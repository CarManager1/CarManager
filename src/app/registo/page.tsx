'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Loader2, ArrowRight, ArrowLeft, Check, Upload, Camera, X, Wrench } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) 
  const [loading, setLoading] = useState(false)
  
  const [previews, setPreviews] = useState({
    logo: null as string | null,
    fotoFrente: null as string | null
  })

  // TODOS OS CAMPOS MANTIDOS
  const [formData, setFormData] = useState({
    emailLogin: '',
    passwordLogin: '',
    nome_oficina: '',
    nif: '',
    morada: '',
    codigo_postal: '', // Mantido
    localidade: '',    // Mantido
    telefone: '',
    telemovel: '',
    email_oficina: '',
    responsavel_nome: '',
    responsavel_telemovel: '',
    responsavel_email: '',
    logoFile: null as File | null,
    fotoFrenteFile: null as File | null
  })

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: any, field: 'logoFile' | 'fotoFrenteFile', previewField: 'logo' | 'fotoFrente') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData({ ...formData, [field]: file })
      const objectUrl = URL.createObjectURL(file)
      setPreviews(prev => ({ ...prev, [previewField]: objectUrl }))
    }
  }

  const removeImage = (field: 'logoFile' | 'fotoFrenteFile', previewField: 'logo' | 'fotoFrente') => {
    setFormData({ ...formData, [field]: null })
    setPreviews(prev => ({ ...prev, [previewField]: null }))
  }

  const validateStep1 = () => {
    const requiredFields = [
        'nome_oficina', 'nif', 'morada', 'codigo_postal', 'localidade', 
        'telemovel', 'email_oficina', 
        'responsavel_nome', 'responsavel_telemovel', 'responsavel_email'
    ]
    
    for (const field of requiredFields) {
        // @ts-ignore
        if (!formData[field]) {
            alert('Por favor preencha todos os campos obrigatórios (*)')
            return false
        }
    }
    return true
  }

  const handleNextStep = () => {
    if (step === 1) {
       if (validateStep1()) setStep(2)
    }
  }

  const handleFinalSubmit = async () => {
    if (!formData.emailLogin || !formData.passwordLogin) {
        alert("Defina um email e password para entrar.")
        return
    }

    setLoading(true)
    try {
      // 1. Criar Utilizador na Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.emailLogin,
        password: formData.passwordLogin,
        options: {
            data: {
                nome: formData.responsavel_nome,
                role: 'owner' // Define como dono da oficina
            }
        }
      })
      if (authError) throw authError
      if (!authData.user) throw new Error("Erro ao criar utilizador.")

      const userId = authData.user.id
      let logoUrl = null
      let fotoFrenteUrl = null

      // 2. Uploads (Logo e Fachada)
      if (formData.logoFile) {
        const ext = formData.logoFile.name.split('.').pop()
        const path = `${userId}/logo.${ext}`
        const { error: uploadError } = await supabase.storage.from('crm-uploads').upload(path, formData.logoFile, { upsert: true })
        if (!uploadError) {
          const { data: publicUrl } = supabase.storage.from('crm-uploads').getPublicUrl(path)
          logoUrl = publicUrl.publicUrl
        }
      }

      if (formData.fotoFrenteFile) {
        const ext = formData.fotoFrenteFile.name.split('.').pop()
        const path = `${userId}/frente.${ext}`
        const { error: uploadError } = await supabase.storage.from('crm-uploads').upload(path, formData.fotoFrenteFile, { upsert: true })
        if (!uploadError) {
          const { data: publicUrl } = supabase.storage.from('crm-uploads').getPublicUrl(path)
          fotoFrenteUrl = publicUrl.publicUrl
        }
      }

      // 3. Inserir na Base de Dados (Tabela oficinas)
      // Nota: Certifica-te que as colunas 'codigo_postal' e 'localidade' existem no Supabase
      const { error: dbError } = await supabase.from('oficinas').insert({
        user_id: userId,
        nome_oficina: formData.nome_oficina,
        nipc: formData.nif, // Mantive nipc pois é o nome comum na coluna da BD
        morada: formData.morada,
        codigo_postal: formData.codigo_postal,
        localidade: formData.localidade,
        telefone: formData.telefone,
        telemovel: formData.telemovel,
        email_oficina: formData.email_oficina,
        responsavel_nome: formData.responsavel_nome,
        responsavel_telemovel: formData.responsavel_telemovel,
        responsavel_email: formData.responsavel_email,
        logo_url: logoUrl,
        foto_url: fotoFrenteUrl
      })

      if (dbError) throw dbError

      // Sucesso
      router.push('/dashboard/visao-geral')

    } catch (error: any) {
      console.error(error)
      alert('Erro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // ESTILOS AZUIS (CarManager)
  const inputClass = "w-full bg-zinc-50 border-2 border-zinc-200 p-3 rounded-xl focus:border-blue-600 outline-none transition-all font-bold text-zinc-900 placeholder:text-zinc-400"
  const labelClass = "text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 block"

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-10 px-4">
      <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-zinc-200">
        
        {/* BARRA LATERAL (AZUL - CarManager) */}
        <div className="bg-blue-600 text-white p-12 md:w-1/3 flex flex-col justify-between relative overflow-hidden">
          {/* Brilho Decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 blur-[120px] opacity-30 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="bg-white/20 w-fit p-3 rounded-xl mb-4 backdrop-blur-sm">
                <Wrench size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2 italic text-white uppercase">CarManager</h1>
            <div className="h-1 w-20 bg-white/50 rounded-full mb-4"></div>
            <p className="text-blue-100 text-sm font-medium">Controlo Total da Oficina</p>
          </div>

          <div className="space-y-10 my-8 relative z-10">
            <div className={`group flex items-center gap-5 transition-all ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-lg transition-all ${step >= 1 ? 'bg-white text-blue-600 border-white shadow-lg' : 'border-blue-300 text-blue-200'}`}>1</div>
                <div>
                  <span className="font-black block text-lg tracking-tight">DADOS</span>
                  <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">Identificação</span>
                </div>
            </div>
            
            <div className="w-0.5 h-8 bg-blue-400/50 ml-6"></div>

            <div className={`group flex items-center gap-5 transition-all ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-lg transition-all ${step >= 2 ? 'bg-white text-blue-600 border-white shadow-lg' : 'border-blue-300 text-blue-200'}`}>2</div>
                <div>
                  <span className="font-black block text-lg tracking-tight">CONTA</span>
                  <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">Acesso & Fotos</span>
                </div>
            </div>
          </div>
          
          <div className="relative z-10 text-xs font-bold text-blue-200 uppercase tracking-widest">
            Passo {step} de 2
          </div>
        </div>

        {/* FORMULÁRIO (BRANCO) */}
        <div className="p-10 md:w-2/3 max-h-[90vh] overflow-y-auto bg-white">
          
          {/* PASSO 1: DADOS */}
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
              
              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-6 uppercase tracking-tight flex items-center gap-3">
                  <span className="w-3 h-8 bg-blue-600 rounded-full block"></span>
                  Dados da Oficina
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="col-span-2">
                        <label className={labelClass}>Nome da Oficina *</label>
                        <input name="nome_oficina" value={formData.nome_oficina} onChange={handleChange} className={inputClass} placeholder="Ex: Auto Performance" required/>
                    </div>
                    <div>
                        <label className={labelClass}>NIPC (NIF) *</label>
                        <input name="nif" value={formData.nif} onChange={handleChange} className={inputClass} required/>
                    </div>
                    <div>
                        <label className={labelClass}>Email da Oficina *</label>
                        <input type="email" name="email_oficina" value={formData.email_oficina} onChange={handleChange} className={inputClass} required/>
                    </div>
                    <div className="col-span-2">
                        <label className={labelClass}>Morada *</label>
                        <input name="morada" value={formData.morada} onChange={handleChange} className={inputClass} required/>
                    </div>
                    
                    {/* CAMPOS REPOSTOS */}
                    <div>
                        <label className={labelClass}>Código Postal *</label>
                        <input name="codigo_postal" value={formData.codigo_postal} onChange={handleChange} className={inputClass} placeholder="0000-000" required/>
                    </div>
                    <div>
                        <label className={labelClass}>Localidade *</label>
                        <input name="localidade" value={formData.localidade} onChange={handleChange} className={inputClass} required/>
                    </div>
                    {/* FIM CAMPOS REPOSTOS */}

                    <div>
                        <label className={labelClass}>Telemóvel *</label>
                        <input name="telemovel" value={formData.telemovel} onChange={handleChange} className={inputClass} required/>
                    </div>
                    <div>
                        <label className={labelClass}>Telefone</label>
                        <input name="telefone" value={formData.telefone} onChange={handleChange} className={inputClass} />
                    </div>
                </div>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-2xl border-2 border-blue-100">
                <h2 className="text-lg font-black text-blue-900 mb-4 uppercase tracking-tight flex items-center gap-2">
                    <Check size={18} className="text-blue-600" strokeWidth={4}/> Responsável
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className={labelClass}>Nome Completo *</label>
                        <input name="responsavel_nome" value={formData.responsavel_nome} onChange={handleChange} className="w-full bg-white border-2 border-blue-100 p-3 rounded-xl focus:border-blue-600 outline-none font-bold text-zinc-900" required/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Telemóvel Resp. *</label>
                            <input name="responsavel_telemovel" value={formData.responsavel_telemovel} onChange={handleChange} className="w-full bg-white border-2 border-blue-100 p-3 rounded-xl focus:border-blue-600 outline-none font-bold text-zinc-900" required/>
                        </div>
                        <div>
                            <label className={labelClass}>Email Resp. *</label>
                            <input name="responsavel_email" value={formData.responsavel_email} onChange={handleChange} className="w-full bg-white border-2 border-blue-100 p-3 rounded-xl focus:border-blue-600 outline-none font-bold text-zinc-900" required/>
                        </div>
                    </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={handleNextStep} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-200 hover:scale-105 transition-all duration-300">
                  Seguinte <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* PASSO 2: LOGIN E FOTOS */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
              
              {/* LOGIN */}
              <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl">
                <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                   Criar Acesso Seguro
                </h2>
                <div className="grid gap-5">
                    <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 block">Email de Login *</label>
                        <input type="email" name="emailLogin" value={formData.emailLogin} onChange={handleChange} className="w-full bg-zinc-800 border-2 border-zinc-700 text-white p-3 rounded-xl focus:border-blue-500 outline-none font-bold placeholder:text-zinc-600" placeholder="email@exemplo.com" required/>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 block">Password *</label>
                        <input type="password" name="passwordLogin" value={formData.passwordLogin} onChange={handleChange} className="w-full bg-zinc-800 border-2 border-zinc-700 text-white p-3 rounded-xl focus:border-blue-500 outline-none font-bold placeholder:text-zinc-600" placeholder="••••••••" required/>
                    </div>
                </div>
              </div>

              {/* FOTOS */}
              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-6 uppercase tracking-tight flex items-center gap-3">
                  <span className="w-3 h-8 bg-blue-600 rounded-full block"></span>
                  Imagens
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  
                  {/* LOGO */}
                  <div className="relative group">
                     <label className={labelClass}>Logótipo</label>
                     {previews.logo ? (
                        <div className="w-full aspect-square bg-zinc-50 rounded-2xl overflow-hidden border-2 border-zinc-200 relative group-hover:border-blue-200 transition-colors">
                            <img src={previews.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                            <button onClick={() => removeImage('logoFile', 'logo')} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg shadow-lg hover:bg-red-600 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                     ) : (
                        <div className="w-full aspect-square border-2 border-dashed border-zinc-300 rounded-2xl hover:border-blue-600 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-zinc-400 hover:text-blue-600 relative group">
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logoFile', 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <Upload size={32} strokeWidth={2} className="group-hover:scale-110 transition-transform"/>
                            <span className="text-xs font-black mt-3 uppercase tracking-wider">Carregar Logo</span>
                        </div>
                     )}
                  </div>

                  {/* FOTO FRENTE */}
                  <div className="relative group">
                     <label className={labelClass}>Fachada da Oficina</label>
                     {previews.fotoFrente ? (
                        <div className="w-full aspect-square bg-zinc-50 rounded-2xl overflow-hidden border-2 border-zinc-200 relative group-hover:border-blue-200 transition-colors">
                            <img src={previews.fotoFrente} alt="Frente" className="w-full h-full object-cover" />
                            <button onClick={() => removeImage('fotoFrenteFile', 'fotoFrente')} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg shadow-lg hover:bg-red-600 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                     ) : (
                        <div className="w-full aspect-square border-2 border-dashed border-zinc-300 rounded-2xl hover:border-blue-600 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-zinc-400 hover:text-blue-600 relative group">
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'fotoFrenteFile', 'fotoFrente')} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <Camera size={32} strokeWidth={2} className="group-hover:scale-110 transition-transform"/>
                            <span className="text-xs font-black mt-3 uppercase tracking-wider">Carregar Foto</span>
                        </div>
                     )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t-2 border-zinc-100 mt-4">
                <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-zinc-900 px-4 py-2 flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors">
                  <ArrowLeft size={16} /> Voltar
                </button>
                <button 
                  onClick={handleFinalSubmit} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Finalizar <Check size={20} strokeWidth={3}/></>}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}