'use client'

import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

// Configuração do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    
    // 1. Terminar a sessão no Supabase (limpa os cookies)
    await supabase.auth.signOut()

    // 2. Redirecionar para o login
    router.refresh() // Limpa o cache do Next.js
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
    >
      <LogOut className="h-5 w-5 group-hover:text-red-600 transition-colors" />
      {loading ? 'A sair...' : 'Terminar Sessão'}
    </button>
  )
}