import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "osmi - momentos inolvidables",
  description: "Vive lo inolvidable con la experiencia de boletos más inteligente del planeta.",
  keywords: ["boletos", "conciertos", "eventos", "tickets", "smi", "deportes", "teatro", "desfragmentado", "desfragmentado el mc legendario", "francisco d zamora"],
  openGraph: {
    title: "osmi - Vive lo inolvidable",
    description: "La nueva generación de ticketing digital. Seguro, rápido y con la mejor experiencia.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} antialiased`}>
        <main className="min-h-screen relative flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}