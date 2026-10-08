'use client'

import { useActionState, useEffect, useRef, startTransition } from 'react'
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { enviarHorario, type Estado } from './acoes'
import type { Mes } from '@/lib/horarios'

export function FormularioHorario({ meses }: { meses: Mes[] }) {
  const [estado, acao, aEnviar] = useActionState<Estado, FormData>(enviarHorario, null)
  const formulario = useRef<HTMLFormElement>(null)

  // Só limpa o ficheiro e a palavra-passe quando o envio corre bem
  useEffect(() => {
    if (estado?.ok) formulario.current?.reset()
  }, [estado])

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const dados = new FormData(e.currentTarget)
    startTransition(() => acao(dados))
  }

  const campo = 'w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-azul focus:ring-2 focus:ring-azul/20'

  return (
    <form ref={formulario} onSubmit={enviar} className="space-y-5">
      <div>
        <label htmlFor="mes" className="block text-sm font-bold mb-1.5">Mês</label>
        <select id="mes" name="mes" className={campo} defaultValue={meses[0].chave}>
          {meses.map((m, i) => (
            <option key={m.chave} value={m.chave}>
              {m.nome} {i === 0 ? '(mês atual)' : '(mês seguinte)'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ficheiro" className="block text-sm font-bold mb-1.5">Horário (imagem ou PDF, até 4 MB)</label>
        <input
          id="ficheiro"
          name="ficheiro"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-noite file:px-5 file:py-2.5 file:font-bold file:text-white"
        />
      </div>

      <div>
        <label htmlFor="senha" className="block text-sm font-bold mb-1.5">Palavra-passe</label>
        <input id="senha" name="senha" type="password" required autoComplete="current-password" className={campo} />
      </div>

      <button
        type="submit"
        disabled={aEnviar}
        className="w-full inline-flex items-center justify-center gap-2 bg-lima text-noite font-bold py-4 rounded-full hover:brightness-95 transition disabled:opacity-60"
      >
        <Upload size={18} /> {aEnviar ? 'A enviar…' : 'Publicar horário'}
      </button>

      {estado && (
        <p
          role="status"
          className={`flex items-start gap-2 rounded-xl p-4 text-sm font-semibold ${estado.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}
        >
          {estado.ok ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
          {estado.mensagem}
        </p>
      )}
    </form>
  )
}
