import type { Metadata } from 'next'
import { Phone, Mail, Clock, MapPin } from 'lucide-react'
import { ESCOLA, HORARIO } from '@/lib/dados'
import { TituloPagina } from '@/components/Blocos'
import { FormularioInscricao } from '@/components/FormularioInscricao'

export const metadata: Metadata = {
  title: 'Contactos',
  description: 'Fala com a Escola de Condução S. Cristóvão por telefone, WhatsApp ou email.',
}

export default function Contactos() {
  return (
    <>
      <TituloPagina etiqueta="Contactos" titulo="Fala connosco" />

      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <div className="rounded-3xl bg-zinc-50 p-6 flex gap-4">
              <span className="grid place-items-center size-12 rounded-2xl bg-azul text-white shrink-0"><Phone size={22} /></span>
              <div>
                <p className="font-bold">Telefone</p>
                {ESCOLA.telefones.map((t) => (
                  <a key={t.link} href={`tel:${t.link}`} className="block text-lg text-zinc-700 hover:text-azul">{t.texto}</a>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-zinc-50 p-6 flex gap-4">
              <span className="grid place-items-center size-12 rounded-2xl bg-azul text-white shrink-0"><Mail size={22} /></span>
              <div className="min-w-0">
                <p className="font-bold">Email</p>
                <a href={`mailto:${ESCOLA.email}`} className="block text-lg text-zinc-700 hover:text-azul break-all">{ESCOLA.email}</a>
              </div>
            </div>
            <div className="rounded-3xl bg-zinc-50 p-6 flex gap-4">
              <span className="grid place-items-center size-12 rounded-2xl bg-azul text-white shrink-0"><Clock size={22} /></span>
              <div>
                <p className="font-bold">Horário</p>
                {HORARIO.map((h) => (
                  <p key={h.dias} className="text-zinc-700">{h.dias}: {h.horas}</p>
                ))}
              </div>
            </div>
            {ESCOLA.morada && (
              <div className="rounded-3xl bg-zinc-50 p-6 flex gap-4">
                <span className="grid place-items-center size-12 rounded-2xl bg-azul text-white shrink-0"><MapPin size={22} /></span>
                <div>
                  <p className="font-bold">Morada</p>
                  <p className="text-zinc-700">{ESCOLA.morada}<br />{ESCOLA.codigoPostal}</p>
                </div>
              </div>
            )}
            {ESCOLA.mapa && (
              <iframe
                src={ESCOLA.mapa}
                title="Mapa da escola"
                loading="lazy"
                className="w-full h-72 rounded-3xl border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>

          <FormularioInscricao />
        </div>
      </section>
    </>
  )
}
