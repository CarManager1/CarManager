"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Check, ChevronLeft, Clock, Loader2, Scissors } from "lucide-react";
import { BRAND, OPENING_HOURS, SERVICES } from "@/lib/siteData";
import { bookAppointment, getBusySlots } from "@/lib/store";
import type { BusySlot } from "@/lib/types";
import { addDays, availableSlots, cn, euro, formatDate, fromISODate, normalizePhone, toISODate, waLink } from "@/lib/utils";
import { SELECT_SERVICE_EVENT } from "./events";

const DAYS_AHEAD = 21;

type Step = 1 | 2 | 3 | 4;

export default function BookingWidget() {
  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [busyFor, setBusyFor] = useState<{ day: string; slots: BusySlot[] } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = SERVICES.find((s) => s.id === serviceId);
  const busy = busyFor && busyFor.day === day ? busyFor.slots : null;

  // Só é mostrado a partir do passo 2 (depois da hidratação), por isso usa a data do browser.
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: DAYS_AHEAD }, (_, i) => toISODate(addDays(today, i)));
  }, []);

  useEffect(() => {
    const onSelect = (e: Event) => {
      setServiceId((e as CustomEvent<string>).detail);
      setTime(null);
      setStep(2);
    };
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  useEffect(() => {
    if (!day) return;
    let cancelled = false;
    getBusySlots(day)
      .then((slots) => !cancelled && setBusyFor({ day, slots }))
      .catch(() => !cancelled && setBusyFor({ day, slots: [] }));
    return () => {
      cancelled = true;
    };
  }, [day]);

  const slots = useMemo(
    () => (day && busy && service ? availableSlots(day, service.duration, busy) : []),
    [day, busy, service]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!service || !day || !time) return;
    if (normalizePhone(form.phone).length < 9) {
      setError("Indique um número de telemóvel válido.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await bookAppointment({ ...form, service_id: service.id, day, start_time: time });
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível concluir a marcação.");
      const slots = await getBusySlots(day).catch(() => null);
      if (slots) setBusyFor({ day, slots });
      setStep(2);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(1);
    setServiceId(null);
    setDay(null);
    setTime(null);
    setForm({ name: "", phone: "", email: "", notes: "" });
  }

  return (
    <div id="marcar" className="scroll-mt-28 rounded-3xl border border-gold-500/30 bg-white/95 p-5 shadow-2xl shadow-zinc-300/60 backdrop-blur sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Marcação online</p>
          <h3 className="font-display text-2xl font-bold uppercase text-zinc-900">Reserve o seu horário</h3>
        </div>
        {step > 1 && step < 4 && (
          <button
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:border-gold-400 hover:text-gold-700"
          >
            <ChevronLeft size={14} /> Voltar
          </button>
        )}
      </div>

      {step < 4 && (
        <ol className="mb-6 grid grid-cols-3 gap-2">
          {["Serviço", "Dia e hora", "Os seus dados"].map((label, i) => (
            <li key={label} className="space-y-1.5">
              <div className={cn("h-1 rounded-full", i + 1 <= step ? "bg-gold-gradient" : "bg-zinc-200")} />
              <p className={cn("text-[11px] uppercase tracking-wide", i + 1 <= step ? "text-gold-700" : "text-zinc-500")}>{label}</p>
            </li>
          ))}
        </ol>
      )}

      {step === 1 && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setServiceId(s.id);
                setTime(null);
                setStep(2);
              }}
              className={cn(
                "group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                serviceId === s.id ? "border-gold-400 bg-gold-500/10" : "border-zinc-200 bg-stone-50 hover:border-gold-400/60 hover:bg-stone-100"
              )}
            >
              <div>
                <p className="font-semibold text-zinc-900">{s.name}</p>
                <p className="flex items-center gap-1 text-xs text-zinc-500">
                  <Clock size={12} /> {s.duration} min
                </p>
              </div>
              <span className="font-display text-lg font-bold text-gold-700">{euro(s.price)}</span>
            </button>
          ))}
        </div>
      )}

      {step === 2 && service && (
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm text-zinc-600">
            <Scissors size={14} className="text-gold-600" /> {service.name} · {service.duration} min · {euro(service.price)}
          </p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
            {days.map((d) => {
              const closed = !OPENING_HOURS[fromISODate(d).getDay()];
              const date = fromISODate(d);
              return (
                <button
                  key={d}
                  disabled={closed}
                  onClick={() => {
                    setDay(d);
                    setTime(null);
                  }}
                  className={cn(
                    "flex min-w-[64px] flex-col items-center rounded-2xl border px-3 py-2.5 transition",
                    closed && "cursor-not-allowed opacity-30",
                    day === d ? "bg-gold-gradient border-transparent text-ink-950" : "border-zinc-200 bg-stone-50 text-zinc-900 hover:border-gold-400/60"
                  )}
                >
                  <span className="text-[11px] uppercase">{date.toLocaleDateString("pt-PT", { weekday: "short" }).replace(".", "")}</span>
                  <span className="font-display text-xl font-bold">{date.getDate()}</span>
                  <span className="text-[10px] uppercase">{date.toLocaleDateString("pt-PT", { month: "short" }).replace(".", "")}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 min-h-[120px]">
            {!day && <p className="py-8 text-center text-sm text-zinc-500">Escolha um dia para ver os horários livres.</p>}
            {day && !busy && (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-gold-600" />
              </div>
            )}
            {day && busy && slots.length === 0 && (
              <p className="py-8 text-center text-sm text-zinc-500">Sem horários livres neste dia. Experimente outro dia.</p>
            )}
            {day && busy && slots.length > 0 && (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {slots.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTime(t);
                      setStep(3);
                    }}
                    className={cn(
                      "rounded-xl border py-2 text-sm font-semibold transition",
                      time === t ? "bg-gold-gradient border-transparent text-ink-950" : "border-zinc-200 bg-stone-50 text-zinc-800 hover:border-gold-400"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 3 && service && day && time && (
        <form onSubmit={submit} className="space-y-3">
          <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-4 text-sm">
            <p className="font-semibold text-zinc-900">{service.name}</p>
            <p className="text-zinc-600">
              {formatDate(day, { weekday: "long", day: "numeric", month: "long" })} às {time} · {euro(service.price)}
            </p>
          </div>
          <input className="input" placeholder="Nome *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Telemóvel *" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input" placeholder="Email (opcional)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <textarea className="input min-h-[70px]" placeholder="Observações (opcional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <button
            disabled={submitting}
            className="bg-gold-gradient flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-bold uppercase tracking-wide text-ink-950 transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <CalendarCheck size={18} />}
            Confirmar marcação
          </button>
        </form>
      )}

      {step === 4 && service && day && time && (
        <div className="py-4 text-center">
          <div className="bg-gold-gradient mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-ink-950">
            <Check size={32} strokeWidth={3} />
          </div>
          <h4 className="font-display text-2xl font-bold uppercase text-zinc-900">Marcação confirmada!</h4>
          <p className="mt-2 text-zinc-600">
            {service.name} — {formatDate(day, { weekday: "long", day: "numeric", month: "long" })} às {time}
          </p>
          <p className="mt-1 text-sm text-zinc-500">Até breve, {form.name.split(" ")[0]}! 💈</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <a
              href={waLink(BRAND.phone, `Olá Lucas! Acabei de marcar ${service.name} para ${formatDate(day)} às ${time}. Nome: ${form.name}`)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-gold-400/60 px-5 py-2.5 text-sm font-semibold text-gold-700 hover:bg-gold-500/10"
            >
              Avisar por WhatsApp
            </a>
            <button onClick={reset} className="rounded-full px-5 py-2.5 text-sm text-zinc-500 hover:text-zinc-900">
              Fazer outra marcação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
