"use client";

import { useMemo, useState } from "react";
import { Ban, Check, ChevronLeft, ChevronRight, Crown, MessageCircle, Pencil, Plus, UserX } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminData";
import AppointmentModal from "@/components/admin/AppointmentModal";
import { Card, Empty, PageHeader, StatusBadge, btn } from "@/components/admin/ui";
import { MESSAGE_TEMPLATES, OPENING_HOURS } from "@/lib/siteData";
import { setAppointmentStatus } from "@/lib/store";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { addDays, cn, euro, fillTemplate, firstName, formatDate, fromISODate, fromMinutes, getService, toISODate, toMinutes, waLink } from "@/lib/utils";

export default function AgendaPage() {
  const { appointments, clientById, insights, reload } = useAdminData();
  const [day, setDay] = useState(() => toISODate(new Date()));
  const [editing, setEditing] = useState<Appointment | "new" | null>(null);

  const dayAppts = useMemo(
    () => appointments.filter((a) => a.day === day).sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [appointments, day]
  );

  // Semana (segunda a domingo) do dia selecionado, com nº de marcações por dia
  const week = useMemo(() => {
    const d = fromISODate(day);
    const monday = addDays(d, -((d.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const iso = toISODate(addDays(monday, i));
      return { iso, count: appointments.filter((a) => a.day === iso && a.status === "marcada").length };
    });
  }, [appointments, day]);

  const hours = OPENING_HOURS[fromISODate(day).getDay()];
  const expected = dayAppts.filter((a) => a.status !== "cancelada").reduce((s, a) => s + (getService(a.service_id)?.price ?? 0), 0);

  async function changeStatus(id: string, status: AppointmentStatus) {
    await setAppointmentStatus(id, status);
    reload();
  }

  const today = toISODate(new Date());

  return (
    <>
      <PageHeader title="Agenda" subtitle={formatDate(day, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}>
        <button className={btn.ghost} onClick={() => setDay(today)}>
          Hoje
        </button>
        <button className={btn.primary} onClick={() => setEditing("new")}>
          <Plus size={16} /> Nova marcação
        </button>
      </PageHeader>

      <Card className="mb-6 p-3">
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white" onClick={() => setDay(toISODate(addDays(fromISODate(day), -7)))} aria-label="Semana anterior">
            <ChevronLeft />
          </button>
          <div className="grid flex-1 grid-cols-7 gap-1.5">
            {week.map(({ iso, count }) => {
              const d = fromISODate(iso);
              return (
                <button
                  key={iso}
                  onClick={() => setDay(iso)}
                  className={cn(
                    "rounded-xl py-2 text-center transition",
                    iso === day ? "bg-gold-gradient text-ink-950" : "hover:bg-white/5",
                    iso === today && iso !== day && "ring-1 ring-gold-400/60"
                  )}
                >
                  <p className={cn("text-[10px] uppercase", iso === day ? "text-ink-950" : "text-zinc-500")}>
                    {d.toLocaleDateString("pt-PT", { weekday: "short" }).replace(".", "")}
                  </p>
                  <p className={cn("font-display text-lg font-bold", iso === day ? "" : "text-white")}>{d.getDate()}</p>
                  <p className={cn("text-[10px]", iso === day ? "text-ink-950/80" : count ? "text-gold-400" : "text-zinc-600")}>
                    {count ? `${count} marc.` : "—"}
                  </p>
                </button>
              );
            })}
          </div>
          <button className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white" onClick={() => setDay(toISODate(addDays(fromISODate(day), 7)))} aria-label="Semana seguinte">
            <ChevronRight />
          </button>
        </div>
      </Card>

      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
        <span>{hours ? `Aberto das ${hours.open} às ${hours.close}` : "Fechado neste dia"}</span>
        <span>{dayAppts.filter((a) => a.status !== "cancelada").length} marcações</span>
        <span>Previsto: {euro(expected)}</span>
      </div>

      <Card className="p-0">
        {dayAppts.length === 0 ? (
          <Empty>Sem marcações neste dia.</Empty>
        ) : (
          <ul className="divide-y divide-white/5">
            {dayAppts.map((a) => {
              const client = clientById.get(a.client_id);
              const service = getService(a.service_id);
              const isMember = insights.get(a.client_id)?.subscription?.status === "ativa";
              const reminder = fillTemplate(MESSAGE_TEMPLATES[0].text, {
                nome: firstName(client?.name ?? ""),
                data: formatDate(a.day, { weekday: "long", day: "numeric", month: "long" }),
                hora: a.start_time,
              });
              return (
                <li key={a.id} className={cn("flex flex-col gap-3 p-4 sm:flex-row sm:items-center", a.status === "cancelada" && "opacity-50")}>
                  <div className="flex items-center gap-4 sm:w-40">
                    <div>
                      <p className="font-display text-2xl font-bold text-gold-300">{a.start_time}</p>
                      <p className="text-xs text-zinc-500">até {fromMinutes(toMinutes(a.start_time) + a.duration)}</p>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-semibold text-white">
                      {client?.name ?? "Cliente removido"}
                      {isMember && <Crown size={14} className="text-gold-400" aria-label="Assinante" />}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {service?.name} · {euro(service?.price ?? 0)} {client && <>· {client.phone}</>}
                    </p>
                    {a.notes && <p className="mt-1 text-xs italic text-zinc-500">“{a.notes}”</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={a.status} />
                    {a.status === "marcada" && (
                      <>
                        <button className={btn.small} onClick={() => changeStatus(a.id, "concluida")}>
                          <Check size={14} /> Concluída
                        </button>
                        <button className={btn.small} onClick={() => changeStatus(a.id, "faltou")}>
                          <UserX size={14} /> Faltou
                        </button>
                        <button className={btn.small} onClick={() => changeStatus(a.id, "cancelada")}>
                          <Ban size={14} /> Cancelar
                        </button>
                      </>
                    )}
                    {a.status !== "marcada" && (
                      <button className={btn.small} onClick={() => changeStatus(a.id, "marcada")}>
                        Repor
                      </button>
                    )}
                    {client && (
                      <a className={btn.small} href={waLink(client.phone, reminder)} target="_blank" rel="noreferrer" title="Enviar lembrete">
                        <MessageCircle size={14} />
                      </a>
                    )}
                    <button className={btn.small} onClick={() => setEditing(a)} aria-label="Editar">
                      <Pencil size={14} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {editing && (
        <AppointmentModal
          appointment={editing === "new" ? undefined : editing}
          defaultDay={day}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
