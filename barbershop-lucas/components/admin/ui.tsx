"use client";

import { X } from "lucide-react";
import type { AppointmentStatus, SubscriptionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const btn = {
  primary:
    "bg-gold-gradient inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-ink-950 transition hover:brightness-110 disabled:opacity-50",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-gold-400/60 hover:text-gold-800 disabled:opacity-50",
  small:
    "inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-gold-400/60 hover:text-gold-800",
};

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase text-zinc-900 sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-zinc-200 bg-white p-5", className)}>{children}</div>;
}

export function StatCard({ label, value, hint, icon: Icon }: { label: string; value: string | number; hint?: string; icon: React.ElementType }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
        <Icon size={18} className="text-gold-600" />
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-zinc-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </Card>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        className={cn(
          "max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-zinc-200 bg-white p-6 sm:rounded-3xl",
          wide ? "max-w-3xl" : "max-w-lg"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold uppercase text-zinc-900">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900" aria-label="Fechar">
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

const APPT_STATUS: Record<AppointmentStatus, { label: string; cls: string }> = {
  marcada: { label: "Marcada", cls: "bg-sky-500/15 text-sky-700" },
  concluida: { label: "Concluída", cls: "bg-emerald-500/15 text-emerald-700" },
  faltou: { label: "Faltou", cls: "bg-amber-500/15 text-amber-700" },
  cancelada: { label: "Cancelada", cls: "bg-zinc-500/15 text-zinc-500" },
};

const SUB_STATUS: Record<SubscriptionStatus, { label: string; cls: string }> = {
  pendente: { label: "Pendente", cls: "bg-amber-500/15 text-amber-700" },
  ativa: { label: "Ativa", cls: "bg-emerald-500/15 text-emerald-700" },
  cancelada: { label: "Cancelada", cls: "bg-zinc-500/15 text-zinc-500" },
};

export function StatusBadge({ status }: { status: AppointmentStatus | SubscriptionStatus }) {
  const s = status in APPT_STATUS ? APPT_STATUS[status as AppointmentStatus] : SUB_STATUS[status as SubscriptionStatus];
  return <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide", s.cls)}>{s.label}</span>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-10 text-center text-sm text-zinc-500">{children}</p>;
}
