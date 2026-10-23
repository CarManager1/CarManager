"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { buildInsights, type ClientInsight } from "@/lib/crm";
import { listAppointments, listClients, listMessages, listSubscriptions } from "@/lib/store";
import type { Appointment, Client, MessageLog, Subscription } from "@/lib/types";
import { addDays, toISODate } from "@/lib/utils";

type AdminData = {
  loading: boolean;
  error: string | null;
  clients: Client[];
  appointments: Appointment[];
  subscriptions: Subscription[];
  messages: MessageLog[];
  insights: Map<string, ClientInsight>;
  clientById: Map<string, Client>;
  reload: () => Promise<void>;
};

const Ctx = createContext<AdminData | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [messages, setMessages] = useState<MessageLog[]>([]);

  const reload = useCallback(async () => {
    try {
      const from = toISODate(addDays(new Date(), -365));
      const [c, a, s, m] = await Promise.all([listClients(), listAppointments(from), listSubscriptions(), listMessages()]);
      setClients(c);
      setAppointments(a);
      setSubscriptions(s);
      setMessages(m);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carregamento inicial dos dados
    reload();
  }, [reload]);

  const value = useMemo<AdminData>(
    () => ({
      loading,
      error,
      clients,
      appointments,
      subscriptions,
      messages,
      insights: buildInsights(clients, appointments, subscriptions),
      clientById: new Map(clients.map((c) => [c.id, c])),
      reload,
    }),
    [loading, error, clients, appointments, subscriptions, messages, reload]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminData tem de estar dentro de AdminDataProvider");
  return ctx;
}
