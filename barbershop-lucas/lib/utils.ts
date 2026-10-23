import { OPENING_HOURS, SERVICES, SLOT_MINUTES } from "./siteData";
import type { BusySlot } from "./types";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function toISODate(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function fromISODate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

export function formatDate(day: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) {
  return fromISODate(day).toLocaleDateString("pt-PT", opts);
}

export function euro(n: number) {
  return n.toLocaleString("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: n % 1 ? 2 : 0 });
}

export function getService(id: string) {
  return SERVICES.find((s) => s.id === id);
}

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

// Número para links wa.me (assume Portugal quando tem 9 dígitos).
export function waNumber(phone: string) {
  const digits = normalizePhone(phone);
  return digits.length === 9 ? `351${digits}` : digits;
}

export function waLink(phone: string, text: string) {
  return `https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(text)}`;
}

export function smsLink(phone: string, text: string) {
  return `sms:${normalizePhone(phone)}?body=${encodeURIComponent(text)}`;
}

export function overlaps(aStart: number, aDur: number, bStart: number, bDur: number) {
  return aStart < bStart + bDur && bStart < aStart + aDur;
}

// Horários livres num dia para um serviço com a duração indicada.
export function availableSlots(day: string, duration: number, busy: BusySlot[], now = new Date()) {
  const hours = OPENING_HOURS[fromISODate(day).getDay()];
  if (!hours) return [];
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const isToday = day === toISODate(now);
  const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + 30 : 0;

  const slots: string[] = [];
  for (let t = open; t + duration <= close; t += SLOT_MINUTES) {
    if (t < earliest) continue;
    if (busy.some((b) => overlaps(t, duration, toMinutes(b.start_time), b.duration))) continue;
    slots.push(fromMinutes(t));
  }
  return slots;
}

export function fillTemplate(text: string, vars: Record<string, string>) {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function siteUrl() {
  return typeof window === "undefined" ? "" : window.location.origin;
}
