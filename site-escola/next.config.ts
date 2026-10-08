import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Permite enviar horários (imagem ou PDF) até 4 MB na página /admin
    serverActions: { bodySizeLimit: '5mb' },
  },
}

export default nextConfig
