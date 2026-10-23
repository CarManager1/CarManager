# Barber Shop Lucas — Site + CRM

Site com marcação online, planos mensais e área de gestão (agenda, clientes, planos e mensagens).

Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + lucide-react**, com **Supabase** como base de dados.

## Rotas

| Rota | O que é |
| --- | --- |
| `/` | Landing page: marcação logo no topo, serviços, 3 planos, sobre, FAQ, contactos |
| `/login` | Entrada do Lucas (só com Supabase ligado) |
| `/admin` | Painel: hoje, assinantes, pedidos de plano, clientes a recuperar |
| `/admin/agenda` | Agenda por dia/semana, nova marcação, concluir / faltou / cancelar, lembrete WhatsApp |
| `/admin/clientes` | Lista com pesquisa e filtros, ficha do cliente com histórico |
| `/admin/planos` | Assinantes por plano, receita mensal, ativar/cancelar pedidos |
| `/admin/mensagens` | Escolher grupo de clientes + mensagem com `{nome}`, `{data}`, `{hora}`… e enviar por WhatsApp/SMS |

## Estrutura

```
app/            páginas (rotas)
components/site   blocos da landing (Navbar, BookingWidget, PlanCards…)
components/admin  blocos do CRM (AdminData, AppointmentModal, ui)
lib/siteData.ts   ⭐ preços, serviços, planos, horário, templates de mensagens
lib/store.ts      acesso aos dados (Supabase ou modo demo)
lib/crm.ts        cálculos: última visita, segmentos, etc.
supabase/schema.sql  tabelas + funções da base de dados
public/media/     logo e fotos
```

Para mudar preços, planos ou horários edita só `lib/siteData.ts`.

## Correr localmente

```bash
cd barbershop-lucas
npm install
npm run dev
```

Sem variáveis de ambiente corre em **modo demo**: os dados ficam no `localStorage` do browser e vêm clientes de exemplo. Serve para ver tudo a funcionar, mas as marcações feitas no telemóvel de um cliente **não** chegam ao Lucas — para isso é preciso o Supabase.

## Ligar o Supabase (dados reais)

1. Cria um projeto em supabase.com.
2. No **SQL Editor** cola e corre `supabase/schema.sql`.
3. Em **Authentication → Users → Add user** cria o utilizador do Lucas (email + palavra-passe). Desativa os registos públicos em Authentication → Sign In / Providers.
4. Copia `.env.example` para `.env.local` e preenche `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API).

O site público só usa funções seguras (`get_busy_slots`, `book_appointment`, `request_subscription`) — não consegue ler dados dos clientes.

## Deploy na Vercel

Este projeto está na pasta `barbershop-lucas/` do repositório. Na Vercel, cria um projeto novo com **Root Directory = `barbershop-lucas`** e adiciona as duas variáveis do Supabase. Depois:

```bash
cd barbershop-lucas
npx vercel --prod
```

## Próximos passos possíveis

- Pagamento automático dos planos (Stripe / MB Way via Stripe ou Easypay).
- Envio automático de mensagens (WhatsApp Business API ou Twilio) — hoje o envio abre o WhatsApp com a mensagem já escrita, cliente a cliente.
- Lembretes automáticos na véspera (Vercel Cron + API acima).
- Vários barbeiros / cadeiras na agenda.
