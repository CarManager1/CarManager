import { Wrench, Zap, Car, Settings, Disc, Battery, Thermometer, Truck, Droplet, Paintbrush } from "lucide-react";

export const SERVICE_CATEGORIES = [
  {
    id: "rapidos",
    title: "Serviços Rápidos",
    icon: Wrench,
    items: [
      "Revisão Completa", "Mudança de Óleo", "Substituição Filtros", "Travões (Pastilhas/Discos)", 
      "Escovas Limpa Para-brisas", "Lâmpadas", "Bateria (Substituição Simples)", 
      "Verificação de Níveis", "Substituição de Matrícula"
    ]
  },
  {
    id: "mecanica",
    title: "Mecânica Avançada",
    icon: Settings,
    items: [
      "Distribuição (Kit Correia/Corrente)", "Embraiagem e Volante Bi-massa", "Junta da Cabeça", 
      "Reparação de Motor", "Turbo (Reparação/Substituição)", "Injetores", 
      "Caixa de Velocidades", "Bomba de Água", "Termostato", "Radiador", 
      "Amortecedores e Suspensão", "Transmissão e Foles", "Rolamentos", "Fugas de Óleo/Água",
      "Válvula EGR", "Filtro de Partículas (FAP/DPF)"
    ]
  },
  {
    id: "eletrica",
    title: "Serviços Elétricos",
    icon: Zap,
    items: [
      "Diagnóstico Computorizado", "Motor de Arranque", "Alternador", 
      "Sensores (ABS, ESP, Motor)", "Elevadores de Vidros", "Fecho Central", 
      "Reparação de Cablagem", "Quadrante/Painel Instrumentos", "Programação de Chaves",
      "Centralinas (ECU)", "Sistemas ADAS"
    ]
  },
  {
    id: "climatizacao",
    title: "Climatização A/C",
    icon: Thermometer,
    items: [
      "Carregamento A/C", "Teste de Fugas A/C", "Desinfeção de Condutas", 
      "Compressor A/C", "Radiador A/C (Condensador)"
    ]
  },
  {
    id: "pneus",
    title: "Pneus e Jantes",
    icon: Disc,
    items: [
      "Montagem/Calibragem Pneus", "Alinhamento de Direção", "Reparação de Furos", 
      "Venda de Pneus", "Reparação de Jantes", "Pintura de Jantes"
    ]
  },
  {
    id: "estetica",
    title: "Estética e Carroçaria",
    icon: Paintbrush,
    items: [
      "Lavagem Completa", "Polimento e Enceramento", "Polimento de Faróis", 
      "Limpeza de Estofos", "Pintura de Painéis", "Reparação de Amolgadelas", 
      "Bate-Chapas", "Películas de Vidros"
    ]
  },
  {
    id: "hibridos",
    title: "Híbridos e Elétricos",
    icon: Battery,
    items: [
      "Diagnóstico EV/Híbrido", "Baterias de Alta Tensão", "Carregadores (OBC)", 
      "Sistema de Refrigeração Baterias", "Motores Elétricos"
    ]
  },
  {
    id: "outros",
    title: "Serviços Especiais",
    icon: Truck,
    items: [
      "Serviço de Reboque", "Inspeção Pré-IPO", "Transporte Pick-up & Delivery", 
      "Adaptação Deficientes", "GPL (Manutenção)", "Restauro Clássicos"
    ]
  }
];