// Cálculos do CRM a partir dos dados brutos (última visita, assinantes, segmentos…).

import { PLANS } from "./siteData";
import type { Appointment, Client, Subscription } from "./types";
import { addDays, fromISODate, getService, toISODate } from "./utils";

export type ClientInsight = {
  lastVisit: string | null;
  visits: number;
  noShows: number;
  totalSpent: number;
  nextAppointment: Appointment | null;
  subscription: Subscription | null; // ativa ou pendente
};

export function buildInsights(clients: Client[], appointments: Appointment[], subscriptions: Subscription[]) {
  const today = toISODate(new Date());
  const map = new Map<string, ClientInsight>();
  for (const c of clients) {
    map.set(c.id, { lastVisit: null, visits: 0, noShows: 0, totalSpent: 0, nextAppointment: null, subscription: null });
  }
  for (const a of appointments) {
    const info = map.get(a.client_id);
    if (!info) continue;
    if (a.status === "concluida") {
      info.visits++;
      info.totalSpent += getService(a.service_id)?.price ?? 0;
      if (!info.lastVisit || a.day > info.lastVisit) info.lastVisit = a.day;
    } else if (a.status === "faltou") {
      info.noShows++;
    } else if (a.status === "marcada" && a.day >= today) {
      const next = info.nextAppointment;
      if (!next || a.day + a.start_time < next.day + next.start_time) info.nextAppointment = a;
    }
  }
  for (const s of subscriptions) {
    const info = map.get(s.client_id);
    if (!info || s.status === "cancelada") continue;
    if (!info.subscription || s.status === "ativa") info.subscription = s;
  }
  return map;
}

export function daysSince(day: string | null) {
  if (!day) return null;
  return Math.floor((fromISODate(toISODate(new Date())).getTime() - fromISODate(day).getTime()) / 86_400_000);
}

export function planName(planId: string) {
  return PLANS.find((p) => p.id === planId)?.name ?? planId;
}

export function planPrice(planId: string) {
  return PLANS.find((p) => p.id === planId)?.price ?? 0;
}

export type Segment =
  | "todos"
  | "assinantes"
  | "sem-plano"
  | "inativos"
  | "amanha"
  | "aniversario"
  | "novos";

export const SEGMENTS: { id: Segment; label: string; hint: string }[] = [
  { id: "todos", label: "Todos", hint: "Todos os clientes" },
  { id: "assinantes", label: "Assinantes", hint: "Com plano ativo" },
  { id: "sem-plano", label: "Sem plano", hint: "Bons candidatos ao clube" },
  { id: "inativos", label: "Inativos", hint: "Sem visita há X dias" },
  { id: "amanha", label: "Marcação amanhã", hint: "Para enviar lembretes" },
  { id: "aniversario", label: "Aniversário este mês", hint: "Com data de nascimento" },
  { id: "novos", label: "Novos", hint: "Registados nos últimos 30 dias" },
];

export function matchesSegment(
  client: Client,
  info: ClientInsight | undefined,
  segment: Segment,
  opts: { inactiveDays: number; planId: string }
) {
  const now = new Date();
  switch (segment) {
    case "todos":
      return true;
    case "assinantes":
      return info?.subscription?.status === "ativa" && (opts.planId === "all" || info.subscription.plan_id === opts.planId);
    case "sem-plano":
      return !info?.subscription || info.subscription.status !== "ativa";
    case "inativos": {
      if (info?.nextAppointment) return false;
      // sem visitas concluídas conta a partir da data de registo
      const ref = info?.lastVisit ?? client.created_at.slice(0, 10);
      return (daysSince(ref) ?? 0) >= opts.inactiveDays;
    }
    case "amanha":
      return info?.nextAppointment?.day === toISODate(addDays(now, 1));
    case "aniversario":
      return !!client.birthday && Number(client.birthday.slice(5, 7)) === now.getMonth() + 1;
    case "novos":
      return (daysSince(client.created_at.slice(0, 10)) ?? 999) <= 30;
  }
}
