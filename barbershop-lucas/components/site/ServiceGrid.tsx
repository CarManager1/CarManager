"use client";

import { ArrowRight, Clock } from "lucide-react";
import { SERVICES } from "@/lib/siteData";
import { euro } from "@/lib/utils";
import { selectService } from "./events";

export default function ServiceGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((s) => (
        <button
          key={s.id}
          onClick={() => selectService(s.id)}
          className="group rounded-3xl border border-white/10 bg-ink-900 p-6 text-left transition hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-xl hover:shadow-gold-500/5"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl font-bold uppercase text-white">{s.name}</h3>
            <span className="text-gold-gradient font-display text-3xl font-bold">{euro(s.price)}</span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">{s.description}</p>
          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Clock size={14} /> {s.duration} min
            </span>
            <span className="flex items-center gap-1 font-semibold text-gold-400 transition group-hover:gap-2">
              Marcar <ArrowRight size={16} />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
