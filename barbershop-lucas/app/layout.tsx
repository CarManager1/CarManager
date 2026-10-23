import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "Barber Shop Lucas | O seu estilo começa aqui",
  description: "Marque o seu corte online e conheça os planos mensais com cortes ilimitados da Barber Shop Lucas.",
  icons: { icon: "/media/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${inter.variable} ${oswald.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
