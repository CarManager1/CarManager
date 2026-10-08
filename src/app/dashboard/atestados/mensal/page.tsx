'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Printer, CheckCircle2, Wallet } from 'lucide-react'
import {
  type Atestado, type EstadoAtestado, type Medico,
  ESTADOS, ESTADO_CORES, carregarEscola, dataISO, euros, formatarData, formatarHora
} from '@/lib/atestados'
import { AreaImpressaoLista } from '@/components/atestados/area-impressao-lista'

type LinhaMedico = {
  medicoId: number | null
  nome: string
  contagem: Record<EstadoAtestado, number>
  aPagar: number
  pago: number
  porPagar: number
}

const contagemVazia = (): Record<EstadoAtestado, number> => ({ Marcado: 0, Realizado: 0, Faltou: 0, Cancelado: 0 })

export default function AtestadosMensalPage() {
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [escolaId, setEscolaId] = useState<number | null>(null)
  const [nomeEscola, setNomeEscola] = useState('')

  const hoje = new Date()
  const [mes, setMes] = useState(`${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`)
  const [atestados, setAtestados] = useState<Atestado[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [medicoFiltro, setMedicoFiltro] = useState('todos')

  const [versao, setVersao] = useState(0)
  useEffect(() => {
    async function iniciar() {
      const escola = await carregarEscola()
      if (!escola) {
        setErro('Não foi encontrada a escola associada a este utilizador.')
        setLoading(false)
        return
      }
      setEscolaId(escola.escolaId)
      setNomeEscola(escola.nomeEscola)
      const { data } = await supabase.from('medicos').select('*').eq('workshop_id', escola.escolaId).order('nome')
      setMedicos((data as Medico[]) || [])
      setLoading(false)
    }
    iniciar()
  }, [])

  useEffect(() => {
    if (!escolaId) return
    let ativo = true
    const [a, mm] = mes.split('-').map(Number)
    supabase
      .from('atestados')
      .select('*')
      .eq('workshop_id', escolaId)
      .gte('data', dataISO(new Date(a, mm - 1, 1)))
      .lte('data', dataISO(new Date(a, mm, 0)))
      .order('data')
      .order('hora')
      .then(({ data, error }) => {
        if (!ativo) return
        setErro(error ? 'Não foi possível carregar os atestados. Confirme que a tabela "atestados" foi criada no Supabase.' : null)
        setAtestados((data as Atestado[]) || [])
      })
    return () => { ativo = false }
  }, [escolaId, mes, versao])

  const mudarMes = (delta: number) => {
    const [a, m] = mes.split('-').map(Number)
    const d = new Date(a, m - 1 + delta, 1)
    setMes(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const nomeMedico = useCallback((id: number | null) => medicos.find(m => m.id === id)?.nome || 'Sem médico', [medicos])

  const filtrados = useMemo(
    () => atestados.filter(a => medicoFiltro === 'todos' || String(a.medico_id) === medicoFiltro),
    [atestados, medicoFiltro]
  )

  // Só os atestados REALIZADOS contam para pagar ao médico
  const porMedico = useMemo(() => {
    const mapa = new Map<string, LinhaMedico>()
    for (const a of filtrados) {
      const chave = String(a.medico_id ?? 'nenhum')
      if (!mapa.has(chave)) {
        mapa.set(chave, { medicoId: a.medico_id, nome: nomeMedico(a.medico_id), contagem: contagemVazia(), aPagar: 0, pago: 0, porPagar: 0 })
      }
      const linha = mapa.get(chave)!
      linha.contagem[a.estado]++
      if (a.estado === 'Realizado') {
        const v = Number(a.valor_medico) || 0
        linha.aPagar += v
        if (a.pago_medico) linha.pago += v
        else linha.porPagar += v
      }
    }
    return [...mapa.values()].sort((x, y) => x.nome.localeCompare(y.nome))
  }, [filtrados, nomeMedico])

  const totais = useMemo(() => {
    const contagem = contagemVazia()
    let aPagar = 0, porPagar = 0, recebidoAlunos = 0
    for (const a of filtrados) {
      contagem[a.estado]++
      if (a.estado === 'Realizado') {
        aPagar += Number(a.valor_medico) || 0
        if (!a.pago_medico) porPagar += Number(a.valor_medico) || 0
        recebidoAlunos += Number(a.valor_aluno) || 0
      }
    }
    return { contagem, aPagar, porPagar, recebidoAlunos }
  }, [filtrados])

  const marcarPago = async (linha: LinhaMedico, pago: boolean) => {
    const ids = filtrados
      .filter(a => a.estado === 'Realizado' && a.medico_id === linha.medicoId && a.pago_medico !== pago)
      .map(a => a.id)
    if (ids.length === 0) return
    const msg = pago
      ? `Marcar ${ids.length} atestado(s) de ${linha.nome} como PAGOS (${euros(linha.porPagar)})?`
      : `Voltar a marcar os atestados de ${linha.nome} como POR PAGAR?`
    if (!confirm(msg)) return
    const { error } = await supabase.from('atestados').update({ pago_medico: pago }).in('id', ids)
    if (error) return alert('Erro ao atualizar: ' + error.message)
    setVersao(v => v + 1)
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
  }

  const [anoN, mesN] = mes.split('-').map(Number)
  const mesExtenso = new Date(anoN, mesN - 1, 1).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
  const nomeMes = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1)

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in">
      <Link href="/dashboard/atestados" className="text-sm font-bold text-zinc-400 hover:text-zinc-900 flex items-center gap-1 mb-4">
        <ArrowLeft size={16} /> Voltar às marcações
      </Link>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 uppercase flex items-center gap-3">
            <Wallet className="text-blue-600" /> Resumo do mês
          </h1>
          <p className="text-zinc-500 font-medium">Contagem dos atestados e valores a pagar ao médico</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => mudarMes(-1)} className="p-2.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-900" aria-label="Mês anterior"><ChevronLeft size={20} /></button>
          <input type="month" value={mes} onChange={e => e.target.value && setMes(e.target.value)} className="p-2.5 border border-zinc-200 rounded-xl font-bold text-sm bg-white" />
          <button onClick={() => mudarMes(1)} className="p-2.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-900" aria-label="Mês seguinte"><ChevronRight size={20} /></button>
          <select value={medicoFiltro} onChange={e => setMedicoFiltro(e.target.value)} className="p-2.5 border border-zinc-200 rounded-xl font-bold text-sm bg-white">
            <option value="todos">Todos os médicos</option>
            {medicos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
          <button onClick={() => window.print()} className="bg-zinc-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-zinc-800">
            <Printer size={16} /> Imprimir
          </button>
        </div>
      </div>

      {erro && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium text-sm">{erro}</div>}

      {/* CONTAGENS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="border border-zinc-200 bg-white rounded-2xl p-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total marcações</div>
          <div className="text-2xl font-black">{filtrados.length}</div>
        </div>
        {ESTADOS.map(e => (
          <div key={e} className={`border rounded-2xl p-4 ${ESTADO_CORES[e]}`}>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">{e === 'Marcado' ? 'Por fazer' : e}</div>
            <div className="text-2xl font-black">{totais.contagem[e]}</div>
          </div>
        ))}
      </div>

      {/* VALORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <div className="bg-zinc-900 text-white rounded-3xl p-6">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total a pagar ao médico</div>
          <div className="text-3xl font-black">{euros(totais.aPagar)}</div>
          <div className="text-xs text-zinc-400 mt-1">{totais.contagem.Realizado} atestado(s) realizado(s)</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 text-orange-800 rounded-3xl p-6">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Ainda por pagar</div>
          <div className="text-3xl font-black">{euros(totais.porPagar)}</div>
        </div>
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-3xl p-6">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Cobrado aos alunos</div>
          <div className="text-3xl font-black">{euros(totais.recebidoAlunos)}</div>
          <div className="text-xs opacity-70 mt-1">Margem: {euros(totais.recebidoAlunos - totais.aPagar)}</div>
        </div>
      </div>

      {/* POR MÉDICO */}
      <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-3">Por médico</h2>
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-x-auto mb-8 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <tr>
              <th className="text-left p-4">Médico</th>
              <th className="p-4">Feitos</th>
              <th className="p-4">Faltas</th>
              <th className="p-4">Cancel.</th>
              <th className="p-4">Por fazer</th>
              <th className="text-right p-4">A pagar</th>
              <th className="text-right p-4">Por pagar</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {porMedico.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-zinc-400 font-medium">Sem atestados em {nomeMes}.</td></tr>
            )}
            {porMedico.map(l => (
              <tr key={String(l.medicoId)} className="border-t border-zinc-100">
                <td className="p-4 font-bold">{l.nome}</td>
                <td className="p-4 text-center font-bold text-green-700">{l.contagem.Realizado}</td>
                <td className="p-4 text-center text-orange-700">{l.contagem.Faltou}</td>
                <td className="p-4 text-center text-zinc-500">{l.contagem.Cancelado}</td>
                <td className="p-4 text-center text-blue-700">{l.contagem.Marcado}</td>
                <td className="p-4 text-right font-black">{euros(l.aPagar)}</td>
                <td className="p-4 text-right font-bold text-orange-700">{euros(l.porPagar)}</td>
                <td className="p-4 text-right">
                  {l.porPagar > 0 ? (
                    <button onClick={() => marcarPago(l, true)} className="px-3 py-2 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-1 whitespace-nowrap">
                      <CheckCircle2 size={14} /> Marcar pago
                    </button>
                  ) : l.pago > 0 ? (
                    <button onClick={() => marcarPago(l, false)} className="text-xs font-bold text-green-700 hover:underline whitespace-nowrap">Pago ✔ (desfazer)</button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETALHE */}
      <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-3">Detalhe ({filtrados.length})</h2>
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <tr>
              <th className="text-left p-3">Data</th>
              <th className="text-left p-3">Aluno</th>
              <th className="text-left p-3">Cat.</th>
              <th className="text-left p-3">Médico</th>
              <th className="text-left p-3">Estado</th>
              <th className="text-right p-3">Médico €</th>
              <th className="text-center p-3">Pago</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(a => (
              <tr key={a.id} className="border-t border-zinc-100">
                <td className="p-3 whitespace-nowrap">{formatarData(a.data)} <span className="text-zinc-400">{formatarHora(a.hora)}</span></td>
                <td className="p-3 font-bold">{a.nome_aluno}</td>
                <td className="p-3">{a.categoria}</td>
                <td className="p-3">{nomeMedico(a.medico_id)}</td>
                <td className="p-3"><span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${ESTADO_CORES[a.estado]}`}>{a.estado}</span></td>
                <td className="p-3 text-right">{a.estado === 'Realizado' ? euros(a.valor_medico) : '—'}</td>
                <td className="p-3 text-center">{a.estado === 'Realizado' ? (a.pago_medico ? '✔' : '✘') : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RELATÓRIO PARA IMPRESSÃO */}
      <AreaImpressaoLista>
        <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
          <div>
            <div className="text-lg font-black uppercase">{nomeEscola || 'Escola de Condução'}</div>
            <div className="text-sm font-bold">Resumo mensal de atestados médicos — {nomeMes}</div>
          </div>
          <div className="text-right text-xs">
            {medicoFiltro !== 'todos' && <div>Médico: <b>{nomeMedico(Number(medicoFiltro))}</b></div>}
            <div>Impresso em {new Date().toLocaleDateString('pt-PT')}</div>
          </div>
        </div>

        <table className="w-full border-collapse mb-6">
          <thead>
            <tr>
              {['Médico', 'Feitos', 'Faltas', 'Cancelados', 'Por fazer', 'Total a pagar', 'Já pago', 'Por pagar'].map(h => (
                <th key={h} className="border border-black px-2 py-1 text-left font-black uppercase text-[9px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {porMedico.map(l => (
              <tr key={String(l.medicoId)}>
                <td className="border border-black px-2 py-1 font-bold">{l.nome}</td>
                <td className="border border-black px-2 py-1">{l.contagem.Realizado}</td>
                <td className="border border-black px-2 py-1">{l.contagem.Faltou}</td>
                <td className="border border-black px-2 py-1">{l.contagem.Cancelado}</td>
                <td className="border border-black px-2 py-1">{l.contagem.Marcado}</td>
                <td className="border border-black px-2 py-1 font-bold">{euros(l.aPagar)}</td>
                <td className="border border-black px-2 py-1">{euros(l.pago)}</td>
                <td className="border border-black px-2 py-1">{euros(l.porPagar)}</td>
              </tr>
            ))}
            <tr className="font-black">
              <td className="border border-black px-2 py-1">TOTAL</td>
              <td className="border border-black px-2 py-1">{totais.contagem.Realizado}</td>
              <td className="border border-black px-2 py-1">{totais.contagem.Faltou}</td>
              <td className="border border-black px-2 py-1">{totais.contagem.Cancelado}</td>
              <td className="border border-black px-2 py-1">{totais.contagem.Marcado}</td>
              <td className="border border-black px-2 py-1">{euros(totais.aPagar)}</td>
              <td className="border border-black px-2 py-1">{euros(totais.aPagar - totais.porPagar)}</td>
              <td className="border border-black px-2 py-1">{euros(totais.porPagar)}</td>
            </tr>
          </tbody>
        </table>

        <div className="font-black uppercase text-[10px] mb-1">Detalhe dos atestados</div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['#', 'Data', 'Hora', 'Aluno', 'Nº CC / NIF', 'Cat.', 'Médico', 'Estado', 'Valor'].map(h => (
                <th key={h} className="border border-black px-1.5 py-1 text-left font-black uppercase text-[9px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((a, i) => (
              <tr key={a.id} className="break-inside-avoid">
                <td className="border border-black px-1.5 py-0.5">{i + 1}</td>
                <td className="border border-black px-1.5 py-0.5">{formatarData(a.data)}</td>
                <td className="border border-black px-1.5 py-0.5">{formatarHora(a.hora)}</td>
                <td className="border border-black px-1.5 py-0.5">{a.nome_aluno}</td>
                <td className="border border-black px-1.5 py-0.5">{a.documento || ''}</td>
                <td className="border border-black px-1.5 py-0.5">{a.categoria || ''}</td>
                <td className="border border-black px-1.5 py-0.5">{nomeMedico(a.medico_id)}</td>
                <td className="border border-black px-1.5 py-0.5">{a.estado}</td>
                <td className="border border-black px-1.5 py-0.5 text-right">{a.estado === 'Realizado' ? euros(a.valor_medico) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-10 flex justify-between text-xs">
          <span>Total a pagar: <b>{euros(totais.aPagar)}</b></span>
          <span>Recebi a quantia acima: ________________________________</span>
        </div>
      </AreaImpressaoLista>
    </div>
  )
}
