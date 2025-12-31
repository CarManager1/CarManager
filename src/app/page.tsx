'use client'

import Link from 'next/link'
import { 
  ArrowRight, CheckCircle2, BarChart3, Users, 
  Calendar, ShieldCheck, Menu, X, Car
} from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-blue-100">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Car size={24} strokeWidth={3} />
            </div>
            <span className="text-xl font-black tracking-tighter">CarManager</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-500">
            <a href="#funcionalidades" className="hover:text-blue-600 transition-colors">Funcionalidades</a>
            <a href="#precos" className="hover:text-blue-600 transition-colors">Preços</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">Dúvidas</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-bold text-zinc-600 hover:text-zinc-900">
              Entrar
            </Link>
            <Link href="/dashboard" className="bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">
              Começar Agora <ArrowRight size={16}/>
            </Link>
          </div>

          {/* Mobile Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-zinc-600">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-zinc-100 p-6 space-y-4 shadow-xl animate-in slide-in-from-top-5">
            <a href="#funcionalidades" className="block font-bold text-zinc-600" onClick={() => setIsMenuOpen(false)}>Funcionalidades</a>
            <a href="#precos" className="block font-bold text-zinc-600" onClick={() => setIsMenuOpen(false)}>Preços</a>
            <Link href="/dashboard" className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold">
              Entrar no Sistema
            </Link>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            A Nova Geração de CRM Automóvel
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 max-w-4xl mx-auto leading-[1.1]">
            A sua Oficina, gerida <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">no Piloto Automático.</span>
          </h1>
          
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Abandone o papel e as folhas de Excel. O CarManager centraliza clientes, orçamentos, faturas e agendamentos numa única plataforma intuitiva.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 flex items-center justify-center gap-2">
              Testar Gratuitamente <ArrowRight size={20}/>
            </Link>
            <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-700 border-2 border-zinc-100 rounded-2xl font-bold text-lg hover:border-zinc-300 transition-all">
              Ver Demo
            </a>
          </div>

          {/* DASHBOARD PREVIEW MOCKUP */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-20 rounded-full"></div>
            <div className="relative bg-zinc-900 p-2 rounded-[32px] shadow-2xl border border-zinc-800">
              <div className="bg-zinc-950 rounded-[24px] overflow-hidden aspect-video relative flex items-center justify-center border border-white/5">
                {/* Aqui poderemos colocar uma imagem real depois */}
                <div className="text-center space-y-4">
                    <p className="text-zinc-500 font-medium">Imagem do Dashboard Aqui</p>
                    <div className="flex gap-2 justify-center opacity-50">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FUNCIONALIDADES (GRID) --- */}
      <section id="funcionalidades" className="py-24 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Tudo o que precisa para acelerar.</h2>
            <p className="text-zinc-500 text-lg">Desenhado especificamente para mecânicos e gestores de oficinas que valorizam o seu tempo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart3 size={32} className="text-blue-600"/>}
              title="Faturação Simples"
              desc="Crie orçamentos e faturas em segundos. Transforme orçamentos em faturas com um clique e envie por email."
            />
            <FeatureCard 
              icon={<Calendar size={32} className="text-purple-600"/>}
              title="Agenda Inteligente"
              desc="Visualize a sua semana, arraste marcações e nunca mais perca um serviço por esquecimento."
            />
            <FeatureCard 
              icon={<Users size={32} className="text-green-600"/>}
              title="CRM de Clientes"
              desc="Histórico completo por matrícula. Saiba exatamente o que foi feito em cada carro e quando."
            />
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF / NUMBERS --- */}
      <section className="py-20 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat number="100%" label="Focado em Oficinas" />
          <Stat number="+2.5k" label="Faturas Geradas" />
          <Stat number="24/7" label="Acesso Cloud" />
          <Stat number="0" label="Instalação Necessária" />
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-zinc-900 rounded-[48px] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-[100px] opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 blur-[100px] opacity-30"></div>
            
            <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight">Pronto para modernizar a sua oficina?</h2>
                <p className="text-zinc-400 text-xl max-w-2xl mx-auto">Junte-se a oficinas que já poupam horas de trabalho administrativo todas as semanas.</p>
                <div className="pt-4">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-zinc-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-zinc-100 transition-all">
                        Criar Conta Gratuita <ArrowRight className="text-blue-600"/>
                    </Link>
                </div>
                <p className="text-xs text-zinc-500 font-medium pt-4">Não requer cartão de crédito para testar.</p>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-zinc-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
                <div className="bg-zinc-900 p-2 rounded-lg text-white">
                 <Car size={20} />
                </div>
                <span className="font-bold text-lg">CarManager</span>
            </div>
            <p className="text-zinc-400 text-sm font-medium">© 2024 CarManager Portugal. Todos os direitos reservados.</p>
            <div className="flex gap-6 text-sm font-bold text-zinc-500">
                <a href="#" className="hover:text-zinc-900">Termos</a>
                <a href="#" className="hover:text-zinc-900">Privacidade</a>
                <a href="#" className="hover:text-zinc-900">Suporte</a>
            </div>
        </div>
      </footer>
    </div>
  )
}

// Componentes Auxiliares
function FeatureCard({icon, title, desc}: {icon: any, title: string, desc: string}) {
    return (
        <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="bg-zinc-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-black text-zinc-900 mb-3">{title}</h3>
            <p className="text-zinc-500 leading-relaxed font-medium">{desc}</p>
        </div>
    )
}

function Stat({number, label}: {number: string, label: string}) {
    return (
        <div>
            <h4 className="text-4xl md:text-5xl font-black text-zinc-900 mb-2">{number}</h4>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">{label}</p>
        </div>
    )
}