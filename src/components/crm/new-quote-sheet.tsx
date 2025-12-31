"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export function NewQuoteSheet({ clientId, vehicles }: { clientId: string, vehicles: any[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cabeçalho
  const [vehicleId, setVehicleId] = useState(vehicles.length === 1 ? vehicles[0].id : "");
  const [validade, setValidade] = useState("");
  
  // Linhas do Orçamento
  const [items, setItems] = useState([
    { descricao: "Mão de Obra", qtd: 1, preco: 35.00 },
    { descricao: "", qtd: 1, preco: 0 }
  ]);

  // Cálculos
  const total = items.reduce((acc, item) => acc + (item.qtd * item.preco), 0);

  // Adicionar nova linha vazia
  const addItem = () => setItems([...items, { descricao: "", qtd: 1, preco: 0 }]);

  // Remover linha
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Atualizar linha
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    // @ts-ignore
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSave = async () => {
    if (!vehicleId) return alert("Selecione um veículo");
    setIsLoading(true);

    try {
      const { data: workshop } = await supabase.from('workshops').select('id').limit(1).single();
      
      // 1. Criar Cabeçalho
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          client_id: clientId,
          vehicle_id: vehicleId,
          workshop_id: workshop?.id,
          valor_total: total,
          validade: validade || null,
          status: 'Rascunho'
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // 2. Criar Itens
      const itemsToInsert = items
        .filter(i => i.descricao.trim() !== "") // Ignora linhas vazias
        .map(i => ({
          quote_id: quote.id,
          descricao: i.descricao,
          quantidade: i.qtd,
          preco_unitario: i.preco
        }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase.from('quote_items').insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      setIsOpen(false);
      router.refresh(); // Atualiza a página
      // Opcional: Redirecionar para a página do orçamento
      // router.push(/dashboard/orcamentos/${quote.id});

    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 border-slate-300">
          <FileText className="h-4 w-4" /> Criar Orçamento
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xl overflow-y-auto w-full">
        <SheetHeader className="mb-6">
          <SheetTitle>Novo Orçamento</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          
          {/* Seleção de Veículo e Data */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Viatura</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolher..." />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.matricula} - {v.marca}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Validade (Opcional)</Label>
              <Input type="date" value={validade} onChange={e => setValidade(e.target.value)} />
            </div>
          </div>

          <Separator />

          {/* Lista de Itens */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Descrição dos Serviços e Peças</Label>
              <span className="text-xs text-slate-500">Total atual: {total.toFixed(2)}€</span>
            </div>

            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input 
                    placeholder="Descrição (ex: Filtro de Óleo)" 
                    value={item.descricao}
                    onChange={(e) => updateItem(idx, 'descricao', e.target.value)}
                  />
                </div>
                <div className="w-20">
                  <Input 
                    type="number" 
                    placeholder="Qtd" 
                    value={item.qtd}
                    onChange={(e) => updateItem(idx, 'qtd', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="w-24 relative">
                  <span className="absolute left-2 top-2.5 text-xs text-slate-400">€</span>
                  <Input 
                    type="number" 
                    className="pl-5"
                    placeholder="Preço" 
                    value={item.preco}
                    onChange={(e) => updateItem(idx, 'preco', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button variant="ghost" onClick={addItem} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-full border border-dashed border-blue-200">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Linha
            </Button>
          </div>

          {/* Rodapé Total */}
          <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border">
            <span className="font-semibold text-slate-600">Total Estimado</span>
            <span className="text-2xl font-bold text-slate-900">{total.toFixed(2)}€</span>
          </div>

          <Button className="w-full bg-slate-900 hover:bg-slate-800" onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Guardar Orçamento"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}