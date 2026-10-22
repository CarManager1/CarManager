'use server'

import { createClient } from '@supabase/supabase-js'
import {
  SERVICOS, BARBEIROS, HORARIO, DIAS_ANTECEDENCIA,
  paraMinutos, type Ocupado,
} from '@/lib/barbearia-data'

const supabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  })

export async function obterOcupados(data: string): Promise<{ ocupados?: Ocupado[]; error?: string }> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return { error: 'Data inválida' }
  const { data: rows, error } = await supabase().rpc('barbearia_ocupados', { p_data: data })
  if (error) return { error: 'Não foi possível carregar os horários.' }
  return { ocupados: (rows ?? []) as Ocupado[] }
}

type NovaMarcacao = {
  data: string
  hora: string
  servicoId: string
  barbeiroId: string
  nome: string
  telefone: string
  email?: string
  notas?: string
}

export async function criarMarcacao(m: NovaMarcacao): Promise<{ id?: number; error?: string }> {
  // Validação no servidor: preço e duração vêm sempre da tabela de serviços
  const servico = SERVICOS.find(s => s.id === m.servicoId)
  const barbeiro = BARBEIROS.find(b => b.id === m.barbeiroId)
  if (!servico || !barbeiro) return { error: 'Serviço ou barbeiro inválido.' }

  const [ano, mes, dia] = m.data.split('-').map(Number)
  const d = new Date(ano, mes - 1, dia)
  const horario = HORARIO[d.getDay()]
  if (!horario || !/^\d{2}:\d{2}$/.test(m.hora)) return { error: 'A barbearia está fechada nesse dia.' }

  const inicio = paraMinutos(m.hora)
  if (inicio < paraMinutos(horario.abre) || inicio + servico.duracao > paraMinutos(horario.fecha)) {
    return { error: 'Horário fora do período de funcionamento.' }
  }

  const limite = new Date()
  limite.setDate(limite.getDate() + DIAS_ANTECEDENCIA)
  if (d > limite) return { error: `Só é possível marcar com até ${DIAS_ANTECEDENCIA} dias de antecedência.` }

  if (m.nome.trim().length < 2) return { error: 'Indique o seu nome.' }
  if (m.telefone.replace(/\D/g, '').length < 9) return { error: 'Indique um telefone válido.' }

  const { data: id, error } = await supabase().rpc('barbearia_marcar', {
    p_data: m.data,
    p_hora: m.hora,
    p_duracao_min: servico.duracao,
    p_barbeiro_id: barbeiro.id,
    p_servico_id: servico.id,
    p_servico_nome: servico.nome,
    p_preco: servico.preco,
    p_cliente_nome: m.nome.slice(0, 100),
    p_cliente_telefone: m.telefone.slice(0, 30),
    p_cliente_email: m.email?.slice(0, 120) ?? null,
    p_notas: m.notas?.slice(0, 500) ?? null,
  })

  if (error) {
    if (error.message.includes('HORARIO_OCUPADO')) {
      return { error: 'Este horário acabou de ser ocupado. Escolha outro, por favor.' }
    }
    return { error: 'Não foi possível concluir a marcação. Tente novamente.' }
  }
  return { id: id as number }
}
