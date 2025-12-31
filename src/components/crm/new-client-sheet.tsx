"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function NewClientSheet() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "", telemovel: "", email: "", matricula: "", marca: "", modelo: "", ano: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. BUSCAR UTILIZADOR
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sem sessão.");

      // 2. BUSCAR A OFICINA DESTE UTILIZADOR
      const { data: oficina } = await supabase
        .from('oficinas')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!oficina) throw new Error("Erro: Oficina não encontrada.");

      // 3. CRIAR CLIENTE (Com o ID da oficina correto)
      const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert({
          nome: formData.nome,
          telemovel: formData.telemovel,
          email: formData.email,
          workshop_id: oficina.id 
        })
        .select().single();

      if (clientError) throw clientError;

      // 4. CRIAR VIATURA
      const { error: vehicleError } = await supabase
        .from("vehicles")
        .insert({
          workshop_id: oficina.id,
          client_id: newClient.id,
          matricula: formData.matricula.toUpperCase(),
          marca: formData.marca,
          modelo: formData.modelo,
          ano: parseInt(formData.ano) || null
        });

      if (vehicleError) throw vehicleError;

      // 5. LIMPAR E RECARREGAR A PÁGINA
      setIsOpen(false);
      setFormData({ nome: "", telemovel: "", email: "", matricula: "", marca: "", modelo: "", ano: "" });
      
      // Força bruta para garantir que a lista atualiza
      window.location.reload(); 

    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="h-14 bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl font-black uppercase tracking-widest shadow-xl gap-2">
          <Plus size={20} strokeWidth={3} /> Novo Registo
        </Button>
      </SheetTrigger>
      
      <SheetContent className="sm:max-w-md bg-white p-0">
        <div className="bg-slate-900 p-8">
          <SheetTitle className="text-3xl font-black uppercase text-white">Novo Cliente</SheetTitle>
          <p className="text-slate-400 mt-2 text-sm">Preencha os dados para criar a ficha.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <Label className="font-bold text-xs uppercase text-slate-500">Dados Pessoais</Label>
            <Input name="nome" placeholder="Nome Completo *" required value={formData.nome} onChange={handleChange} className="h-12 border-2 rounded-xl font-bold" />
            <div className="grid grid-cols-2 gap-4">
              <Input name="telemovel" placeholder="Telemóvel *" required value={formData.telemovel} onChange={handleChange} className="h-12 border-2 rounded-xl font-bold" />
              <Input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} className="h-12 border-2 rounded-xl font-bold" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="font-bold text-xs uppercase text-slate-500">Viatura</Label>
            <Input name="matricula" placeholder="MATRÍCULA *" required value={formData.matricula} onChange={handleChange} className="h-12 border-2 rounded-xl font-black uppercase bg-slate-50 text-center" />
            <div className="grid grid-cols-2 gap-4">
              <Input name="marca" placeholder="Marca" value={formData.marca} onChange={handleChange} className="h-12 border-2 rounded-xl font-bold" />
              <Input name="modelo" placeholder="Modelo" value={formData.modelo} onChange={handleChange} className="h-12 border-2 rounded-xl font-bold" />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg mt-6">
            {isLoading ? <Loader2 className="animate-spin" /> : "Gravar Dados"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}