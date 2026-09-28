import { ESCOLA } from '@/lib/dados'

export function linkWhatsApp(texto: string) {
  return `https://wa.me/${ESCOLA.whatsapp}?text=${encodeURIComponent(texto)}`
}
