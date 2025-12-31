"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Send, Loader2, Wrench, Calendar, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export function QuoteActions({ quoteId, status, quoteData }: { quoteId: string, status: string, quoteData: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para o Modal de Conversão
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [serviceTitle, setServiceTitle] = useState("Orçamento #" + (quoteData.numero_sequencial || ""));
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState("09:00"); // <--- NOVA HORA POR DEFEITO

  // Função genérica para mudar estado (Enviado/Rejeitado)
  const updateStatus = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from('quotes').update({ status: newStatus }).eq('id', quoteId);
      if (error) throw error;
      router.refresh();
    } catch (error) {
      alert("Erro ao atualizar estado.");
    } finally {
      setIsLoading(false);
    }
  };

  // Converter em Serviço (Com Data e Hora)
  const handleConvert = async () => {
    setIsLoading(true);
    try {
      // 1. Preparar a descrição
      const description = quoteData.items
        .map((i: any) => `${i.quantidade}x ${i.descricao}`)
        .join('\n');

      // 2. Combinar Data e Hora
      const finalDateTime = `${scheduleDate}T${scheduleTime}:00`;

      // 3. Criar o Serviço
      const { error: serviceError } = await supabase
        .from('services')
        .insert({
          client_id: quoteData.client_id,
          vehicle_id: quoteData.vehicle_id,
          workshop_id: quoteData.workshop_id,
          tipo_servico: serviceTitle,
          descricao_cliente: "Baseado em Orçamento Aprovado",
          notas_tecnicas: "Itens do Orçamento:\n" + description,
          valor_total: quoteData.valor_total,
          status: 'Pendente',
          data_agendada: finalDateTime // <--- Usa a data e hora escolhidas
        });

      if (serviceError) throw serviceError;

      // 4. Atualizar Orçamento para Aceite
      await supabase.from('quotes').update({ status: 'Aceite' }).eq('id', quoteId);

      setIsConvertOpen(false);
      router.push(`/dashboard/clientes/${quoteData.client_id}`); 

    } catch (error: any) {
      console.error(error);
      alert("Erro ao converter: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'Aceite') {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md border border-green-200">
        <CheckCircle className="h-5 w-5" />
        <span className="font-bold text-sm">Aprovado e Agendado</span>
      </div>
    );
  }

  return (
    <div className="flex gap-2 print:hidden">
      {status === 'Rascunho' && (
        <Button variant="outline" size="sm" onClick={() => updateStatus('Enviado')} disabled={isLoading} className="border-blue-200 text-blue-700 hover:bg-blue-50">
          <Send className="mr-2 h-4 w-4" /> Marcar Enviado
        </Button>
      )}

      {(status === 'Enviado' || status === 'Rascunho') && (
        <>
            <Button variant="outline" size="sm" onClick={() => updateStatus('Rejeitado')} disabled={isLoading} className="border-red-200 text-red-700 hover:bg-red-50">
                <XCircle className="mr-2 h-4 w-4" /> Rejeitar
            </Button>

            {/* MODAL DE APROVAÇÃO */}
            <Dialog open={isConvertOpen} onOpenChange={setIsConvertOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <Wrench className="mr-2 h-4 w-4" /> Aprovar e Agendar
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Aprovar Orçamento</DialogTitle>
                        <DialogDescription>
                            Isto vai criar um serviço na agenda. Confirma os detalhes abaixo.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Nome do Serviço na Agenda</Label>
                            <Input 
                                value={serviceTitle} 
                                onChange={(e) => setServiceTitle(e.target.value)} 
                                placeholder="Ex: Reparação Motor"
                            />
                        </div>

                        {/* SELETOR DE DATA E HORA LADO A LADO */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Data</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input 
                                        type="date" 
                                        className="pl-9"
                                        value={scheduleDate} 
                                        onChange={(e) => setScheduleDate(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Hora</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input 
                                        type="time" 
                                        className="pl-9"
                                        value={scheduleTime} 
                                        onChange={(e) => setScheduleTime(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConvertOpen(false)}>Cancelar</Button>
                        <Button onClick={handleConvert} className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirmar Agendamento"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
      )}
    </div>
  );
}