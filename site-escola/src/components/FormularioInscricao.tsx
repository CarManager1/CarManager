'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { linkWhatsApp } from './whatsapp'

// O formulário não guarda nada: abre o WhatsApp da escola com a mensagem já escrita.
export function FormularioInscricao() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [curso, setCurso] = useState('Carta de ligeiros (B)')
  const [mensagem, setMensagem] = useState('')

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const texto = [
      `Olá! Gostava de mais informações.`,
      `Nome: ${nome}`,
      `Telefone: ${telefone}`,
      `Interesse: ${curso}`,
      mensagem && `Mensagem: ${mensagem}`,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(linkWhatsApp(texto), '_blank', 'noopener')
  }

  const campo =
    'w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100'

  return (
    <form onSubmit={enviar} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-100 space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-bold text-zinc-700 mb-1.5">Nome</label>
        <input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} className={campo} placeholder="O teu nome" />
      </div>
      <div>
        <label htmlFor="telefone" className="block text-sm font-bold text-zinc-700 mb-1.5">Telemóvel</label>
        <input
          id="telefone"
          type="tel"
          required
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className={campo}
          placeholder="9XX XXX XXX"
        />
      </div>
      <div>
        <label htmlFor="curso" className="block text-sm font-bold text-zinc-700 mb-1.5">Estou interessado em</label>
        <select id="curso" value={curso} onChange={(e) => setCurso(e.target.value)} className={campo}>
          <option>Carta de ligeiros (B)</option>
          <option>Carta de motociclos (A1 / A2 / A)</option>
          <option>Aulas de treino</option>
          <option>Renovação de carta</option>
        </select>
      </div>
      <div>
        <label htmlFor="mensagem" className="block text-sm font-bold text-zinc-700 mb-1.5">Mensagem (opcional)</label>
        <textarea
          id="mensagem"
          rows={3}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className={campo}
          placeholder="Ex: prefiro aulas ao fim da tarde"
        />
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-black py-4 rounded-xl transition"
      >
        <Send size={18} /> Enviar pelo WhatsApp
      </button>
      <p className="text-xs text-zinc-500 text-center">Respondemos o mais rápido possível.</p>
    </form>
  )
}
