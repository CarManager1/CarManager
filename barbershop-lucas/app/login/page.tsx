"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { isDemoMode, supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoMode) router.replace("/admin");
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError("Email ou palavra-passe incorretos.");
    else router.replace("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(212,161,47,0.15),transparent_60%)] p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl border border-gold-500/30 bg-white p-8">
        <div className="mb-2 flex flex-col items-center text-center">
          <Image src="/media/logo.png" alt="Barber Shop Lucas" width={110} height={105} priority />
          <h1 className="mt-4 font-display text-2xl font-bold uppercase text-zinc-900">Área de gestão</h1>
        </div>
        <input className="input" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Palavra-passe" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="bg-gold-gradient flex w-full items-center justify-center gap-2 rounded-full py-3 font-bold uppercase text-ink-950 disabled:opacity-60">
          {loading && <Loader2 size={18} className="animate-spin" />} Entrar
        </button>
      </form>
    </main>
  );
}
