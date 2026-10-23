"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, Crown, ExternalLink, LayoutDashboard, Loader2, LogOut, Menu, MessageSquare, Users, X } from "lucide-react";
import { AdminDataProvider } from "@/components/admin/AdminData";
import { isDemoMode, supabase } from "@/lib/supabase";
import { resetDemoData } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/planos", label: "Planos", icon: Crown },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(isDemoMode);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else setReady(true);
    });
  }, [router]);

  async function logout() {
    await supabase?.auth.signOut();
    router.replace("/login");
  }

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-gold-600" size={32} />
      </div>
    );
  }

  return (
    <AdminDataProvider>
      <div className="flex min-h-screen bg-stone-50">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform lg:translate-x-0",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center gap-3 p-6">
            <Image src="/media/logo.png" alt="Barber Shop Lucas" width={48} height={46} />
            <div className="leading-tight">
              <p className="font-display text-lg font-bold uppercase text-zinc-900">Barber Shop</p>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Gestão</p>
            </div>
            <button className="ml-auto text-zinc-500 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
              <X />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                    active ? "bg-gold-500/15 text-gold-800" : "text-zinc-500 hover:bg-stone-100 hover:text-zinc-900"
                  )}
                >
                  <Icon size={18} className={active ? "text-gold-600" : ""} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-1 border-t border-zinc-200 p-3">
            <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-500 hover:bg-stone-100 hover:text-zinc-900">
              <ExternalLink size={18} /> Ver site
            </Link>
            {!isDemoMode && (
              <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-500 hover:bg-stone-100 hover:text-zinc-900">
                <LogOut size={18} /> Sair
              </button>
            )}
          </div>
        </aside>

        {menuOpen && <div className="fixed inset-0 z-30 bg-zinc-900/40 lg:hidden" onClick={() => setMenuOpen(false)} />}

        <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
          <header className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 lg:hidden">
            <button onClick={() => setMenuOpen(true)} className="text-zinc-900" aria-label="Abrir menu">
              <Menu />
            </button>
            <span className="font-display font-bold uppercase text-zinc-900">Barber Shop Lucas</span>
          </header>
          {isDemoMode && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold-500/20 bg-gold-500/10 px-4 py-2 text-xs text-gold-800 sm:px-8">
              <span>Modo demo: os dados ficam guardados neste browser. Liga o Supabase para dados reais (ver README).</span>
              <button
                className="underline underline-offset-2 hover:text-zinc-900"
                onClick={() => {
                  resetDemoData();
                  window.location.reload();
                }}
              >
                Repor dados de exemplo
              </button>
            </div>
          )}
          <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-8">{children}</main>
        </div>
      </div>
    </AdminDataProvider>
  );
}
