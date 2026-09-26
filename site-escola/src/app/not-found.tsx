import Link from 'next/link'

export default function NaoEncontrada() {
  return (
    <section className="py-32 text-center px-4">
      <p className="text-7xl font-black text-sky-600">404</p>
      <h1 className="mt-4 text-3xl font-black">Esta página não existe</h1>
      <p className="mt-2 text-zinc-600">Parece que te enganaste no caminho.</p>
      <Link href="/" className="mt-8 inline-block bg-[#C8F31D] px-7 py-3 rounded-full font-black">Voltar ao início</Link>
    </section>
  )
}
