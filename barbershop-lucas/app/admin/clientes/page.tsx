"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Crown, Loader2, MessageCircle, Plus, Search, Trash2 } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminData";
import AppointmentModal from "@/components/admin/AppointmentModal";
import { Card, Empty, Field, Modal, PageHeader, StatusBadge, btn } from "@/components/admin/ui";
import { daysSince, matchesSegment, planName, type Segment } from "@/lib/crm";
import { deleteClient, saveClient } from "@/lib/store";
import type { Client } from "@/lib/types";
import { cn, euro, formatDate, getService, toISODate, waLink } from "@/lib/utils";

const FILTERS: { id: Segment; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "assinantes", label: "Assinantes" },
  { id: "sem-plano", label: "Sem plano" },
  { id: "inativos", label: "Inativos +30 dias" },
  { id: "novos", label: "Novos" },
];

export default function ClientesPage() {
  const { clients, insights, loading } = useAdminData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Segment>("todos");
  const [selected, setSelected] = useState<Client | "new" | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter(
      (c) =>
        (!q || c.name.toLowerCase().includes(q) || c.phone.includes(q.replace(/\s/g, "")) || c.email?.toLowerCase().includes(q)) &&
        matchesSegment(c, insights.get(c.id), filter, { inactiveDays: 30, planId: "all" })
    );
  }, [clients, insights, query, filter]);

  return (
    <>
      <PageHeader title="Clientes" subtitle={`${clients.length} clientes registados`}>
        <button className={btn.primary} onClick={() => setSelected("new")}>
          <Plus size={16} /> Novo cliente
        </button>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500" />
          <input className="input pl-11" placeholder="Procurar por nome, telemóvel ou email…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                filter === f.id ? "border-gold-400 bg-gold-500/15 text-gold-200" : "border-white/10 text-zinc-400 hover:text-white"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-x-auto p-0">
        {loading ? (
          <Loader2 className="mx-auto my-10 animate-spin text-gold-400" />
        ) : list.length === 0 ? (
          <Empty>Nenhum cliente encontrado.</Empty>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3 font-semibold">Cliente</th>
                <th className="px-5 py-3 font-semibold">Telemóvel</th>
                <th className="px-5 py-3 font-semibold">Última visita</th>
                <th className="px-5 py-3 font-semibold">Visitas</th>
                <th className="px-5 py-3 font-semibold">Plano</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {list.map((c) => {
                const info = insights.get(c.id);
                const since = daysSince(info?.lastVisit ?? null);
                return (
                  <tr key={c.id} className="cursor-pointer transition hover:bg-white/[0.03]" onClick={() => setSelected(c)}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{c.name}</p>
                      {info?.nextAppointment && (
                        <p className="text-xs text-gold-400">
                          Próxima: {formatDate(info.nextAppointment.day)} {info.nextAppointment.start_time}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-zinc-300">{c.phone}</td>
                    <td className={cn("px-5 py-3", since !== null && since >= 30 ? "text-amber-300" : "text-zinc-300")}>
                      {since === null ? "—" : since === 0 ? "Hoje" : `Há ${since} dias`}
                    </td>
                    <td className="px-5 py-3 text-zinc-300">{info?.visits ?? 0}</td>
                    <td className="px-5 py-3">
                      {info?.subscription ? (
                        <span className="flex items-center gap-1.5 text-gold-300">
                          <Crown size={14} /> {planName(info.subscription.plan_id)}
                          {info.subscription.status === "pendente" && <span className="text-xs text-amber-300">(pendente)</span>}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <a href={waLink(c.phone, `Olá ${c.name.split(" ")[0]}! `)} target="_blank" rel="noreferrer" className={btn.small}>
                        <MessageCircle size={14} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      {selected && <ClientModal client={selected === "new" ? null : selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function ClientModal({ client, onClose }: { client: Client | null; onClose: () => void }) {
  const { appointments, insights, reload } = useAdminData();
  const [form, setForm] = useState({
    name: client?.name ?? "",
    phone: client?.phone ?? "",
    email: client?.email ?? "",
    birthday: client?.birthday ?? "",
    notes: client?.notes ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

  const info = client ? insights.get(client.id) : undefined;
  const history = client
    ? appointments.filter((a) => a.client_id === client.id).sort((a, b) => (b.day + b.start_time).localeCompare(a.day + a.start_time))
    : [];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await saveClient({
        id: client?.id,
        name: form.name.trim(),
        phone: form.phone,
        email: form.email || null,
        birthday: form.birthday || null,
        notes: form.notes || null,
      });
      await reload();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!client || !confirm(`Apagar ${client.name} e todo o histórico?`)) return;
    await deleteClient(client.id);
    await reload();
    onClose();
  }

  if (booking && client) {
    return <AppointmentModal defaultDay={toISODate(new Date())} defaultClientId={client.id} onClose={() => setBooking(false)} />;
  }

  return (
    <Modal title={client ? client.name : "Novo cliente"} onClose={onClose} wide={!!client}>
      <div className={cn("grid gap-6", client && "md:grid-cols-2")}>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Nome">
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Telemóvel">
            <input className="input" required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Email">
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Data de nascimento">
            <input className="input" type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} />
          </Field>
          <Field label="Notas (preferências, alergias…)">
            <textarea className="input min-h-[80px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <div className="flex flex-wrap gap-2 pt-2">
            <button className={btn.primary} disabled={saving}>
              {saving && <Loader2 size={16} className="animate-spin" />} Guardar
            </button>
            {client && (
              <button type="button" className={cn(btn.ghost, "hover:border-red-400/60 hover:text-red-300")} onClick={remove}>
                <Trash2 size={16} /> Apagar
              </button>
            )}
          </div>
        </form>

        {client && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["Visitas", info?.visits ?? 0],
                ["Faltas", info?.noShows ?? 0],
                ["Gasto", euro(info?.totalSpent ?? 0)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white/5 p-3">
                  <p className="font-display text-xl font-bold text-white">{value}</p>
                  <p className="text-[11px] uppercase text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
            {info?.subscription && (
              <div className="flex items-center justify-between rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-sm">
                <span className="flex items-center gap-2 text-gold-200">
                  <Crown size={16} /> Plano {planName(info.subscription.plan_id)}
                </span>
                <StatusBadge status={info.subscription.status} />
              </div>
            )}
            <div className="flex gap-2">
              <button className={cn(btn.ghost, "flex-1")} onClick={() => setBooking(true)}>
                <CalendarPlus size={16} /> Marcar
              </button>
              <a className={cn(btn.ghost, "flex-1")} href={waLink(client.phone, `Olá ${client.name.split(" ")[0]}! `)} target="_blank" rel="noreferrer">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Histórico</p>
              {history.length === 0 ? (
                <p className="text-sm text-zinc-500">Sem marcações.</p>
              ) : (
                <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                  {history.map((a) => (
                    <li key={a.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
                      <span className="text-zinc-300">
                        {formatDate(a.day, { day: "2-digit", month: "short", year: "2-digit" })} · {a.start_time} · {getService(a.service_id)?.name}
                      </span>
                      <StatusBadge status={a.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
