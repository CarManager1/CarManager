// Dados e configuração da barbearia. Altera aqui preços, horários e planos.

export const BRAND = {
  name: "Barber Shop Lucas",
  barber: "Lucas Carvalho",
  tagline: "O seu estilo começa aqui!",
  phone: "910 255 557",
  whatsapp: "351910255557",
  instagram: "lucas.carvalho.barber",
  instagramUrl: "https://instagram.com/lucas.carvalho.barber",
  address: "Morada da barbearia, Localidade",
  mapsUrl: "https://maps.google.com/?q=Barber+Shop+Lucas",
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutos
};

export const SERVICES: Service[] = [
  { id: "corte", name: "Corte", description: "Corte clássico ou moderno, acabamento à navalha.", price: 15, duration: 30 },
  { id: "barba", name: "Barba", description: "Desenho, toalha quente e hidratação.", price: 10, duration: 30 },
  { id: "corte-barba", name: "Corte + Barba", description: "O serviço completo para sair na régua.", price: 22, duration: 60 },
  { id: "degrade", name: "Degradê / Fade", description: "Fade detalhado com transições perfeitas.", price: 17, duration: 45 },
  { id: "crianca", name: "Corte Criança", description: "Até aos 12 anos.", price: 12, duration: 30 },
  { id: "sobrancelha", name: "Sobrancelha", description: "Limpeza e desenho à navalha.", price: 5, duration: 15 },
];

export type Plan = {
  id: string;
  name: string;
  price: number; // €/mês
  highlight?: boolean;
  perks: string[];
};

export const PLANS: Plan[] = [
  {
    id: "essencial",
    name: "Essencial",
    price: 60,
    perks: ["Cortes ilimitados", "Prioridade no atendimento", "Descontos em produtos"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 80,
    highlight: true,
    perks: [
      "Cortes ilimitados",
      "Barba ilimitada",
      "Prioridade no atendimento",
      "10% em produtos e serviços extra",
      "Brinde de aniversário",
    ],
  },
  {
    id: "vip",
    name: "VIP",
    price: 100,
    perks: [
      "Corte + barba ilimitados",
      "Sobrancelha incluída",
      "Horário reservado à escolha",
      "15% em produtos",
      "Brinde de aniversário",
      "Promoções só para VIP",
    ],
  },
];

// Horário de funcionamento: 0 = domingo ... 6 = sábado. null = fechado.
export const OPENING_HOURS: Record<number, { open: string; close: string } | null> = {
  0: null,
  1: { open: "10:00", close: "19:00" },
  2: { open: "09:00", close: "20:00" },
  3: { open: "09:00", close: "20:00" },
  4: { open: "09:00", close: "20:00" },
  5: { open: "09:00", close: "20:00" },
  6: { open: "09:00", close: "18:00" },
};

export const SLOT_MINUTES = 15;

export const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const BENEFITS = [
  { title: "Cortes ilimitados", text: "Durante todo o período da sua assinatura." },
  { title: "Prioridade no atendimento", text: "Agende o seu horário com preferência." },
  { title: "Economia todos os meses", text: "Muito mais vantagens por muito menos." },
  { title: "Descontos exclusivos", text: "Em produtos e serviços adicionais." },
  { title: "Benefícios especiais", text: "Promoções e vantagens só para assinantes." },
];

export const FAQS = [
  {
    q: "Como funciona o plano mensal?",
    a: "Escolhe o plano, faz o pedido aqui no site e o Lucas confirma consigo. A renovação é automática todos os meses e pode cancelar quando quiser.",
  },
  {
    q: "Posso desmarcar uma marcação?",
    a: "Sim. Envie mensagem por WhatsApp com pelo menos 2 horas de antecedência.",
  },
  {
    q: "Os assinantes têm de marcar?",
    a: "Sim, mas têm prioridade nos horários. Marque aqui no site ou por WhatsApp.",
  },
];

export const MESSAGE_TEMPLATES = [
  {
    id: "lembrete",
    label: "Lembrete de marcação",
    text: "Olá {nome}! Lembrete da sua marcação na Barber Shop Lucas a {data} às {hora}. Até já! 💈",
  },
  {
    id: "saudades",
    label: "Cliente inativo",
    text: "Olá {nome}, já lá vão uns dias desde o último corte! Que tal voltar a ficar na régua? Marque em {site} 💈",
  },
  {
    id: "promo",
    label: "Promoção",
    text: "Olá {nome}! Esta semana temos uma promoção especial na Barber Shop Lucas. Fale comigo para saber mais! ✂️",
  },
  {
    id: "plano",
    label: "Convite para plano mensal",
    text: "Olá {nome}! Já conhece o Clube Barber Shop Lucas? Cortes ilimitados a partir de 60€/mês. Vagas limitadas! 👑",
  },
  {
    id: "aniversario",
    label: "Aniversário",
    text: "Parabéns {nome}! 🎉 Passe pela Barber Shop Lucas este mês para levantar o seu brinde de aniversário.",
  },
];
