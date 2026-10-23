"use client";

import { useMemo, useState } from "react";
import { Ban, Check, Crown, Loader2, MessageCircle, Plus } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminData";
import { Card, Empty, Field, Modal, PageHeader, StatusBadge, btn } from "@/components/admin/ui";
import { planName, planPrice } from "@/lib/crm";
import { PLANS } from "@/lib/siteData";
import { saveSubscription } from "@/lib/store";
import type { SubscriptionStatus } from "@/lib/types";
import { cn, euro, formatDate, toISODate, waLink } from "@/lib/utils";

export default function PlanosPage() {
  const { subscriptions, clientById, reload } = useAdminData();
  const [status, setStatus] = useState<SubscriptionStatus | "todas">("todas");
  const [adding, setAdding] = useState(false);

  const perPlan = useMemo(
    () =>
      PLANS.map((p) => {
        const active = subscriptions.filter((s) => s.plan_id === p.id && s.status === "ativa").length;
        return { ...p, active, revenue: active * p.price };
      }),
    [subscriptions]
  );
  const mrr = perPlan.reduce((s, p) => s + p.revenue, 0);
  const list = subscriptions.filter((s) => status === "todas" || s.status === status);

  async function setSubStatus(id: string, next: SubscriptionStatus) {
    const sub = subscriptions.find((s) => s.id === id);
    if (!sub) return;
    await saveSubscription({ ...sub, status: next, start_date: next === "ativa" ? sub.start_date ?? toISODate(new Date()) : sub.start_date });
    reload();
  }

  return (
    <>
      <PageHeader title="Planos" subtitle={`${euro(mrr)} de receita mensal recorrente`}>
        <button className={btn.primary} onClick={() => setAdding(true)}>
          <Plus size={16} /> Adicionar assinante
        </button>
      </PageHeader>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {perPlan.map((p) => (
          <Card key={p.id} className={cn(p.highlight && "border-gold-500/40")}>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-display text-xl font-bold uppercase text-zinc-900">
                <Crown size={18} className="text-gold-600" /> {p.name}
              </p>
              <span className="text-sm text-zinc-500">{euro(p.price)}/mês</span>
            </div>
            <p className="mt-4 font-display text-4xl font-bold text-zinc-900">{p.active}</p>
            <p className="text-xs text-zinc-500">assinantes ativos · {euro(p.revenue)}/mês</p>
          </Card>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {(["todas", "pendente", "ativa", "cancelada"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition",
              status === s ? "border-gold-400 bg-gold-500/15 text-gold-800" : "border-zinc-200 text-zinc-500 hover:text-zinc-900"
            )}
          >
            {s}
            {s === "pendente" && ` (${subscriptions.filter((x) => x.status === "pendente").length})`}
          </button>
        ))}
      </div>

      <Card className="p-0">
        {list.length === 0 ? (
          <Empty>Sem assinaturas.</Empty>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {list.map((s) => {
              const client = clientById.get(s.client_id);
              return (
                <li key={s.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-zinc-900">{client?.name ?? "Cliente removido"}</p>
                    <p className="text-sm text-zinc-500">
                      Plano {planName(s.plan_id)} · {euro(planPrice(s.plan_id))}/mês
                      {s.start_date && ` · desde ${formatDate(s.start_date, { day: "numeric", month: "short", year: "numeric" })}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={s.status} />
                    {s.status !== "ativa" && (
                      <button className={btn.small} onClick={() => setSubStatus(s.id, "ativa")}>
                        <Check size={14} /> Ativar
                      </button>
                    )}
                    {s.status !== "cancelada" && (
                      <button className={btn.small} onClick={() => setSubStatus(s.id, "cancelada")}>
                        <Ban size={14} /> Cancelar
                      </button>
                    )}
                    {client && (
                      <a
                        className={btn.small}
                        target="_blank"
                        rel="noreferrer"
                        href={waLink(
                          client.phone,
                          s.status === "pendente"
                            ? `Olá ${client.name.split(" ")[0]}! Recebi o seu pedido para o plano ${planName(s.plan_id)}. Quando pode passar pela barbearia para ativarmos?`
                            : `Olá ${client.name.split(" ")[0]}! `
                        )}
                      >
                        <MessageCircle size={14} />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {adding && <AddSubscriptionModal onClose={() => setAdding(false)} />}
    </>
  );
}

function AddSubscriptionModal({ onClose }: { onClose: () => void }) {
  const { clients, reload } = useAdminData();
  const [clientId, setClientId] = useState("");
  const [planId, setPlanId] = useState(PLANS[0].id);
  const [startDate, setStartDate] = useState(toISODate(new Date()));
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await saveSubscription({ client_id: clientId, plan_id: planId, status: "ativa", start_date: startDate });
    await reload();
    onClose();
  }

  return (
    <Modal title="Adicionar assinante" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Cliente">
          <select className="input" required value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Escolher cliente…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.phone}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Plano">
          <select className="input" value={planId} onChange={(e) => setPlanId(e.target.value)}>
            {PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {euro(p.price)}/mês
              </option>
            ))}
          </select>
        </Field>
        <Field label="Início">
          <input className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-2">
          <button type="button" className={btn.ghost} onClick={onClose}>
            Cancelar
          </button>
          <button className={btn.primary} disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />} Ativar plano
          </button>
        </div>
      </form>
    </Modal>
  );
}
