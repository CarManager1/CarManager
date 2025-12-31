'use server'

import { createClient } from '@supabase/supabase-js'

export async function createMechanicLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nome = formData.get('nome') as string

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Deve estar no seu .env.local
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Criar o utilizador na Auth do Supabase
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nome, role: 'mechanic' }
  })

  if (authError) return { error: 'Erro na Auth: ' + authError.message }
  return { success: true, authId: authUser.user.id }
}