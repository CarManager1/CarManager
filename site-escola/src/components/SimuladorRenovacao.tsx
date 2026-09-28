'use client'

import { useState } from 'react'
import { Check, X, Stethoscope, Brain, Car, CalendarDays, MessageCircle, RotateCcw, AlertTriangle } from 'lucide-react'
import { simular, type RespostasSimulador, type ResultadoSimulador, type SituacaoCarta } from '@/lib/renovacao'
import { PRECOS_RENOVACAO, formatarPreco } from '@/lib/precos'
import { linkWhatsApp } from './whatsapp'

const SITUACOES: { valor: SituacaoCarta; texto: string }[] = [
  { valor: 'valida', texto: 'Ainda está válida' },
  { valor: 'ate2', texto: 'Caducou há menos de 2 anos' },
  { valor: 'de2a5', texto: 'Caducou há 2 a 5 anos' },
  { valor: 'mais5', texto: 'Caducou há mais de 5 anos' },
]

function Opcao({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`text-left rounded-2xl border-2 px-4 py-3 font-bold transition ${
        ativo ? 'border-sky-600 bg-sky-50 text-sky-800' : 'border-zinc-200 bg-white hover:border-zinc-300'
      }`}
    >
      {children}
    </button>
  )
}

export function SimuladorRenovacao() {
  const [idade, setIdade] = useState('')
  const [pesados, setPesados] = useState<boolean | null>(null)
  const [profissional, setProfissional] = useState<boolean | null>(null)
  const [situacao, setSituacao] = useState<SituacaoCarta | null>(null)
  const [resultado, setResultado] = useState<ResultadoSimulador | null>(null)
  const [erro, setErro] = useState('')

  const idadeNum = Number(idade)
  const precisaProfissional = pesados === false

  function calcular(e: React.FormEvent) {
    e.preventDefault()
    if (!idade || idadeNum < 16 || idadeNum > 110) return setErro('Indica uma idade válida.')
    if (pesados === null) return setErro('Diz-nos que tipo de carta tens.')
    if (precisaProfissional && profissional === null) return setErro('Diz-nos se conduzes profissionalmente.')
    if (!situacao) return setErro('Indica a situação da tua carta.')
    setErro('')
    const respostas: RespostasSimulador = { idade: idadeNum, pesados, profissional: !!profissional && !pesados, situacao }
    setResultado(simular(respostas))
    setTimeout(() => document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function recomecar() {
    setResultado(null)
    setIdade('')
    setPesados(null)
    setProfissional(null)
    setSituacao(null)
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start">
      <form onSubmit={calcular} className="lg:col-span-2 bg-white rounded-3xl border-2 border-zinc-900 shadow-[6px_6px_0_0_#18181b] p-6 sm:p-8 space-y-7">
        <div>
          <label htmlFor="idade" className="font-black text-lg">1. Que idade tens?</label>
          <div className="mt-3 flex items-center gap-3">
            <input
              id="idade"
              type="number"
              inputMode="numeric"
              min={16}
              max={110}
              value={idade}
              onChange={(e) => { setIdade(e.target.value); setResultado(null) }}
              className="w-28 rounded-xl border-2 border-zinc-200 px-4 py-3 text-lg font-bold outline-none focus:border-sky-600"
              placeholder="00"
            />
            <span className="font-bold text-zinc-500">anos</span>
          </div>
          <p className="mt-2 text-xs text-zinc-500">A idade que vais ter na data da renovação.</p>
        </div>

        <fieldset>
          <legend className="font-black text-lg">2. Que carta tens?</legend>
          <div className="mt-3 grid gap-2">
            <Opcao ativo={pesados === false} onClick={() => { setPesados(false); setResultado(null) }}>
              Carro e/ou mota <span className="block text-xs font-medium text-zinc-500">AM, A1, A2, A, B1, B, BE</span>
            </Opcao>
            <Opcao ativo={pesados === true} onClick={() => { setPesados(true); setResultado(null) }}>
              Também tenho pesados <span className="block text-xs font-medium text-zinc-500">C1, C, CE, D1, D, DE…</span>
            </Opcao>
          </div>
        </fieldset>

        {precisaProfissional && (
          <fieldset>
            <legend className="font-black text-lg">3. Conduzes profissionalmente?</legend>
            <p className="mt-1 text-xs text-zinc-500">Táxi, TVDE, ambulância, bombeiros ou transporte escolar/de crianças.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Opcao ativo={profissional === true} onClick={() => { setProfissional(true); setResultado(null) }}>Sim</Opcao>
              <Opcao ativo={profissional === false} onClick={() => { setProfissional(false); setResultado(null) }}>Não</Opcao>
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend className="font-black text-lg">{precisaProfissional ? '4' : '3'}. A tua carta…</legend>
          <div className="mt-3 grid gap-2">
            {SITUACOES.map((s) => (
              <Opcao key={s.valor} ativo={situacao === s.valor} onClick={() => { setSituacao(s.valor); setResultado(null) }}>
                {s.texto}
              </Opcao>
            ))}
          </div>
        </fieldset>

        {erro && <p role="alert" className="text-sm font-bold text-red-600">{erro}</p>}

        <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-4 rounded-full transition">
          Ver o que preciso
        </button>
      </form>

      <div id="resultado" className="lg:col-span-3 scroll-mt-28">
        {resultado ? (
          <Resultado resultado={resultado} idade={idadeNum} onRecomecar={recomecar} />
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-zinc-200 p-10 text-center text-zinc-500">
            <Stethoscope className="mx-auto text-sky-600" size={40} />
            <p className="mt-4 font-bold text-zinc-700">Responde às perguntas para veres o resultado</p>
            <p className="mt-1 text-sm">Ficas a saber se precisas de atestado médico, de psicotécnico ou de exame, e quanto custa.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Requisito({ sim, icone: Icone, titulo }: { sim: boolean; icone: typeof Car; titulo: string }) {
  return (
    <li className={`flex items-center gap-3 sm:gap-4 rounded-2xl p-3 sm:p-4 ${sim ? 'bg-sky-50' : 'bg-zinc-50'}`}>
      <span className={`grid place-items-center size-10 sm:size-11 rounded-xl shrink-0 ${sim ? 'bg-sky-600 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
        <Icone size={22} />
      </span>
      <span className="flex-1 min-w-0 font-bold text-sm sm:text-base">{titulo}</span>
      <span className={`inline-flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm font-black px-2.5 sm:px-3 py-1 rounded-full ${sim ? 'bg-lima text-zinc-900' : 'bg-zinc-200 text-zinc-600'}`}>
        {sim ? <><Check size={14} /> Precisa</> : <><X size={14} /> Não precisa</>}
      </span>
    </li>
  )
}

function Resultado({ resultado: r, idade, onRecomecar }: { resultado: ResultadoSimulador; idade: number; onRecomecar: () => void }) {
  const [agendar, setAgendar] = useState(false)

  const linhas: [string, number | null][] = [['Tratamento da renovação', PRECOS_RENOVACAO.servico]]
  if (r.atestado) linhas.push(['Atestado médico', PRECOS_RENOVACAO.atestado])
  if (r.psicotecnico) linhas.push(['Avaliação psicológica (psicotécnico)', PRECOS_RENOVACAO.psicotecnico])
  if (r.exame === 'especial') linhas.push(['Exame especial de condução', PRECOS_RENOVACAO.exameEspecial])

  const todosConhecidos = linhas.every(([, v]) => v !== null)
  const total = linhas.reduce((soma, [, v]) => soma + (v ?? 0), 0)

  const resumo = [
    `Idade: ${idade} anos`,
    `Grupo ${r.grupo}`,
    `Atestado médico: ${r.atestado ? 'sim' : 'não'}`,
    `Psicotécnico: ${r.psicotecnico ? 'sim' : 'não'}`,
    r.exame === 'especial' ? 'Exame especial: sim' : '',
  ].filter(Boolean).join(' · ')

  if (r.exame === 'nova') {
    return (
      <div className="rounded-3xl bg-zinc-900 text-white p-8">
        <AlertTriangle className="text-lima" size={36} />
        <h3 className="mt-4 text-2xl font-black">A tua carta pode ter sido cancelada</h3>
        <p className="mt-3 text-zinc-300">{r.motivos.at(-1)}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href={linkWhatsApp(`Olá! A minha carta caducou há mais de 5 anos. Podem ajudar-me? (${resumo})`)} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 bg-lima text-zinc-900 px-6 py-3 rounded-full font-black">
            <MessageCircle size={18} /> Falar com a escola
          </a>
          <button onClick={onRecomecar} className="inline-flex items-center justify-center gap-2 border-2 border-white/30 px-6 py-3 rounded-full font-black">
            <RotateCcw size={18} /> Simular de novo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-zinc-100 shadow-xl p-6 sm:p-8">
        <p className="text-sky-600 font-black uppercase tracking-wider text-sm">Resultado · Grupo {r.grupo}</p>
        <h3 className="mt-1 text-2xl sm:text-3xl font-black">O que precisas para renovar</h3>

        <ul className="mt-6 space-y-3">
          <Requisito sim={r.atestado} icone={Stethoscope} titulo="Atestado médico" />
          <Requisito sim={r.psicotecnico} icone={Brain} titulo="Avaliação psicológica (psicotécnico)" />
          <Requisito sim={r.exame === 'especial'} icone={Car} titulo="Exame especial de condução" />
        </ul>

        <ul className="mt-6 space-y-2 text-sm text-zinc-600">
          {r.motivos.map((m) => <li key={m} className="flex gap-2"><span className="text-sky-600">•</span> {m}</li>)}
          <li className="flex gap-2"><span className="text-sky-600">•</span> Próxima revalidação: {r.proxima}</li>
        </ul>

        <div className="mt-8 rounded-2xl bg-zinc-50 p-5">
          <p className="font-black">Preço</p>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {linhas.map(([d, v]) => (
                <tr key={d} className="border-b border-zinc-200 last:border-0">
                  <td className="py-2">{d}</td>
                  <td className="py-2 text-right font-bold whitespace-nowrap">{formatarPreco(v)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-3 font-black text-base">Total</td>
                <td className="pt-3 text-right font-black text-xl text-sky-700 whitespace-nowrap">
                  {todosConhecidos ? formatarPreco(total) : 'Sob consulta'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {r.atestado && (
            <button
              onClick={() => setAgendar(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-4 rounded-full font-black transition"
            >
              <CalendarDays size={18} /> Agendar atestado médico
            </button>
          )}
          <a
            href={linkWhatsApp(`Olá! Queria tratar da renovação da minha carta. (${resumo})`)}
            target="_blank"
            rel="noopener"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-lima text-zinc-900 px-6 py-4 rounded-full font-black hover:brightness-95 transition"
          >
            <MessageCircle size={18} /> Tratar da renovação
          </a>
        </div>
        <button onClick={onRecomecar} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-sky-600">
          <RotateCcw size={14} /> Simular de novo
        </button>
      </div>

      {agendar && r.atestado && <AgendarAtestado psicotecnico={r.psicotecnico} resumo={resumo} />}

      <p className="text-xs text-zinc-500">
        Simulação indicativa, com base nas regras gerais de revalidação da carta de condução. Casos especiais (doenças,
        restrições na carta, cartas estrangeiras) podem ter outros requisitos. Confirma sempre com a escola.
      </p>
    </div>
  )
}

function AgendarAtestado({ psicotecnico, resumo }: { psicotecnico: boolean; resumo: string }) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [data, setData] = useState('')
  const [periodo, setPeriodo] = useState('Manhã')
  const [comPsico, setComPsico] = useState(psicotecnico)

  const hoje = new Date().toISOString().slice(0, 10)

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const dataPt = data.split('-').reverse().join('/')
    const texto = [
      `Olá! Queria agendar o atestado médico${comPsico ? ' e a avaliação psicológica' : ''} para renovar a carta.`,
      `Nome: ${nome}`,
      `Telefone: ${telefone}`,
      `Data preferida: ${dataPt} (${periodo.toLowerCase()})`,
      `Simulação: ${resumo}`,
    ].join('\n')
    window.open(linkWhatsApp(texto), '_blank', 'noopener')
  }

  const campo = 'w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100'

  return (
    <form onSubmit={enviar} className="rounded-3xl bg-sky-600 text-white p-6 sm:p-8 space-y-4">
      <div className="flex items-center gap-3">
        <CalendarDays className="text-lima" />
        <h3 className="text-2xl font-black">Agendar atestado médico</h3>
      </div>
      <p className="text-sky-100 text-sm">Escolhe o dia que te dá mais jeito. Confirmamos a hora contigo pelo WhatsApp.</p>
      <div className="grid sm:grid-cols-2 gap-4 text-zinc-900">
        <div>
          <label htmlFor="ag-nome" className="block text-sm font-bold text-white mb-1.5">Nome</label>
          <input id="ag-nome" required value={nome} onChange={(e) => setNome(e.target.value)} className={campo} />
        </div>
        <div>
          <label htmlFor="ag-tel" className="block text-sm font-bold text-white mb-1.5">Telemóvel</label>
          <input id="ag-tel" type="tel" required value={telefone} onChange={(e) => setTelefone(e.target.value)} className={campo} />
        </div>
        <div>
          <label htmlFor="ag-data" className="block text-sm font-bold text-white mb-1.5">Data preferida</label>
          <input id="ag-data" type="date" required min={hoje} value={data} onChange={(e) => setData(e.target.value)} className={campo} />
        </div>
        <div>
          <label htmlFor="ag-periodo" className="block text-sm font-bold text-white mb-1.5">Período</label>
          <select id="ag-periodo" value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={campo}>
            <option>Manhã</option>
            <option>Tarde</option>
          </select>
        </div>
      </div>
      {psicotecnico && (
        <label className="flex items-center gap-3 font-bold">
          <input type="checkbox" checked={comPsico} onChange={(e) => setComPsico(e.target.checked)} className="size-5 accent-lima" />
          Agendar também a avaliação psicológica
        </label>
      )}
      <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-lima text-zinc-900 font-black py-4 rounded-full hover:brightness-95 transition">
        <MessageCircle size={18} /> Pedir agendamento
      </button>
    </form>
  )
}
