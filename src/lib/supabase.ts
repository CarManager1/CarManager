import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// O ERRO ESTAVA AQUI: É obrigatório ter "export" antes de const
export const supabase = createClient(supabaseUrl, supabaseKey);