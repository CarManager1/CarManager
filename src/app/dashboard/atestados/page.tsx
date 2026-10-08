'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Stethoscope, ChevronLeft, ChevronRight, Plus, Printer, Loader2, X,
  Pencil, Trash2, CheckCircle2, UserX, Ban, Undo2, BarChart3, UserCog, Phone
} from 'lucide-react'
import {
  type Atestado, type EstadoAtestado, type Medico,
  CATEGORIAS, TIPOS, ESTADO_CORES, carregarEscola, dataISO, euros, formatarData, formatarHora
} from '@/lib/atestados'
import { AreaImpressaoLista } from '@/components/atestados/area-impressao-lista'

const FORM_VAZIO = {
  data: dataISO(new Date()),
  hora: '09:00',
  nome_aluno: '',
  documento: '',
  telemovel: '',
  categoria: 'B',
  tipo: 'Novo título',
  medico_id: '',
  valor_medico: '',
  valor_aluno: '',
  observacoes: '',
}

const inputCls = 'w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-medium text-sm'
const labelCls = 'text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block'

export default function AtestadosPage() {
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [escolaId, setEscolaId] = useState<number | null>(null)
  const [nomeEscola, setNomeEscola] = useState('')
  const [role, setRole] = useState('owner')

  const [dia, setDia] = useState(dataISO(new Date()))
  const [medicoFiltro, setMedicoFiltro] = useState('todos')
  const [atestados, setAtestados] = useState<Atestado[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])

  const [modalAberto, setModalAberto] = useState(false)
  const [editarId, setEditarId] = useState<number | null>(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [aGuardar, setAGuardar] = useState(false)

  const [modalMedicos, setModalMedicos] = useState(false)
  const [novoMedico, setNovoMedico] = useState({ nome: '', valor: '' })

  // --- CARREGAR ---
  const carregarMedicos = useCallback(async (id: number) => {
    const { data } = await supabase.from('medicos').select('*').eq('workshop_id', id).order('nome')
    setMedicos((data as Medico[]) || [])
  }, [])

  const [versao, setVersao] = useState(0)
  const recarregar = () => setVersao(v => v + 1)

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
      setRole(escola.role)
      await carregarMedicos(escola.escolaId)
      setLoading(false)
    }
    iniciar()
  }, [carregarMedicos])

  useEffect(() => {
    if (!escolaId) return
    let ativo = true
    supabase
      .from('atestados')
      .select('*')
      .eq('workshop_id', escolaId)
      .eq('data', dia)
      .order('hora', { ascending: true })
      .then(({ data, error }) => {
        if (!ativo) return
        setErro(error ? 'Não foi possível carregar os atestados. Confirme que a tabela "atestados" foi criada no Supabase.' : null)
        setAtestados((data as Atestado[]) || [])
      })
    return () => { ativo = false }
  }, [escolaId, dia, versao])

  // --- NAVEGAÇÃO ENTRE DIAS ---
  const mudarDia = (delta: number) => {
    const [a, m, d] = dia.split('-').map(Number)
    setDia(dataISO(new Date(a, m - 1, d + delta)))
  }

  const nomeMedico = (id: number | null) => medicos.find(m => m.id === id)?.nome || '—'

  const visiveis = useMemo(
    () => atestados.filter(a => medicoFiltro === 'todos' || String(a.medico_id) === medicoFiltro),
    [atestados, medicoFiltro]
  )
  const paraImprimir = visiveis.filter(a => a.estado !== 'Cancelado')

  // --- FORMULÁRIO ---
  const abrirNovo = () => {
    const medicoPadrao = medicos.find(m => m.ativo)
    setEditarId(null)
    setForm({
      ...FORM_VAZIO,
      data: dia,
      medico_id: medicoPadrao ? String(medicoPadrao.id) : '',
      valor_medico: medicoPadrao ? String(medicoPadrao.valor_atestado) : '',
    })
    setModalAberto(true)
  }

  const abrirEditar = (a: Atestado) => {
    setEditarId(a.id)
    setForm({
      data: a.data,
      hora: formatarHora(a.hora) === '--:--' ? '' : formatarHora(a.hora),
      nome_aluno: a.nome_aluno,
      documento: a.documento || '',
      telemovel: a.telemovel || '',
      categoria: a.categoria || '',
      tipo: a.tipo || '',
      medico_id: a.medico_id ? String(a.medico_id) : '',
      valor_medico: String(a.valor_medico ?? ''),
      valor_aluno: String(a.valor_aluno ?? ''),
      observacoes: a.observacoes || '',
    })
    setModalAberto(true)
  }

  const escolherMedico = (id: string) => {
    const m = medicos.find(x => String(x.id) === id)
    setForm(f => ({ ...f, medico_id: id, valor_medico: m ? String(m.valor_atestado) : f.valor_medico }))
  }

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!escolaId || !form.nome_aluno.trim()) return
    setAGuardar(true)

    const registo = {
      workshop_id: escolaId,
      data: form.data,
      hora: form.hora || null,
      nome_aluno: form.nome_aluno.trim(),
      documento: form.documento.trim() || null,
      telemovel: form.telemovel.trim() || null,
      categoria: form.categoria || null,
      tipo: form.tipo || null,
      medico_id: form.medico_id ? Number(form.medico_id) : null,
      valor_medico: Number(form.valor_medico.replace(',', '.')) || 0,
      valor_aluno: Number(form.valor_aluno.replace(',', '.')) || 0,
      observacoes: form.observacoes.trim() || null,
    }

    const { error } = editarId
      ? await supabase.from('atestados').update(registo).eq('id', editarId)
      : await supabase.from('atestados').insert(registo)

    setAGuardar(false)
    if (error) {
      alert('Erro ao guardar: ' + error.message)
      return
    }
    setModalAberto(false)
    if (form.data !== dia) setDia(form.data)
    else recarregar()
  }

  const mudarEstado = async (a: Atestado, estado: EstadoAtestado) => {
    setAtestados(lista => lista.map(x => (x.id === a.id ? { ...x, estado } : x)))
    const { error } = await supabase.from('atestados').update({ estado }).eq('id', a.id)
    if (error) {
      alert('Erro ao atualizar: ' + error.message)
      recarregar()
    }
  }

  const apagar = async (a: Atestado) => {
    if (!confirm(`Apagar a marcação de ${a.nome_aluno}?`)) return
    const { error } = await supabase.from('atestados').delete().eq('id', a.id)
    if (error) return alert('Erro ao apagar: ' + error.message)
    setAtestados(lista => lista.filter(x => x.id !== a.id))
  }

  // --- MÉDICOS ---
  const adicionarMedico = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!escolaId || !novoMedico.nome.trim()) return
    const { error } = await supabase.from('medicos').insert({
      workshop_id: escolaId,
      nome: novoMedico.nome.trim(),
      valor_atestado: Number(novoMedico.valor.replace(',', '.')) || 0,
    })
    if (error) return alert('Erro ao guardar médico: ' + error.message)
    setNovoMedico({ nome: '', valor: '' })
    carregarMedicos(escolaId)
  }

  const atualizarMedico = async (m: Medico, alteracoes: Partial<Medico>) => {
    const { error } = await supabase.from('medicos').update(alteracoes).eq('id', m.id)
    if (error) return alert('Erro ao atualizar médico: ' + error.message)
    if (escolaId) carregarMedicos(escolaId)
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
  }

  const [ano, mes, d] = dia.split('-').map(Number)
  const diaSemana = new Date(ano, mes - 1, d).toLocaleDateString('pt-PT', { weekday: 'long' })
  const contagem = (e: EstadoAtestado) => visiveis.filter(a => a.estado === e).length

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 uppercase flex items-center gap-3">
            <Stethoscope className="text-blue-600" /> Atestados Médicos
          </h1>
          <p className="text-zinc-500 font-medium">Marcações de exames médicos dos alunos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {role !== 'mechanic' && (
            <>
              <Link href="/dashboard/atestados/mensal" className="bg-white border border-zinc-200 px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:border-zinc-900 transition-all">
                <BarChart3 size={18} /> Resumo do mês
              </Link>
              <button onClick={() => setModalMedicos(true)} className="bg-white border border-zinc-200 px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:border-zinc-900 transition-all">
                <UserCog size={18} /> Médicos
              </button>
            </>
          )}
          <button onClick={abrirNovo} className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
            <Plus size={18} /> Nova marcação
          </button>
        </div>
      </div>

      {erro && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium text-sm">{erro}</div>}

      {/* BARRA DO DIA */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-4 mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => mudarDia(-1)} className="p-2.5 rounded-xl hover:bg-zinc-100" aria-label="Dia anterior"><ChevronLeft size={20} /></button>
          <input type="date" value={dia} onChange={e => e.target.value && setDia(e.target.value)} className="p-2.5 border border-zinc-200 rounded-xl font-bold text-sm" />
          <button onClick={() => mudarDia(1)} className="p-2.5 rounded-xl hover:bg-zinc-100" aria-label="Dia seguinte"><ChevronRight size={20} /></button>
          <button onClick={() => setDia(dataISO(new Date()))} className="px-3 py-2.5 rounded-xl text-xs font-black uppercase text-blue-600 hover:bg-blue-50">Hoje</button>
          <span className="hidden md:inline text-sm font-bold text-zinc-400 capitalize ml-2">{diaSemana}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={medicoFiltro} onChange={e => setMedicoFiltro(e.target.value)} className="p-2.5 border border-zinc-200 rounded-xl font-bold text-sm bg-white">
            <option value="todos">Todos os médicos</option>
            {medicos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
          <button
            onClick={() => window.print()}
            disabled={paraImprimir.length === 0}
            className="bg-zinc-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-zinc-800 disabled:opacity-40"
          >
            <Printer size={16} /> Imprimir listagem
          </button>
        </div>
      </div>

      {/* CONTADORES DO DIA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {(['Marcado', 'Realizado', 'Faltou', 'Cancelado'] as EstadoAtestado[]).map(e => (
          <div key={e} className={`border rounded-2xl p-4 ${ESTADO_CORES[e]}`}>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">{e}</div>
            <div className="text-2xl font-black">{contagem(e)}</div>
          </div>
        ))}
      </div>

      {/* LISTA */}
      {visiveis.length === 0 ? (
        <div className="bg-white border border-dashed border-zinc-300 rounded-3xl p-12 text-center">
          <Stethoscope className="mx-auto text-zinc-300 mb-3" size={40} />
          <p className="font-bold text-zinc-500">Sem marcações para {formatarData(dia)}</p>
          <button onClick={abrirNovo} className="mt-4 text-sm font-bold text-blue-600 hover:underline">Marcar atestado</button>
        </div>
      ) : (
        <div className="space-y-3">
          {visiveis.map(a => (
            <div key={a.id} className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
              <div className="text-2xl font-black text-zinc-900 w-20 shrink-0">{formatarHora(a.hora)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-black uppercase tracking-tight text-zinc-900 truncate">{a.nome_aluno}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${ESTADO_CORES[a.estado]}`}>{a.estado}</span>
                </div>
                <div className="text-xs font-bold text-zinc-400 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  {a.categoria && <span>Cat. {a.categoria}</span>}
                  {a.tipo && <span>{a.tipo}</span>}
                  {a.documento && <span>Doc. {a.documento}</span>}
                  {a.telemovel && <span className="flex items-center gap-1"><Phone size={11} />{a.telemovel}</span>}
                  <span>Dr(a). {nomeMedico(a.medico_id)}</span>
                  {role !== 'mechanic' && <span>Médico: {euros(a.valor_medico)}</span>}
                </div>
                {a.observacoes && <div className="text-xs text-zinc-500 mt-1 italic">{a.observacoes}</div>}
              </div>
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {a.estado === 'Marcado' ? (
                  <>
                    <button onClick={() => mudarEstado(a, 'Realizado')} className="px-3 py-2 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"><CheckCircle2 size={14} /> Feito</button>
                    <button onClick={() => mudarEstado(a, 'Faltou')} className="px-3 py-2 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 flex items-center gap-1"><UserX size={14} /> Faltou</button>
                    <button onClick={() => mudarEstado(a, 'Cancelado')} className="px-3 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-600 hover:bg-zinc-200 flex items-center gap-1"><Ban size={14} /> Cancelar</button>
                  </>
                ) : (
                  <button onClick={() => mudarEstado(a, 'Marcado')} className="px-3 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-600 hover:bg-zinc-200 flex items-center gap-1"><Undo2 size={14} /> Repor</button>
                )}
                <button onClick={() => abrirEditar(a)} className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900" aria-label="Editar"><Pencil size={16} /></button>
                <button onClick={() => apagar(a)} className="p-2 rounded-xl text-zinc-400 hover:bg-red-50 hover:text-red-600" aria-label="Apagar"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL MARCAÇÃO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={guardar} className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase">{editarId ? 'Editar marcação' : 'Nova marcação'}</h2>
              <button type="button" onClick={() => setModalAberto(false)} className="p-2 rounded-xl hover:bg-zinc-100"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>Nome do aluno *</label>
                <input required autoFocus className={inputCls} value={form.nome_aluno} onChange={e => setForm({ ...form, nome_aluno: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Nº CC / NIF</label>
                <input className={inputCls} value={form.documento} onChange={e => setForm({ ...form, documento: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Telemóvel</label>
                <input type="tel" className={inputCls} value={form.telemovel} onChange={e => setForm({ ...form, telemovel: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Data *</label>
                <input required type="date" className={inputCls} value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Hora</label>
                <input type="time" className={inputCls} value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Categoria</label>
                <select className={inputCls} value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                  <option value="">—</option>
                  {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Tipo</label>
                <select className={inputCls} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                  <option value="">—</option>
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Médico</label>
                <select className={inputCls} value={form.medico_id} onChange={e => escolherMedico(e.target.value)}>
                  <option value="">—</option>
                  {medicos.filter(m => m.ativo || String(m.id) === form.medico_id).map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                </select>
                {medicos.length === 0 && <p className="text-[11px] text-orange-600 font-bold mt-1">Adicione primeiro um médico no botão “Médicos”.</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>A pagar ao médico €</label>
                  <input inputMode="decimal" className={inputCls} value={form.valor_medico} onChange={e => setForm({ ...form, valor_medico: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Cobrado ao aluno €</label>
                  <input inputMode="decimal" className={inputCls} value={form.valor_aluno} onChange={e => setForm({ ...form, valor_aluno: e.target.value })} />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Observações</label>
                <textarea rows={2} className={inputCls} value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setModalAberto(false)} className="px-5 py-3 rounded-2xl font-bold text-sm text-zinc-500 hover:bg-zinc-100">Cancelar</button>
              <button disabled={aGuardar} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {aGuardar && <Loader2 size={16} className="animate-spin" />} Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL MÉDICOS */}
      {modalMedicos && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase">Médicos</h2>
              <button onClick={() => setModalMedicos(false)} className="p-2 rounded-xl hover:bg-zinc-100"><X size={20} /></button>
            </div>

            <div className="space-y-2 mb-6">
              {medicos.length === 0 && <p className="text-sm text-zinc-400 font-medium">Ainda não há médicos registados.</p>}
              {medicos.map(m => (
                <div key={m.id} className={`flex items-center gap-2 p-3 border border-zinc-200 rounded-2xl ${m.ativo ? '' : 'opacity-50'}`}>
                  <span className="flex-1 font-bold text-sm">{m.nome}</span>
                  <input
                    defaultValue={m.valor_atestado}
                    inputMode="decimal"
                    title="Valor por atestado"
                    className="w-20 p-2 border border-zinc-200 rounded-lg text-sm font-bold text-right"
                    onBlur={e => {
                      const v = Number(e.target.value.replace(',', '.')) || 0
                      if (v !== Number(m.valor_atestado)) atualizarMedico(m, { valor_atestado: v })
                    }}
                  />
                  <span className="text-sm font-bold text-zinc-400">€</span>
                  <button onClick={() => atualizarMedico(m, { ativo: !m.ativo })} className="text-[10px] font-black uppercase px-2 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200">
                    {m.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={adicionarMedico} className="flex flex-col sm:flex-row gap-2">
              <input placeholder="Nome do médico" required className={inputCls} value={novoMedico.nome} onChange={e => setNovoMedico({ ...novoMedico, nome: e.target.value })} />
              <input placeholder="€ / atestado" inputMode="decimal" className={`${inputCls} sm:w-32`} value={novoMedico.valor} onChange={e => setNovoMedico({ ...novoMedico, valor: e.target.value })} />
              <button className="bg-zinc-900 text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1 shrink-0"><Plus size={16} /> Adicionar</button>
            </form>
            <p className="text-[11px] text-zinc-400 mt-3">O valor por atestado é sugerido automaticamente em cada nova marcação.</p>
          </div>
        </div>
      )}

      {/* LISTAGEM PARA IMPRESSÃO */}
      <AreaImpressaoLista>
        <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
          <div>
            <div className="text-lg font-black uppercase">{nomeEscola || 'Escola de Condução'}</div>
            <div className="text-sm font-bold">Listagem de atestados médicos — {formatarData(dia)} <span className="capitalize">({diaSemana})</span></div>
          </div>
          <div className="text-right text-xs">
            {medicoFiltro !== 'todos' && <div>Médico: <b>{nomeMedico(Number(medicoFiltro))}</b></div>}
            <div>Total: <b>{paraImprimir.length}</b></div>
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left">
              {['#', 'Hora', 'Nome do aluno', 'Nº CC / NIF', 'Cat.', 'Tipo', 'Médico', 'Feito', 'Observações'].map(h => (
                <th key={h} className="border border-black px-1.5 py-1 font-black uppercase text-[9px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paraImprimir.map((a, i) => (
              <tr key={a.id} className="break-inside-avoid">
                <td className="border border-black px-1.5 py-2">{i + 1}</td>
                <td className="border border-black px-1.5 py-2">{formatarHora(a.hora)}</td>
                <td className="border border-black px-1.5 py-2 font-bold">{a.nome_aluno}</td>
                <td className="border border-black px-1.5 py-2">{a.documento || ''}</td>
                <td className="border border-black px-1.5 py-2">{a.categoria || ''}</td>
                <td className="border border-black px-1.5 py-2">{a.tipo || ''}</td>
                <td className="border border-black px-1.5 py-2">{a.medico_id ? nomeMedico(a.medico_id) : ''}</td>
                <td className="border border-black px-1.5 py-2 text-center w-12">{a.estado === 'Realizado' ? '✔' : a.estado === 'Faltou' ? 'Faltou' : '☐'}</td>
                <td className="border border-black px-1.5 py-2 w-40">{a.observacoes || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-10 flex justify-between text-xs">
          <span>Impresso em {new Date().toLocaleString('pt-PT')}</span>
          <span>Assinatura do médico: ________________________________</span>
        </div>
      </AreaImpressaoLista>
    </div>
  )
}
