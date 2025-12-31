'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight, Wrench } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (data?.user) {
        const role = data.user.user_metadata?.role
        router.push(role === 'mechanic' ? '/dashboard/agenda' : '/dashboard/visao-geral')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Email ou password incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm space-y-8 border border-zinc-100">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 mb-2">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tighter">CarManager</h1>
            <p className="text-blue-400 text-sm font-bold uppercase tracking-widest">Controlo Total da Oficina</p>
          </div>
          <p className="text-zinc-500 font-medium pt-2">Bem-vindo de volta! Inicie sessão para continuar.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium transition-all" placeholder="exemplo@oficina.pt" required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Palavra-passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none font-medium transition-all" placeholder="••••••••" required />
          </div>
          {error && <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-2xl border border-red-100">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Entrar <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-500 font-medium">
          Ainda não tem conta? <Link href="/registo" className="text-blue-600 font-bold hover:underline">Criar nova oficina</Link>
        </p>
      </div>
    </div>
  )
}