"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Plus, Loader2, Search, Wrench, Zap, Car, PaintBucket, 
  Volume2, Thermometer, Accessibility, Fuel, BatteryCharging, 
  Truck, Armchair, CheckCircle2, FileText, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Importante: Textarea
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";

// --- 1. CONFIGURAÇÃO DOS SERVIÇOS ---
// (Mantenho a mesma lista que já tinhas, abreviada aqui para não ocupar espaço, mas o código completo tem tudo)
const SERVICE_CATEGORIES = [
  { id: "rapidos", label: "Serviços Rápidos", icon: Wrench, items: ["Revisão", "Travões", "Mudança de Óleo", "Filtros", "Bateria", "Escovas", "Lâmpadas"] },
  { id: "mecanica", label: "Mecânica", icon: Car, items: ["Motor", "Distribuição", "Embraiagem", "Caixa de Velocidades", "Turbo", "Injetores"] },
  { id: "eletrica", label: "Elétrica", icon: Zap, items: ["Diagnóstico", "Alternador", "Motor de Arranque", "Sensores", "Centralina"] },
  { id: "pneus", label: "Pneus", icon: CheckCircle2, items: ["Mudar Pneus", "Alinhamento", "Calibragem", "Furo"] },
  { id: "estetica", label: "Estética", icon: PaintBucket, items: ["Lavagem", "Polimento", "Estofos", "Faróis"] },
  { id: "clima", label: "Climatização", icon: Thermometer, items: ["Carregamento AC", "Fugas AC", "Filtro Habitáculo"] },
  // ... Podes adicionar mais categorias aqui se quiseres
];

interface Props {
  clientId: string;
  vehicles: any[];
}

export function NewServiceSheet({ clientId, vehicles }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estado do Formulário Atualizado
  const [formData, setFormData] = useState({
    vehicleId: vehicles.length === 1 ? vehicles[0].id : "",
    categoria: "",
    descricao: "",
    km: "",
    total: "",
    data: new Date().toISOString().split('T')[0], // Data de hoje
    hora: "09:00", // <--- NOVO: Hora por defeito
    status: "Pendente",
    observacoes: "" // <--- NOVO: Campo de observações
  });

  const handleServiceSelect = (categoria: string, servico: string) => {
    setFormData({ ...formData, categoria, descricao: servico });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: workshop } = await supabase.from('workshops').select('id').limit(1).single();
      if (!workshop) throw new Error("Nenhuma oficina encontrada.");

      // Combinar Data e Hora para o formato Timestamp (YYYY-MM-DDTHH:MM:SS)
      const dataAgendadaFinal = `${formData.data}T${formData.hora}:00`;

      const { error } = await supabase
        .from("services")
        .insert({
          client_id: clientId,
          vehicle_id: formData.vehicleId,
          workshop_id: workshop.id,
          tipo_servico: formData.categoria,
          descricao_cliente: formData.descricao,
          notas_tecnicas: formData.observacoes, // <--- Guardamos aqui as observações
          km_atuais: parseInt(formData.km) || 0,
          valor_total: parseFloat(formData.total) || 0,
          status: formData.status,
          data_agendada: dataAgendadaFinal // <--- Usamos a data com hora
        });

      if (error) throw error;

      setIsOpen(false);
      setStep(1);
      setSearchTerm("");
      router.refresh();
      
    } catch (error: any) {
      console.error(error);
      alert("Erro ao criar serviço: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica de Filtro (Igual ao anterior)
  const filteredCategories = SERVICE_CATEGORIES.map(cat => {
    if (!searchTerm) return cat;
    const filteredItems = cat.items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filteredItems.length > 0 || cat.label.toLowerCase().includes(searchTerm.toLowerCase())) {
      return { ...cat, items: filteredItems.length > 0 ? filteredItems : cat.items };
    }
    return null;
  }).filter(Boolean);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) setStep(1); }}>
      <SheetTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 gap-2">
            <Plus className="h-4 w-4" /> Novo Serviço
        </Button>
      </SheetTrigger>
      
      <SheetContent className="overflow-hidden flex flex-col sm:max-w-xl w-full"> 
        <SheetHeader className="mb-4">
          <SheetTitle>{step === 1 ? "Selecionar Serviço" : "Detalhes do Serviço"}</SheetTitle>
          <SheetDescription>{step === 1 ? "O que vai ser feito na viatura?" : "Defina horas e observações."}</SheetDescription>
        </SheetHeader>
        
        {/* PASSO 1: GRELHA DE SERVIÇOS (IGUAL) */}
        {step === 1 && (
          <div className="flex flex-col h-full overflow-hidden gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border">
                <Label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Viatura</Label>
                <Select value={formData.vehicleId} onValueChange={(v) => setFormData({...formData, vehicleId: v})}>
                    <SelectTrigger className="bg-white"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                    {vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.matricula} - {v.marca}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Pesquisar..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6">
              {(filteredCategories as typeof SERVICE_CATEGORIES).map((cat) => (
                  <div key={cat.id}>
                      <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">
                          <cat.icon className="h-4 w-4 text-red-600" /> {cat.label}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {cat.items.map((item) => (
                              <button key={item} onClick={() => handleServiceSelect(cat.label, item)} disabled={!formData.vehicleId}
                                  className="p-3 text-center bg-white border rounded-xl hover:border-red-500 hover:bg-red-50 transition-all text-xs font-medium text-slate-600">
                                  {item}
                              </button>
                          ))}
                      </div>
                  </div>
              ))}
            </div>
          </div>
        )}

        {/* PASSO 2: FORMULÁRIO COM HORA E OBSERVAÇÕES */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col h-full gap-5 py-2 overflow-y-auto">
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex justify-between items-center shrink-0">
                <div>
                    <span className="text-xs text-blue-600 uppercase font-bold block">Serviço</span>
                    <span className="font-bold text-blue-900">{formData.descricao}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} type="button">Mudar</Button>
            </div>

            <div className="space-y-4">
                {/* Data e Hora */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Data</Label>
                        <Input type="date" required value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Hora</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input type="time" className="pl-9" required value={formData.hora} onChange={e => setFormData({...formData, hora: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Observações (NOVO) */}
                <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Observações / Detalhes
                    </Label>
                    <Textarea 
                        placeholder="Ex: Cliente pede para verificar ruído na roda direita..." 
                        className="h-24 resize-none"
                        value={formData.observacoes}
                        onChange={e => setFormData({...formData, observacoes: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Quilómetros</Label>
                        <Input type="number" required value={formData.km} onChange={e => setFormData({...formData, km: e.target.value})} placeholder="0" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Valor Estimado (€)</Label>
                        <Input type="number" step="0.01" value={formData.total} onChange={e => setFormData({...formData, total: e.target.value})} placeholder="0.00" />
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-4 flex justify-end gap-3 border-t">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 w-full md:w-auto" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Agendar Serviço"}
                </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}