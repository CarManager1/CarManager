import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { ESCOLA, HORARIOS } from '@/lib/dados'
import { TituloPagina } from '@/components/Blocos'
import { FormularioInscricao } from '@/components/FormularioInscricao'

export const metadata: Metadata = {
  title: 'Contactos e inscrições',
  description: 'Inscreve-te na Escola de Condução S. Cristóvão ou fala connosco pelo WhatsApp, telefone ou email.',
}

export default function Contactos() {
  return (
    <>
      <TituloPagina etiqueta="Inscrições abertas" titulo="Vem tirar a carta connosco" texto="Deixa os teus dados e falamos contigo pelo WhatsApp. Ou aparece na escola!" />

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <ul className="grid sm:grid-cols-2 gap-5">
              <li className="bg-zinc-50 rounded-3xl p-6">
                <span className="grid place-items-center size-11 rounded-2xl bg-sky-600 text-white"><MapPin size={20} /></span>
                <p className="mt-4 font-black">Morada</p>
                <p className="text-zinc-600">{ESCOLA.morada}<br />{ESCOLA.codigoPostal}</p>
              </li>
              <li className="bg-zinc-50 rounded-3xl p-6">
                <span className="grid place-items-center size-11 rounded-2xl bg-sky-600 text-white"><Phone size={20} /></span>
                <p className="mt-4 font-black">Telefone</p>
                <a href={`tel:${ESCOLA.telefoneLink}`} className="text-zinc-600 hover:text-sky-600">{ESCOLA.telefone}</a>
              </li>
              <li className="bg-zinc-50 rounded-3xl p-6">
                <span className="grid place-items-center size-11 rounded-2xl bg-sky-600 text-white"><Mail size={20} /></span>
                <p className="mt-4 font-black">Email</p>
                <a href={`mailto:${ESCOLA.email}`} className="text-zinc-600 hover:text-sky-600 break-all">{ESCOLA.email}</a>
              </li>
              <li className="bg-zinc-50 rounded-3xl p-6">
                <span className="grid place-items-center size-11 rounded-2xl bg-sky-600 text-white"><Clock size={20} /></span>
                <p className="mt-4 font-black">Horário da secretaria</p>
                {HORARIOS.secretaria.map((h) => (
                  <p key={h.dias} className="text-zinc-600">{h.dias}: {h.horas}</p>
                ))}
              </li>
            </ul>

            {ESCOLA.mapa ? (
              <iframe
                src={ESCOLA.mapa}
                title="Mapa da escola"
                loading="lazy"
                className="mt-5 w-full h-72 rounded-3xl border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="mt-5 h-40 rounded-3xl border-2 border-dashed border-zinc-200 grid place-items-center text-sm text-zinc-400 text-center px-6">
                O mapa aparece aqui quando preencher o campo &quot;mapa&quot; em src/lib/dados.ts
              </div>
            )}
          </div>

          <FormularioInscricao />
        </div>
      </section>
    </>
  )
}
