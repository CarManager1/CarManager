export default function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-gold-400">{eyebrow}</p>
      <h2 className="font-display text-4xl font-bold uppercase leading-tight text-white sm:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-zinc-400">{text}</p>}
    </div>
  );
}
