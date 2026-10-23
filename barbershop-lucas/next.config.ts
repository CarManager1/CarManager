import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O repositório tem outro projeto na raiz; fixa a raiz neste diretório.
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
