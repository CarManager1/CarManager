type Props = {
  kicker: string
  title: string
  subtitle?: string
  light?: boolean // texto escuro para secções com fundo claro
}

export default function SectionTitle({ kicker, title, subtitle, light = false }: Props) {
  return (
    <div className="text-center mb-14 max-w-2xl mx-auto">
      <p className="text-gold-500 text-xs font-bold uppercase tracking-[0.25em]">{kicker}</p>
      <h2 className={`font-display text-4xl md:text-5xl font-bold mt-3 ${light ? 'text-sky-950' : 'text-white'}`}>
        {title}
      </h2>
      {subtitle && <p className={`mt-4 leading-relaxed ${light ? 'text-sky-900/70' : 'text-sky-100/70'}`}>{subtitle}</p>}
    </div>
  )
}
