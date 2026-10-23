"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CalendarDays, Check, Crown, Euro, Loader2, MessageCircle, Users } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminData";
import { Card, Empty, PageHeader, StatCard, StatusBadge, btn } from "@/components/admin/ui";
import { daysSince, planName, planPrice } from "@/lib/crm";
import { saveSubscription, setAppointmentStatus } from "@/lib/store";
import { addDays, euro, fillTemplate, firstName, getService, siteUrl, toISODate, waLink } from "@/lib/utils";
import { MESSAGE_TEMPLATES } from "@/lib/siteData";

export default function DashboardPage() {
  const { loading, error, clients, appointments, subscriptions, insights, clientById, reload } = useAdminData();

  const today = toISODate(new Date());
  const weekEnd = toISODate(addDays(new Date(), 6));
  const monthStart = today.slice(0, 8) + "01";

  const stats = useMemo(() => {
    const todays = appointments.filter((a) => a.day === today && a.status !== "cancelada");
    const week = appointments.filter((a) => a.day >= today && a.day <= weekEnd && a.status === "marcada");
    const active = subscriptions.filter((s) => s.status === "ativa");
    const pending = subscriptions.filter((s) => s.status === "pendente");
    const monthRevenue = appointments
      .filter((a) => a.day >= monthStart && a.status === "concluida" && insights.get(a.client_id)?.subscription?.status !== "ativa")
      .reduce((sum, a) => sum + (getService(a.service_id)?.price ?? 0), 0);
    const mrr = active.reduce((sum, s) => sum + planPrice(s.plan_id), 0);
    const inactive = clients
      .filter((c) => {
        const info = insights.get(c.id);
        const since = daysSince(info?.lastVisit ?? null);
        return since !== null && since >= 30 && !info?.nextAppointment;
      })
      .slice(0, 6);
    return { todays, week, active, pending, monthRevenue, mrr, inactive };
  }, [appointments, subscriptions, clients, insights, today, weekEnd, monthStart]);

  if (loading) return <Loader2 className="mx-auto mt-20 animate-spin text-gold-400" />;

  return (
    <>
      <PageHeader title="Painel" subtitle={new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" })}>
        <Link href="/admin/agenda" className={btn.primary}>
          <CalendarDays size={16} /> Abrir agenda
        </Link>
      </PageHeader>

      {error && <p className="mb-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Hoje" value={stats.todays.length} hint={`${stats.week.length} marcações nos próximos 7 dias`} icon={CalendarDays} />
        <StatCard label="Clientes" value={clients.length} icon={Users} />
        <StatCard label="Assinantes" value={stats.active.length} hint={`${euro(stats.mrr)}/mês recorrente`} icon={Crown} />
        <StatCard label="Serviços avulso (mês)" value={euro(stats.monthRevenue)} hint="Cortes concluídos sem plano" icon={Euro} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="mb-4 font-display text-xl font-bold uppercase text-white">Agenda de hoje</h2>
          {stats.todays.length === 0 ? (
            <Empty>Sem marcações para hoje.</Empty>
          ) : (
            <ul className="divide-y divide-white/5">
              {stats.todays.map((a) => {
                const client = clientById.get(a.client_id);
                return (
                  <li key={a.id} className="flex flex-wrap items-center gap-3 py-3">
                    <span className="w-14 font-display text-lg font-bold text-gold-300">{a.start_time}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">{client?.name ?? "Cliente"}</p>
                      <p className="text-xs text-zinc-500">{getService(a.service_id)?.name}</p>
                    </div>
                    <StatusBadge status={a.status} />
                    {a.status === "marcada" && (
                      <button
                        className={btn.small}
                        onClick={async () => {
                          await setAppointmentStatus(a.id, "concluida");
                          reload();
                        }}
                      >
                        <Check size={14} /> Concluir
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 font-display text-xl font-bold uppercase text-white">Pedidos de plano</h2>
            {stats.pending.length === 0 ? (
              <Empty>Sem pedidos pendentes.</Empty>
            ) : (
              <ul className="space-y-3">
                {stats.pending.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{clientById.get(s.client_id)?.name}</p>
                      <p className="text-xs text-zinc-500">
                        Plano {planName(s.plan_id)} · {euro(planPrice(s.plan_id))}/mês
                      </p>
                    </div>
                    <button
                      className={btn.small}
                      onClick={async () => {
                        await saveSubscription({ ...s, status: "ativa", start_date: today });
                        reload();
                      }}
                    >
                      <Check size={14} /> Ativar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase text-white">Recuperar clientes</h2>
              <Link href="/admin/mensagens" className="text-xs text-gold-400 hover:underline">
                Mensagem em massa
              </Link>
            </div>
            {stats.inactive.length === 0 ? (
              <Empty>Todos os clientes vieram nos últimos 30 dias. 👌</Empty>
            ) : (
              <ul className="space-y-3">
                {stats.inactive.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{c.name}</p>
                      <p className="text-xs text-zinc-500">Última visita há {daysSince(insights.get(c.id)?.lastVisit ?? null)} dias</p>
                    </div>
                    <a
                      href={waLink(c.phone, fillTemplate(MESSAGE_TEMPLATES[1].text, { nome: firstName(c.name), site: siteUrl() }))}
                      target="_blank"
                      rel="noreferrer"
                      className={btn.small}
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
