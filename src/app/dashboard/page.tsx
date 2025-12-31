import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, Users, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

async function getDashboardData() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Busca a oficina do utilizador
  const { data: oficina } = await supabase
    .from('oficinas')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!oficina) return null;

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

  // 1. Faturação baseada em orçamentos Aceites
  const { data: quotesMes } = await supabase
    .from('quotes')
    .select('valor_total, status')
    .eq('workshop_id', oficina.id)
    .gte('created_at', startOfMonth);

  // 2. Contagem de Clientes
  const { count: totalClientes } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('workshop_id', oficina.id);

  // 3. Orçamentos Ativos (Não Aceites)
  const { count: orcamentosAtivos } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true })
    .eq('workshop_id', oficina.id)
    .neq('status', 'Aceite');

  const faturacaoTotal = quotesMes?.filter(q => q.status === 'Aceite').reduce((acc, curr) => acc + (Number(curr.valor_total) || 0), 0) || 0;
  const concluidosMes = quotesMes?.filter(q => q.status === 'Aceite').length || 0;

  return { faturacaoTotal, totalClientes, orcamentosAtivos, concluidosMes };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  if (!data) return <div className="p-8">Por favor, complete o perfil da sua oficina.</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Visão Geral</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Faturação (Mês)</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.faturacaoTotal.toFixed(2)}€</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pendentes</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.orcamentosAtivos}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Clientes</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalClientes}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Produtividade</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.concluidosMes}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm bg-slate-900 text-white">
        <CardHeader><CardTitle className="text-white">Acesso Rápido</CardTitle></CardHeader>
        <CardContent>
          <Link href="/dashboard/clientes">
            <div className="group flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-red-500" />
                <div><div className="font-semibold text-white">Nova Ficha de Cliente</div></div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500" />
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}