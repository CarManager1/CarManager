'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  LayoutDashboard, Calendar, Users, FileText, 
  UserCog, LogOut, Loader2, Wrench, Menu, X, CreditCard
} from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserRole(user.user_metadata?.role || 'owner')
      setUserName(user.user_metadata?.nome || user.email?.split('@')[0])
      setLoading(false)
    }
    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { label: 'Visão Geral', href: '/dashboard/visao-geral', icon: LayoutDashboard, ownerOnly: true },
    { label: 'Agenda', href: '/dashboard/agenda', icon: Calendar, ownerOnly: false }, // Mecânico vê
    { label: 'Clientes', href: '/dashboard/clientes', icon: Users, ownerOnly: false }, // Mecânico vê (consultar dados)
    { label: 'Orçamentos', href: '/dashboard/orcamentos', icon: FileText, ownerOnly: false }, // Mecânico vê (histórico)
    { label: 'Faturação', href: '/dashboard/faturacao', icon: CreditCard, ownerOnly: true }, // NOVO: Só dono
    { label: 'Equipa', href: '/dashboard/equipa', icon: UserCog, ownerOnly: true }, // Só dono
  ]

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      
      {/* SIDEBAR (Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-zinc-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static
      `}>
        <div className="p-8">
          {/* LOGO CARMANAGER */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
              <Wrench className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter uppercase italic text-blue-900 leading-none">CarManager</span>
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Controlo Total</span>
            </div>
            {/* Fechar menu em mobile */}
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto text-zinc-400">
              <X size={24}/>
            </button>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              // Se o item for apenas para dono e o user for mecânico, não mostra
              if (item.ownerOnly && userRole === 'mechanic') return null
              
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)} // Fecha ao clicar (mobile)
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                    active 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 translate-x-1' 
                    : 'text-zinc-500 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1'
                  }`}
                >
                  <item.icon size={18} strokeWidth={2.5} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* RODAPÉ SIDEBAR */}
        <div className="mt-auto p-6 border-t border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-white border border-zinc-100 rounded-2xl shadow-sm">
            <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-black uppercase shadow-sm">
              {userName.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-black text-zinc-900 truncate uppercase">{userName}</span>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest truncate">
                {userRole === 'mechanic' ? 'Mecânico' : 'Administrador'}
              </span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 font-bold text-xs uppercase tracking-wider hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
          >
            <LogOut size={16} /> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* HEADER MOBILE (Apenas visível em ecrãs pequenos) */}
        <header className="md:hidden bg-white border-b border-zinc-200 px-4 py-3 flex justify-between items-center z-40 shrink-0">
           <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg"><Wrench size={18} className="text-white"/></div>
              <span className="font-black tracking-tight text-blue-900 uppercase italic">CarManager</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg">
              <Menu size={24}/>
           </button>
        </header>

        {/* OVERLAY MOBILE */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* PÁGINA PRINCIPAL (SCROLL) */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 scroll-smooth">
          {children}
        </main>

      </div>
    </div>
  )
}