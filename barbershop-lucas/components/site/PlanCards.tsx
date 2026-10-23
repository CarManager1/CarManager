"use client";

import { useState } from "react";
import { Check, Crown, Loader2, X } from "lucide-react";
import { PLANS, type Plan } from "@/lib/siteData";
import { requestSubscription } from "@/lib/store";
import { cn, euro, normalizePhone } from "@/lib/utils";

export default function PlanCards() {
  const [selected, setSelected] = useState<Plan | null>(null);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-3xl border p-8 transition",
              plan.highlight
                ? "border-gold-400 bg-gradient-to-b from-gold-500/15 to-ink-900 shadow-2xl shadow-gold-500/10 lg:-translate-y-4"
                : "border-white/10 bg-ink-900 hover:border-gold-400/40"
            )}
          >
            {plan.highlight && (
              <span className="bg-gold-gradient absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider text-ink-950">
                <Crown size={14} /> Mais escolhido
              </span>
            )}
            <h3 className="font-display text-3xl font-bold uppercase text-white">{plan.name}</h3>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-gold-gradient font-display text-6xl font-bold">{euro(plan.price)}</span>
              <span className="mb-2 text-zinc-400">/mês</span>
            </div>
            <ul className="mt-8 flex-1 space-y-3">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-zinc-200">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold-400 text-gold-300">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelected(plan)}
              className={cn(
                "mt-10 rounded-full py-3.5 font-bold uppercase tracking-wide transition",
                plan.highlight ? "bg-gold-gradient text-ink-950 hover:brightness-110" : "border border-gold-400/60 text-gold-300 hover:bg-gold-500/10"
              )}
            >
              Quero este plano
            </button>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-zinc-500">*Consulte condições. Planos mensais com renovação automática. Vagas limitadas.</p>

      {selected && <SubscribeModal plan={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function SubscribeModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (normalizePhone(form.phone).length < 9) {
      setError("Indique um número de telemóvel válido.");
      return;
    }
    setState("sending");
    setError(null);
    try {
      await requestSubscription({ ...form, plan_id: plan.id });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro. Tente novamente.");
      setState("idle");
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl border border-gold-500/30 bg-ink-900 p-7" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Clube Barber Shop Lucas</p>
            <h3 className="font-display text-2xl font-bold uppercase text-white">
              Plano {plan.name} · {euro(plan.price)}/mês
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white" aria-label="Fechar">
            <X />
          </button>
        </div>

        {state === "done" ? (
          <div className="py-6 text-center">
            <div className="bg-gold-gradient mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-ink-950">
              <Check size={28} strokeWidth={3} />
            </div>
            <p className="text-lg font-semibold text-white">Pedido enviado!</p>
            <p className="mt-1 text-sm text-zinc-400">O Lucas vai entrar em contacto para ativar o seu plano.</p>
            <button onClick={onClose} className="bg-gold-gradient mt-6 rounded-full px-6 py-2.5 font-bold text-ink-950">
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input className="input" placeholder="Nome *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder="Telemóvel *" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="input" placeholder="Email (opcional)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
            <button
              disabled={state === "sending"}
              className="bg-gold-gradient flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-bold uppercase text-ink-950 disabled:opacity-60"
            >
              {state === "sending" && <Loader2 className="animate-spin" size={18} />}
              Pedir adesão
            </button>
            <p className="text-center text-xs text-zinc-500">Sem pagamento agora — o plano é ativado na barbearia.</p>
          </form>
        )}
      </div>
    </div>
  );
}
