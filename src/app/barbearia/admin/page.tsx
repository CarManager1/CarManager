'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ChevronLeft, ChevronRight, Loader2, LogOut, Phone, Scissors } from 'lucide-react'
import { BRAND, BARBERS, WEEKDAYS, dataISO } from '@/lib/siteData'

type Marcacao = {
  id: number
  data: string
  hora: string
  duracao_min: number
  barbeiro_id: string
  servico_nome: string
  preco: number
  cliente_nome: string
  cliente_telefone: string
  cliente_email: string | null
  notas: string | null
  estado: 'confirmada' | 'concluida' | 'cancelada' | 'falta'
}

const ESTADOS: Record<Marcacao['estado'], { label: string; cor: string }> = {
  confirmada: { label: 'Confirmada', cor: 'bg-sky-100 text-sky-800' },
  concluida: { label: 'Concluída', cor: 'bg-green-100 text-green-800' },
  cancelada: { label: 'Cancelada', cor: 'bg-zinc-200 text-zinc-600' },
  falta: { label: 'Faltou', cor: 'bg-red-100 text-red-700' },
}

export default function BarbeariaAdminPage() {
  const [sessao, setSessao] = useState<'a-verificar' | 'sim' | 'nao'>('a-verificar')
  const [dia, setDia] = useState(() => new Date())
  const [marcacoes, setMarcacoes] = useState<Marcacao[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSessao(data.user ? 'sim' : 'nao'))
  }, [])

  // Recarrega as marcações sempre que muda o dia (ou após o login)
  useEffect(() => {
    if (sessao !== 'sim') return
    let ativo = true
    supabase
      .from('barbearia_marcacoes')
      .select('*')
      .eq('data', dataISO(dia))
      .order('hora')
      .then(({ data, error }) => {
        if (!ativo) return
        setErro(error ? 'Erro ao carregar marcações: ' + error.message : null)
        setMarcacoes((data ?? []) as Marcacao[])
        setLoading(false)
      })
    return () => { ativo = false }
  }, [sessao, dia])

  const mudarEstado = async (id: number, estado: Marcacao['estado']) => {
    const { error } = await supabase.from('barbearia_marcacoes').update({ estado }).eq('id', id)
    if (error) return setErro('Erro ao atualizar: ' + error.message)
    setMarcacoes(ms => ms.map(m => (m.id === id ? { ...m, estado } : m)))
  }

  const irPara = (d: Date) => { setLoading(true); setDia(d) }
  const mudarDia = (n: number) => { const x = new Date(dia); x.setDate(x.getDate() + n); irPara(x) }

  if (sessao === 'a-verificar') {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gold-500" /></div>
  }
  if (sessao === 'nao') return <Login onEntrar={() => setSessao('sim')} />

  const ativas = marcacoes.filter(m => m.estado !== 'cancelada')
  const faturacao = marcacoes.filter(m => m.estado === 'concluida').reduce((t, m) => t + Number(m.preco), 0)

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="bg-sky-950 text-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/barbearia" className="flex items-center gap-2 font-black">
            <span className="bg-gold-500 p-1.5 rounded-lg text-zinc-950"><Scissors size={18} /></span>
            {BRAND.name} <span className="text-zinc-500 font-bold text-sm">· Marcações</span>
          </Link>
          <button
            onClick={async () => { await supabase.auth.signOut(); setSessao('nao') }}
            className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1.5"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Navegação de dias */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => mudarDia(-1)} className="p-2.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100"><ChevronLeft size={18} /></button>
          <input
            type="date"
            value={dataISO(dia)}
            onChange={e => { if (e.target.value) { const [a, m, d] = e.target.value.split('-').map(Number); irPara(new Date(a, m - 1, d)) } }}
            className="px-4 py-2 rounded-xl bg-white border border-zinc-200 font-bold text-sm"
          />
          <button onClick={() => mudarDia(1)} className="p-2.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100"><ChevronRight size={18} /></button>
          <button onClick={() => irPara(new Date())} className="px-4 py-2 rounded-xl bg-sky-900 text-white font-bold text-sm">Hoje</button>
          <span className="font-black text-lg ml-2">{WEEKDAYS[dia.getDay()]}</span>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-3 gap-3">
          <Resumo label="Marcações" valor={String(ativas.length)} />
          <Resumo label="Concluídas" valor={String(marcacoes.filter(m => m.estado === 'concluida').length)} />
          <Resumo label="Faturado" valor={`${faturacao.toFixed(2)} €`} />
        </div>

        {erro && <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold">{erro}</div>}

        {/* Por barbeiro */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-gold-500" /></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {BARBERS.map(b => {
              const doBarbeiro = marcacoes.filter(m => m.barbeiro_id === b.id)
              return (
                <section key={b.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                  <h2 className="px-5 py-4 border-b border-zinc-100 font-black flex justify-between">
                    {b.name}
                    <span className="text-zinc-400 text-sm">{doBarbeiro.filter(m => m.estado !== 'cancelada').length}</span>
                  </h2>
                  <ul className="divide-y divide-zinc-100">
                    {doBarbeiro.length === 0 && <li className="px-5 py-8 text-center text-sm text-zinc-400 font-bold">Sem marcações</li>}
                    {doBarbeiro.map(m => (
                      <li key={m.id} className={`px-5 py-4 space-y-2 ${m.estado === 'cancelada' ? 'opacity-50' : ''}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-black text-lg">{m.hora.slice(0, 5)}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${ESTADOS[m.estado].cor}`}>{ESTADOS[m.estado].label}</span>
                        </div>
                        <p className="font-bold">{m.cliente_nome}</p>
                        <p className="text-sm text-zinc-500">{m.servico_nome} · {m.duracao_min} min · {Number(m.preco)} €</p>
                        <a href={`tel:${m.cliente_telefone}`} className="text-sm text-gold-700 font-bold flex items-center gap-1.5"><Phone size={13} /> {m.cliente_telefone}</a>
                        {m.notas && <p className="text-xs text-zinc-500 italic">“{m.notas}”</p>}
                        <select
                          value={m.estado}
                          onChange={e => mudarEstado(m.id, e.target.value as Marcacao['estado'])}
                          className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-xs font-bold bg-zinc-50"
                        >
                          {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

function Resumo({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5">
      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{label}</p>
      <p className="text-2xl font-black mt-1">{valor}</p>
    </div>
  )
}

function Login({ onEntrar }: { onEntrar: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setErro('Email ou palavra-passe incorretos.')
    onEntrar()
  }

  return (
    <div className="min-h-screen bg-sky-950 flex items-center justify-center px-6">
      <form onSubmit={entrar} className="w-full max-w-sm bg-sky-900 border border-white/10 rounded-3xl p-8 space-y-5 text-zinc-100">
        <div className="text-center">
          <div className="mx-auto w-fit bg-gold-500 p-3 rounded-2xl text-zinc-950"><Scissors size={24} /></div>
          <h1 className="mt-4 font-display text-2xl font-bold">Área da equipa</h1>
          <p className="text-sm text-zinc-500">{BRAND.name}</p>
        </div>
        {erro && <p className="text-sm text-red-400 font-bold text-center">{erro}</p>}
        <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-sky-950 border border-white/15 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-gold-500" />
        <input type="password" required placeholder="Palavra-passe" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-sky-950 border border-white/15 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-gold-500" />
        <button disabled={loading} className="w-full py-3 rounded-xl bg-gold-500 text-zinc-950 font-black hover:bg-gold-400 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Loader2 size={16} className="animate-spin" />} Entrar
        </button>
      </form>
    </div>
  )
}
