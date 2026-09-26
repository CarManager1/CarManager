import { Car, Bike, Truck, Smartphone } from 'lucide-react'

export const ICONES = { ligeiros: Car, motociclos: Bike, profissionais: Truck, tvde: Smartphone } as const

export function iconeDe(id: string) {
  return ICONES[id as keyof typeof ICONES] ?? Car
}
