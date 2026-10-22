'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronLeft, Loader2, CalendarCheck, Users } from 'lucide-react'
import {
  PRICING_DATA, BARBERS, BOOKING_DAYS_AHEAD, LOCATIONS,
  dataISO, estaAberto, vagasDisponiveis, type Ocupado,
} from '@/lib/siteData'
import { obterOcupados, criarMarcacao } from '@/app/barbearia/actions'

const QUALQUER = 'qualquer'
const PASSOS = ['Serviço', 'Barbeiro', 'Data e hora', 'Dados']
const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export default function BookingForm() {
  const [passo, setPasso] = useState(0)
  const [servicoId, setServicoId] = useState<string | null>(null)
  const [barbeiroId, setBarbeiroId] = useState<string | null>(null)
  const [dia, setDia] = useState<Date | null>(null)
  const [hora, setHora] = useState<string | null>(null)
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', notas: '' })

  const [ocupados, setOcupados] = useState<Ocupado[]>([])
  const [aCarregar, setACarregar] = useState(false)
  const [falhouHorarios, setFalhouHorarios] = useState(false)
  const [aEnviar, setAEnviar] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [confirmada, setConfirmada] = useState<{ id: number; barbeiro: string } | null>(null)

  const servico = PRICING_DATA.find(s => s.id === servicoId)

  const dias = useMemo(() => {
    const lista: Date[] = []
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    for (let i = 0; i <= BOOKING_DAYS_AHEAD; i++) {
      const d = new Date(hoje)
      d.setDate(hoje.getDate() + i)
      lista.push(d)
    }
    return lista
  }, [])

  // Ao escolher um dia, carrega os horários ocupados
  const escolherDia = async (d: Date) => {
    setDia(d)
    setHora(null)
    setACarregar(true)
    setErro(null)
    const res = await obterOcupados(dataISO(d))
    if (res.error) setErro(res.error)
    setFalhouHorarios(!!res.error)
    setOcupados(res.ocupados ?? [])
    setACarregar(false)
  }

  // Vagas por barbeiro (para "sem preferência" usamos a união)
  const vagasPorBarbeiro = useMemo(() => {
    if (!dia || !servico) return {} as Record<string, string[]>
    return Object.fromEntries(
      BARBERS.map(b => [b.id, vagasDisponiveis(dia, servico.duration, b.id, ocupados)])
    ) as Record<string, string[]>
  }, [dia, servico, ocupados])

  const vagas = useMemo(() => {
    if (!barbeiroId) return []
    if (barbeiroId !== QUALQUER) return vagasPorBarbeiro[barbeiroId] ?? []
    return [...new Set(Object.values(vagasPorBarbeiro).flat())].sort()
  }, [barbeiroId, vagasPorBarbeiro])

  const barbeiroFinal = () => {
    if (barbeiroId !== QUALQUER) return barbeiroId!
    return BARBERS.find(b => vagasPorBarbeiro[b.id]?.includes(hora!))!.id
  }

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!servico || !dia || !hora || !barbeiroId) return
    setAEnviar(true)
    setErro(null)
    const bId = barbeiroFinal()
    const res = await criarMarcacao({
      data: dataISO(dia), hora, servicoId: servico.id, barbeiroId: bId, ...form,
    })
    setAEnviar(false)
    if (res.error) {
      setErro(res.error)
      if (res.error.includes('ocupado')) {
        setHora(null)
        setPasso(2)
        const r = await obterOcupados(dataISO(dia))
        setOcupados(r.ocupados ?? [])
      }
      return
    }
    setConfirmada({ id: res.id!, barbeiro: BARBERS.find(b => b.id === bId)!.name })
  }

  const recomecar = () => {
    setPasso(0); setServicoId(null); setBarbeiroId(null); setDia(null); setHora(null)
    setForm({ nome: '', telefone: '', email: '', notas: '' }); setConfirmada(null); setErro(null)
  }

  // --- ECRÃ DE CONFIRMAÇÃO ---
  if (confirmada && servico && dia && hora) {
    return (
      <div className="p-8 md:p-10 rounded-3xl bg-sky-900 border border-gold-500/30 text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-gold-500 flex items-center justify-center text-sky-950">
          <Check size={32} strokeWidth={3} />
        </div>
        <div>
          <h3 className="font-display text-3xl font-bold">Marcação confirmada!</h3>
          <p className="text-sky-100/70 mt-2">Obrigado, {form.nome.split(' ')[0]}. Esperamos por si.</p>
        </div>
        <dl className="text-left bg-sky-950 rounded-2xl p-6 space-y-3 text-sm">
          <Linha k="Serviço" v={`${servico.name} · ${servico.price} €`} />
          <Linha k="Barbeiro" v={confirmada.barbeiro} />
          <Linha k="Data" v={`${DIAS_CURTOS[dia.getDay()]}, ${dia.getDate()} ${MESES[dia.getMonth()]} às ${hora}`} />
          <Linha k="Morada" v={LOCATIONS[0].address} />
          <Linha k="Referência" v={`#${confirmada.id}`} />
        </dl>
        <p className="text-xs text-sky-100/50">
          Precisa de desmarcar? Ligue para {LOCATIONS[0].phone} com a referência da marcação.
        </p>
        <button onClick={recomecar} className="text-gold-400 font-bold text-sm hover:underline">
          Fazer outra marcação
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-sky-900 border border-white/10 overflow-hidden">
      {/* Progresso */}
      <ol className="grid grid-cols-4 border-b border-white/10">
        {PASSOS.map((p, i) => (
          <li key={p} className={`py-4 px-2 text-center text-[11px] sm:text-xs font-black uppercase tracking-wider border-b-2 transition-colors ${
            i === passo ? 'border-gold-500 text-gold-400' : i < passo ? 'border-gold-500/40 text-sky-100/90' : 'border-transparent text-sky-100/30'
          }`}>
            <span className="hidden sm:inline">{i + 1}. </span>{p}
          </li>
        ))}
      </ol>

      <div className="p-6 md:p-8">
        {passo > 0 && (
          <button onClick={() => { setPasso(passo - 1); setErro(null) }} className="mb-6 flex items-center gap-1 text-sm font-bold text-sky-100/70 hover:text-white">
            <ChevronLeft size={16} /> Voltar
          </button>
        )}

        {erro && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-bold">{erro}</div>
        )}

        {/* 1. SERVIÇO */}
        {passo === 0 && (
          <div className="grid sm:grid-cols-2 gap-3">
            {PRICING_DATA.map(s => (
              <Opcao key={s.id} ativo={servicoId === s.id} onClick={() => { setServicoId(s.id); setHora(null); setPasso(1) }}>
                <div className="flex justify-between gap-3">
                  <span className="font-black">{s.name}</span>
                  <span className="text-gold-400 font-black">{s.price} €</span>
                </div>
                <span className="text-xs text-sky-100/50 font-bold">{s.duration} min</span>
              </Opcao>
            ))}
          </div>
        )}

        {/* 2. BARBEIRO */}
        {passo === 1 && (
          <div className="grid sm:grid-cols-2 gap-3">
            <Opcao ativo={barbeiroId === QUALQUER} onClick={() => { setBarbeiroId(QUALQUER); setHora(null); setPasso(2) }}>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center text-gold-400"><Users size={20} /></div>
                <div>
                  <p className="font-black">Sem preferência</p>
                  <p className="text-xs text-sky-100/50">Mais horários disponíveis</p>
                </div>
              </div>
            </Opcao>
            {BARBERS.map(b => (
              <Opcao key={b.id} ativo={barbeiroId === b.id} onClick={() => { setBarbeiroId(b.id); setHora(null); setPasso(2) }}>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center text-sm font-black text-sky-950">{b.initials}</div>
                  <div>
                    <p className="font-black">{b.name}</p>
                    <p className="text-xs text-sky-100/50">{b.specialty}</p>
                  </div>
                </div>
              </Opcao>
            ))}
          </div>
        )}

        {/* 3. DATA E HORA */}
        {passo === 2 && (
          <div className="space-y-8">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {dias.map(d => {
                const aberto = estaAberto(d)
                const sel = dia && dataISO(d) === dataISO(dia)
                return (
                  <button
                    key={dataISO(d)}
                    disabled={!aberto}
                    onClick={() => escolherDia(d)}
                    className={`shrink-0 w-16 py-3 rounded-2xl border text-center transition-colors ${
                      sel ? 'bg-gold-500 border-gold-500 text-sky-950'
                        : aberto ? 'border-white/15 hover:border-gold-500/60'
                        : 'border-white/10 text-white/15 cursor-not-allowed'
                    }`}
                  >
                    <span className="block text-[10px] font-black uppercase">{DIAS_CURTOS[d.getDay()]}</span>
                    <span className="block text-xl font-black">{d.getDate()}</span>
                    <span className="block text-[10px] font-bold uppercase">{MESES[d.getMonth()]}</span>
                  </button>
                )
              })}
            </div>

            {!dia && <p className="text-center text-sky-100/50 text-sm font-bold">Escolha um dia para ver os horários.</p>}

            {dia && aCarregar && (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-gold-400" /></div>
            )}

            {dia && !aCarregar && !falhouHorarios && (
              vagas.length === 0 ? (
                <p className="text-center text-sky-100/50 text-sm font-bold">Sem horários livres neste dia. Experimente outro.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {vagas.map(h => (
                    <button
                      key={h}
                      onClick={() => setHora(h)}
                      className={`py-3 rounded-xl border font-black text-sm transition-colors ${
                        hora === h ? 'bg-gold-500 border-gold-500 text-sky-950' : 'border-white/15 hover:border-gold-500/60'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )
            )}

            <button
              disabled={!hora}
              onClick={() => setPasso(3)}
              className="w-full py-4 rounded-2xl bg-gold-500 text-sky-950 font-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold-400 transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {/* 4. DADOS */}
        {passo === 3 && servico && dia && hora && (
          <form onSubmit={submeter} className="space-y-5">
            <div className="p-4 rounded-2xl bg-sky-950 text-sm flex flex-wrap gap-x-6 gap-y-1 items-center">
              <CalendarCheck size={18} className="text-gold-400" />
              <span className="font-black">{servico.name}</span>
              <span className="text-sky-100/70">{DIAS_CURTOS[dia.getDay()]}, {dia.getDate()} {MESES[dia.getMonth()]} · {hora}</span>
              <span className="text-sky-100/70">{barbeiroId === QUALQUER ? 'Sem preferência' : BARBERS.find(b => b.id === barbeiroId)?.name}</span>
              <span className="text-gold-400 font-black ml-auto">{servico.price} €</span>
            </div>

            <Campo label="Nome *">
              <input required minLength={2} maxLength={100} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className={INPUT} autoComplete="name" />
            </Campo>
            <div className="grid sm:grid-cols-2 gap-5">
              <Campo label="Telemóvel *">
                <input required type="tel" pattern="[0-9 +()-]{9,}" maxLength={30} value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} className={INPUT} autoComplete="tel" placeholder="912 345 678" />
              </Campo>
              <Campo label="Email">
                <input type="email" maxLength={120} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={INPUT} autoComplete="email" />
              </Campo>
            </div>
            <Campo label="Notas">
              <textarea rows={3} maxLength={500} value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} className={INPUT} placeholder="Algum pedido especial?" />
            </Campo>

            <button
              type="submit"
              disabled={aEnviar}
              className="w-full py-4 rounded-2xl bg-gold-500 text-sky-950 font-black hover:bg-gold-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {aEnviar && <Loader2 size={18} className="animate-spin" />} Confirmar marcação
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

const INPUT = 'w-full bg-sky-950 border border-white/15 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-gold-500 transition-colors placeholder:text-sky-100/30'

function Opcao({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-5 rounded-2xl border transition-colors space-y-1 ${
        ativo ? 'border-gold-500 bg-gold-500/10' : 'border-white/15 hover:border-gold-500/60'
      }`}
    >
      {children}
    </button>
  )
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-black uppercase tracking-wider text-sky-100/70">{label}</span>
      {children}
    </label>
  )
}

function Linha({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-sky-100/50 font-bold">{k}</dt>
      <dd className="font-bold text-right">{v}</dd>
    </div>
  )
}
