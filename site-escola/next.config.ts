import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // A raiz do projeto é sempre esta pasta (evita erros do Turbopack quando
  // existem outros package-lock.json em pastas acima, por exemplo na pasta pessoal)
  turbopack: {
    root: path.resolve(__dirname),
  },
}

export default nextConfig
