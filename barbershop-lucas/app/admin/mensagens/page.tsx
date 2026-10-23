"use client";

import { useMemo, useState } from "react";
import { Check, CheckSquare, Copy, MessageCircle, Send, Smartphone, Square, Users } from "lucide-react";
import { useAdminData } from "@/components/admin/AdminData";
import { Card, Empty, PageHeader, btn } from "@/components/admin/ui";
import { matchesSegment, planName, SEGMENTS, type Segment } from "@/lib/crm";
import { MESSAGE_TEMPLATES, PLANS } from "@/lib/siteData";
import { logMessage } from "@/lib/store";
import type { Client } from "@/lib/types";
import { cn, fillTemplate, firstName, formatDate, siteUrl, smsLink, waLink } from "@/lib/utils";

type Channel = "whatsapp" | "sms";

const VARIABLES = [
  { key: "nome", label: "Nome" },
  { key: "data", label: "Data da marcação" },
  { key: "hora", label: "Hora da marcação" },
  { key: "plano", label: "Plano" },
  { key: "site", label: "Link do site" },
];

export default function MensagensPage() {
  const { clients, insights, messages, reload } = useAdminData();
  const [segment, setSegment] = useState<Segment>("todos");
  const [inactiveDays, setInactiveDays] = useState(30);
  const [planId, setPlanId] = useState("all");
  const [query, setQuery] = useState("");
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [text, setText] = useState(MESSAGE_TEMPLATES[2].text);
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [queue, setQueue] = useState<{ client: Client; text: string }[] | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());

  const audience = useMemo(
    () => clients.filter((c) => matchesSegment(c, insights.get(c.id), segment, { inactiveDays, planId })),
    [clients, insights, segment, inactiveDays, planId]
  );
  const visible = audience.filter((c) => !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query));
  const selected = audience.filter((c) => !excluded.has(c.id));

  function varsFor(c: Client) {
    const info = insights.get(c.id);
    const next = info?.nextAppointment;
    return {
      nome: firstName(c.name),
      data: next ? formatDate(next.day, { weekday: "long", day: "numeric", month: "long" }) : "",
      hora: next?.start_time ?? "",
      plano: info?.subscription ? planName(info.subscription.plan_id) : "",
      site: siteUrl(),
    };
  }

  function toggle(id: string) {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function changeSegment(s: Segment) {
    setSegment(s);
    setExcluded(new Set());
    if (s === "todos") setText(MESSAGE_TEMPLATES[2].text);
    if (s === "amanha") setText(MESSAGE_TEMPLATES[0].text);
    if (s === "inativos") setText(MESSAGE_TEMPLATES[1].text);
    if (s === "sem-plano") setText(MESSAGE_TEMPLATES[3].text);
    if (s === "aniversario") setText(MESSAGE_TEMPLATES[4].text);
  }

  async function prepare() {
    const items = selected.map((client) => ({ client, text: fillTemplate(text, varsFor(client)) }));
    setQueue(items);
    setSent(new Set());
    await logMessage({ channel, text, recipients: items.length });
    reload();
  }

  const usesAppt = /\{(data|hora)\}/.test(text);
  const withoutAppt = usesAppt ? selected.filter((c) => !insights.get(c.id)?.nextAppointment).length : 0;
  const preview = selected[0] ? fillTemplate(text, varsFor(selected[0])) : text;

  if (queue) {
    return (
      <>
        <PageHeader title="Enviar mensagens" subtitle={`${sent.size} de ${queue.length} enviadas`}>
          <button className={btn.ghost} onClick={() => setQueue(null)}>
            Voltar
          </button>
        </PageHeader>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="bg-gold-gradient h-full transition-all" style={{ width: `${queue.length ? (sent.size / queue.length) * 100 : 0}%` }} />
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Clique em cada cliente para abrir o {channel === "whatsapp" ? "WhatsApp" : "SMS"} com a mensagem já escrita — só tem de carregar em enviar.
        </p>
        <Card className="p-0">
          <ul className="divide-y divide-white/5">
            {queue.map(({ client, text: msg }) => {
              const done = sent.has(client.id);
              return (
                <li key={client.id} className={cn("flex flex-col gap-3 p-4 sm:flex-row sm:items-center", done && "opacity-50")}>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">
                      {client.name} <span className="text-sm font-normal text-zinc-500">· {client.phone}</span>
                    </p>
                    <p className="mt-1 text-sm whitespace-pre-line text-zinc-400">{msg}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className={btn.small} onClick={() => navigator.clipboard.writeText(msg)} title="Copiar texto">
                      <Copy size={14} />
                    </button>
                    <a
                      href={channel === "whatsapp" ? waLink(client.phone, msg) : smsLink(client.phone, msg)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setSent((prev) => new Set(prev).add(client.id))}
                      className={done ? btn.ghost : btn.primary}
                    >
                      {done ? <Check size={16} /> : <Send size={16} />} {done ? "Enviada" : "Enviar"}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Mensagens" subtitle="Escolha os clientes, escreva a mensagem e envie por WhatsApp ou SMS." />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        {/* 1. DESTINATÁRIOS */}
        <Card>
          <h2 className="mb-1 flex items-center gap-2 font-display text-xl font-bold uppercase text-white">
            <Users size={18} className="text-gold-400" /> 1. Destinatários
          </h2>
          <p className="mb-4 text-xs text-zinc-500">{SEGMENTS.find((s) => s.id === segment)?.hint}</p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {SEGMENTS.map((s) => (
              <button
                key={s.id}
                onClick={() => changeSegment(s.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  segment === s.id ? "border-gold-400 bg-gold-500/15 text-gold-200" : "border-white/10 text-zinc-400 hover:text-white"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {segment === "inativos" && (
            <label className="mb-4 flex items-center gap-2 text-sm text-zinc-300">
              Sem visita há pelo menos
              <input type="number" min={1} className="input w-20 py-1.5" value={inactiveDays} onChange={(e) => setInactiveDays(Number(e.target.value) || 1)} />
              dias
            </label>
          )}
          {segment === "assinantes" && (
            <select className="input mb-4" value={planId} onChange={(e) => setPlanId(e.target.value)}>
              <option value="all">Todos os planos</option>
              {PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  Plano {p.name}
                </option>
              ))}
            </select>
          )}

          <div className="mb-3 flex items-center gap-2">
            <input className="input py-2" placeholder="Filtrar lista…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className={btn.small} onClick={() => setExcluded(new Set())}>
              Todos
            </button>
            <button className={btn.small} onClick={() => setExcluded(new Set(audience.map((c) => c.id)))}>
              Nenhum
            </button>
          </div>

          {visible.length === 0 ? (
            <Empty>Nenhum cliente neste grupo.</Empty>
          ) : (
            <ul className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
              {visible.map((c) => {
                const on = !excluded.has(c.id);
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => toggle(c.id)}
                      className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition", on ? "bg-gold-500/10" : "hover:bg-white/5")}
                    >
                      {on ? <CheckSquare size={18} className="shrink-0 text-gold-400" /> : <Square size={18} className="shrink-0 text-zinc-600" />}
                      <span className="flex-1 truncate text-sm text-white">{c.name}</span>
                      <span className="text-xs text-zinc-500">{c.phone}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-3 text-sm font-semibold text-gold-300">{selected.length} cliente(s) selecionado(s)</p>
        </Card>

        {/* 2. MENSAGEM */}
        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold uppercase text-white">
              <MessageCircle size={18} className="text-gold-400" /> 2. Mensagem
            </h2>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {MESSAGE_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setText(t.text)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition",
                    text === t.text ? "border-gold-400 bg-gold-500/15 text-gold-200" : "border-white/10 text-zinc-400 hover:text-white"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <textarea className="input min-h-[140px]" value={text} onChange={(e) => setText(e.target.value)} />
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-zinc-500">Inserir:</span>
              {VARIABLES.map((v) => (
                <button key={v.key} className={btn.small} onClick={() => setText((t) => `${t}{${v.key}}`)}>
                  {v.label}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Pré-visualização {selected[0] && <span className="normal-case text-zinc-500">({selected[0].name})</span>}
              </p>
              <div className="max-w-md rounded-2xl rounded-tl-sm bg-[#005c4b] px-4 py-3 text-sm whitespace-pre-line text-white shadow">{preview}</div>
              {withoutAppt > 0 && (
                <p className="mt-3 text-xs text-amber-300">
                  Atenção: {withoutAppt} cliente(s) selecionado(s) não têm marcação, por isso {"{data}"} e {"{hora}"} ficam vazios. Use o grupo “Marcação amanhã”.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold uppercase text-white">
              <Send size={18} className="text-gold-400" /> 3. Enviar
            </h2>
            <div className="mb-4 grid grid-cols-2 gap-2">
              {(
                [
                  ["whatsapp", "WhatsApp", MessageCircle],
                  ["sms", "SMS", Smartphone],
                ] as const
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setChannel(id)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition",
                    channel === id ? "border-gold-400 bg-gold-500/15 text-gold-200" : "border-white/10 text-zinc-400"
                  )}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
            <button className={cn(btn.primary, "w-full py-3")} disabled={!selected.length || !text.trim()} onClick={prepare}>
              <Send size={16} /> Preparar envio para {selected.length} cliente(s)
            </button>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <h2 className="mb-4 font-display text-xl font-bold uppercase text-white">Histórico</h2>
        {messages.length === 0 ? (
          <Empty>Ainda não enviou mensagens.</Empty>
        ) : (
          <ul className="divide-y divide-white/5">
            {messages.map((m) => (
              <li key={m.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
                <span className="w-36 shrink-0 text-xs text-zinc-500">
                  {new Date(m.created_at).toLocaleString("pt-PT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="flex-1 truncate text-sm text-zinc-300">{m.text}</span>
                <span className="text-xs text-gold-300">
                  {m.recipients} · {m.channel === "whatsapp" ? "WhatsApp" : "SMS"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
