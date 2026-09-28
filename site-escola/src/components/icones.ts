import { Car, Bike, Gauge } from 'lucide-react'

export const ICONES = { ligeiros: Car, motociclos: Bike, treino: Gauge } as const

export function iconeDe(id: string) {
  return ICONES[id as keyof typeof ICONES] ?? Car
}
