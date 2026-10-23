export type Client = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  birthday?: string | null; // YYYY-MM-DD
  notes?: string | null;
  created_at: string;
};

export type AppointmentStatus = "marcada" | "concluida" | "faltou" | "cancelada";

export type Appointment = {
  id: string;
  client_id: string;
  service_id: string;
  day: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  duration: number;
  status: AppointmentStatus;
  notes?: string | null;
  created_at: string;
};

export type SubscriptionStatus = "pendente" | "ativa" | "cancelada";

export type Subscription = {
  id: string;
  client_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date?: string | null;
  created_at: string;
};

export type MessageLog = {
  id: string;
  channel: "whatsapp" | "sms";
  text: string;
  recipients: number;
  created_at: string;
};

export type BusySlot = { start_time: string; duration: number };

export type BookingInput = {
  name: string;
  phone: string;
  email?: string;
  service_id: string;
  day: string;
  start_time: string;
  notes?: string;
};

export type SubscriptionRequest = {
  name: string;
  phone: string;
  email?: string;
  plan_id: string;
};
