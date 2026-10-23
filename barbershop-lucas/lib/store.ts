// Camada de dados. Usa o Supabase quando está configurado; caso contrário
// guarda tudo no localStorage do browser (modo demo).

import { supabase } from "./supabase";
import { SERVICES } from "./siteData";
import { addDays, normalizePhone, overlaps, toISODate, toMinutes } from "./utils";
import type {
  Appointment,
  AppointmentStatus,
  BookingInput,
  BusySlot,
  Client,
  MessageLog,
  Subscription,
  SubscriptionRequest,
} from "./types";

type LocalDB = {
  clients: Client[];
  appointments: Appointment[];
  subscriptions: Subscription[];
  messages: MessageLog[];
};

const STORAGE_KEY = "barbershop-lucas-db";

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function nowISO() {
  return new Date().toISOString();
}

function seed(): LocalDB {
  const today = new Date();
  const d = (n: number) => toISODate(addDays(today, n));
  const clients: Client[] = [
    { id: "c1", name: "João Ferreira", phone: "912345678", email: "joao@email.pt", birthday: `1995-${String(today.getMonth() + 1).padStart(2, "0")}-14`, created_at: d(-120) },
    { id: "c2", name: "Miguel Santos", phone: "913456789", created_at: d(-90) },
    { id: "c3", name: "Rafael Costa", phone: "914567890", notes: "Prefere degradê baixo.", created_at: d(-60) },
    { id: "c4", name: "Tiago Almeida", phone: "915678901", created_at: d(-200) },
    { id: "c5", name: "Bruno Oliveira", phone: "916789012", email: "bruno@email.pt", created_at: d(-30) },
    { id: "c6", name: "André Martins", phone: "917890123", created_at: d(-10) },
  ].map((c) => ({ ...c, created_at: `${c.created_at}T10:00:00.000Z` }));

  const appt = (id: string, client_id: string, service_id: string, day: string, start_time: string, status: AppointmentStatus): Appointment => ({
    id,
    client_id,
    service_id,
    day,
    start_time,
    duration: SERVICES.find((s) => s.id === service_id)?.duration ?? 30,
    status,
    created_at: nowISO(),
  });

  return {
    clients,
    appointments: [
      appt("a1", "c1", "corte-barba", d(0), "10:00", "marcada"),
      appt("a2", "c2", "corte", d(0), "11:30", "marcada"),
      appt("a3", "c3", "degrade", d(0), "15:00", "marcada"),
      appt("a4", "c5", "corte", d(1), "09:30", "marcada"),
      appt("a5", "c6", "barba", d(1), "17:00", "marcada"),
      appt("a6", "c1", "corte", d(-14), "10:00", "concluida"),
      appt("a7", "c2", "corte-barba", d(-7), "12:00", "concluida"),
      appt("a8", "c4", "corte", d(-45), "16:00", "concluida"),
      appt("a9", "c3", "degrade", d(-20), "18:00", "faltou"),
    ],
    subscriptions: [
      { id: "s1", client_id: "c1", plan_id: "premium", status: "ativa", start_date: d(-40), created_at: nowISO() },
      { id: "s2", client_id: "c3", plan_id: "essencial", status: "ativa", start_date: d(-15), created_at: nowISO() },
      { id: "s3", client_id: "c6", plan_id: "vip", status: "pendente", created_at: nowISO() },
    ],
    messages: [],
  };
}

function readLocal(): LocalDB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LocalDB;
  } catch {
    // ignora e volta a criar os dados de exemplo
  }
  const db = seed();
  writeLocal(db);
  return db;
}

function writeLocal(db: LocalDB) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // sem storage disponível (ex.: modo privado)
  }
}

function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

function findOrCreateLocalClient(db: LocalDB, input: { name: string; phone: string; email?: string }) {
  const phone = normalizePhone(input.phone);
  let client = db.clients.find((c) => normalizePhone(c.phone) === phone);
  if (client) {
    client.name = input.name || client.name;
    client.email = input.email || client.email;
  } else {
    client = { id: uid(), name: input.name, phone, email: input.email || null, created_at: nowISO() };
    db.clients.push(client);
  }
  return client;
}

/* ---------- Público (site) ---------- */

export async function getBusySlots(day: string): Promise<BusySlot[]> {
  if (supabase) return must(await supabase.rpc("get_busy_slots", { p_day: day })) ?? [];
  return readLocal()
    .appointments.filter((a) => a.day === day && a.status !== "cancelada")
    .map(({ start_time, duration }) => ({ start_time, duration }));
}

export async function bookAppointment(input: BookingInput): Promise<void> {
  const duration = SERVICES.find((s) => s.id === input.service_id)?.duration ?? 30;
  if (supabase) {
    must(
      await supabase.rpc("book_appointment", {
        p_name: input.name,
        p_phone: normalizePhone(input.phone),
        p_email: input.email || null,
        p_service_id: input.service_id,
        p_day: input.day,
        p_start_time: input.start_time,
        p_duration: duration,
        p_notes: input.notes || null,
      })
    );
    return;
  }
  const db = readLocal();
  const clash = db.appointments.some(
    (a) => a.day === input.day && a.status !== "cancelada" && overlaps(toMinutes(a.start_time), a.duration, toMinutes(input.start_time), duration)
  );
  if (clash) throw new Error("Esse horário acabou de ser ocupado. Escolha outro, por favor.");
  const client = findOrCreateLocalClient(db, input);
  db.appointments.push({
    id: uid(),
    client_id: client.id,
    service_id: input.service_id,
    day: input.day,
    start_time: input.start_time,
    duration,
    status: "marcada",
    notes: input.notes || null,
    created_at: nowISO(),
  });
  writeLocal(db);
}

export async function requestSubscription(input: SubscriptionRequest): Promise<void> {
  if (supabase) {
    must(
      await supabase.rpc("request_subscription", {
        p_name: input.name,
        p_phone: normalizePhone(input.phone),
        p_email: input.email || null,
        p_plan_id: input.plan_id,
      })
    );
    return;
  }
  const db = readLocal();
  const client = findOrCreateLocalClient(db, input);
  db.subscriptions.push({ id: uid(), client_id: client.id, plan_id: input.plan_id, status: "pendente", created_at: nowISO() });
  writeLocal(db);
}

/* ---------- Gestão (CRM) ---------- */

export async function listClients(): Promise<Client[]> {
  if (supabase) return must(await supabase.from("clients").select("*").order("name"));
  return [...readLocal().clients].sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveClient(client: Partial<Client> & { name: string; phone: string }): Promise<Client> {
  const row = { ...client, phone: normalizePhone(client.phone) };
  if (supabase) {
    if (row.id) return must(await supabase.from("clients").update(row).eq("id", row.id).select().single());
    return must(await supabase.from("clients").insert(row).select().single());
  }
  const db = readLocal();
  const existing = db.clients.find((c) => c.id === row.id);
  if (db.clients.some((c) => c.id !== row.id && normalizePhone(c.phone) === row.phone)) {
    throw new Error("Já existe um cliente com esse telemóvel.");
  }
  let saved: Client;
  if (existing) {
    saved = Object.assign(existing, row);
  } else {
    saved = { ...row, id: uid(), created_at: nowISO() };
    db.clients.push(saved);
  }
  writeLocal(db);
  return saved;
}

export async function deleteClient(id: string): Promise<void> {
  if (supabase) {
    must(await supabase.from("clients").delete().eq("id", id));
    return;
  }
  const db = readLocal();
  db.clients = db.clients.filter((c) => c.id !== id);
  db.appointments = db.appointments.filter((a) => a.client_id !== id);
  db.subscriptions = db.subscriptions.filter((s) => s.client_id !== id);
  writeLocal(db);
}

export async function listAppointments(from?: string, to?: string): Promise<Appointment[]> {
  if (supabase) {
    let q = supabase.from("appointments").select("*");
    if (from) q = q.gte("day", from);
    if (to) q = q.lte("day", to);
    return must(await q.order("day").order("start_time"));
  }
  return readLocal()
    .appointments.filter((a) => (!from || a.day >= from) && (!to || a.day <= to))
    .sort((a, b) => (a.day + a.start_time).localeCompare(b.day + b.start_time));
}

export async function saveAppointment(appt: Partial<Appointment> & Pick<Appointment, "client_id" | "service_id" | "day" | "start_time" | "duration">): Promise<void> {
  if (supabase) {
    if (appt.id) must(await supabase.from("appointments").update(appt).eq("id", appt.id));
    else must(await supabase.from("appointments").insert({ status: "marcada", ...appt }));
    return;
  }
  const db = readLocal();
  const existing = db.appointments.find((a) => a.id === appt.id);
  if (existing) Object.assign(existing, appt);
  else db.appointments.push({ status: "marcada", created_at: nowISO(), ...appt, id: uid() });
  writeLocal(db);
}

export async function setAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> {
  if (supabase) {
    must(await supabase.from("appointments").update({ status }).eq("id", id));
    return;
  }
  const db = readLocal();
  const appt = db.appointments.find((a) => a.id === id);
  if (appt) appt.status = status;
  writeLocal(db);
}

export async function listSubscriptions(): Promise<Subscription[]> {
  if (supabase) return must(await supabase.from("subscriptions").select("*").order("created_at", { ascending: false }));
  return [...readLocal().subscriptions].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function saveSubscription(sub: Partial<Subscription> & Pick<Subscription, "client_id" | "plan_id">): Promise<void> {
  if (supabase) {
    if (sub.id) must(await supabase.from("subscriptions").update(sub).eq("id", sub.id));
    else must(await supabase.from("subscriptions").insert({ status: "pendente", ...sub }));
    return;
  }
  const db = readLocal();
  const existing = db.subscriptions.find((s) => s.id === sub.id);
  if (existing) Object.assign(existing, sub);
  else db.subscriptions.push({ status: "pendente", created_at: nowISO(), ...sub, id: uid() });
  writeLocal(db);
}

export async function listMessages(): Promise<MessageLog[]> {
  if (supabase) return must(await supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(50));
  return [...readLocal().messages].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function logMessage(msg: Omit<MessageLog, "id" | "created_at">): Promise<void> {
  if (supabase) {
    must(await supabase.from("messages").insert(msg));
    return;
  }
  const db = readLocal();
  db.messages.push({ ...msg, id: uid(), created_at: nowISO() });
  writeLocal(db);
}

export function resetDemoData() {
  writeLocal(seed());
}
