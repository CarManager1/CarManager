"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#planos", label: "Planos" },
  { href: "#sobre", label: "O Barbeiro" },
  { href: "#contactos", label: "Contactos" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        scrolled || open ? "border-b border-zinc-200 bg-white/90 backdrop-blur" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/media/logo.png" alt="Barber Shop Lucas" width={52} height={50} priority />
          <span className="hidden font-display text-lg font-bold uppercase tracking-wider text-zinc-900 sm:block">
            Barber Shop <span className="text-gold-600">Lucas</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-zinc-600 transition hover:text-gold-700">
              {l.label}
            </a>
          ))}
          <a href="#marcar" className="bg-gold-gradient rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-ink-950 shadow-lg shadow-gold-500/20 transition hover:brightness-110">
            Marcar agora
          </a>
        </div>

        <button className="text-zinc-900 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {open && (
        <div className="space-y-1 px-4 pb-6 md:hidden">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-zinc-700 hover:bg-stone-100">
              {l.label}
            </a>
          ))}
          <a href="#marcar" onClick={() => setOpen(false)} className="bg-gold-gradient mt-3 block rounded-full px-5 py-3 text-center font-bold uppercase text-ink-950">
            Marcar agora
          </a>
        </div>
      )}
    </header>
  );
}
