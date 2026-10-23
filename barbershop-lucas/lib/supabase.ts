import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Sem variáveis de ambiente a app corre em modo demo (dados no browser).
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

export const isDemoMode = !supabase;
