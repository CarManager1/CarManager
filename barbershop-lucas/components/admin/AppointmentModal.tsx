"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { SERVICES } from "@/lib/siteData";
import { saveAppointment, saveClient } from "@/lib/store";
import type { Appointment } from "@/lib/types";
import { availableSlots, cn, euro } from "@/lib/utils";
import { useAdminData } from "./AdminData";
import { Field, Modal, btn } from "./ui";

type Props = {
  appointment?: Appointment;
  defaultDay: string;
  defaultClientId?: string;
  onClose: () => void;
};

export default function AppointmentModal({ appointment, defaultDay, defaultClientId, onClose }: Props) {
  const { clients, appointments, reload } = useAdminData();
  const [clientId, setClientId] = useState(appointment?.client_id ?? defaultClientId ?? "");
  const [newClient, setNewClient] = useState({ name: "", phone: "" });
  const [serviceId, setServiceId] = useState(appointment?.service_id ?? SERVICES[0].id);
  const [day, setDay] = useState(appointment?.day ?? defaultDay);
  const [time, setTime] = useState(appointment?.start_time ?? "");
  const [notes, setNotes] = useState(appointment?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = SERVICES.find((s) => s.id === serviceId)!;
  const slots = useMemo(() => {
    const busy = appointments.filter((a) => a.day === day && a.status !== "cancelada" && a.id !== appointment?.id);
    return availableSlots(day, service.duration, busy, new Date(0));
  }, [appointments, day, service, appointment?.id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!time) {
      setError("Escolha a hora.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let cid = clientId;
      if (cid === "novo") {
        cid = (await saveClient(newClient)).id;
      }
      if (!cid) throw new Error("Escolha o cliente.");
      await saveAppointment({
        id: appointment?.id,
        client_id: cid,
        service_id: serviceId,
        day,
        start_time: time,
        duration: service.duration,
        notes: notes || null,
      });
      await reload();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={appointment ? "Editar marcação" : "Nova marcação"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Cliente">
          <select className="input" value={clientId} onChange={(e) => setClientId(e.target.value)} required>
            <option value="">Escolher cliente…</option>
            <option value="novo">+ Novo cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.phone}
              </option>
            ))}
          </select>
        </Field>
        {clientId === "novo" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input" placeholder="Nome" required value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
            <input className="input" placeholder="Telemóvel" required value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Serviço">
            <select className="input" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.duration}min · {euro(s.price)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Dia">
            <input className="input" type="date" required value={day} onChange={(e) => setDay(e.target.value)} />
          </Field>
        </div>
        <Field label="Hora">
          <input className="input" type="time" step={300} required value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
        {slots.length > 0 ? (
          <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
            {slots.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTime(t)}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-xs",
                  t === time ? "border-gold-400 bg-gold-500/20 text-gold-800" : "border-zinc-200 text-zinc-500 hover:border-gold-400/50"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">Sem horários livres no horário de funcionamento (pode indicar outra hora manualmente).</p>
        )}
        <Field label="Notas">
          <textarea className="input min-h-[70px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className={btn.ghost} onClick={onClose}>
            Cancelar
          </button>
          <button className={btn.primary} disabled={saving}>
            {saving && <Loader2 size={16} className="animate-spin" />} Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
}
