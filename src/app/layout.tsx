import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "osmi — momentos inolvidables",
  description:
    "La experiencia de boletos más inteligente del planeta. Compra segura, entrega inmediata, soporte 24/7. Vive lo inolvidable con osmi.",
  keywords: [
    "boletos", "conciertos", "eventos", "tickets", "osmi",
    "deportes", "teatro", "festivales", "experiencias",
    "Desfragmentado", "Desfragmentado el MC Legendario",
    "Francisco D Zamora", "ticketing digital", "boletera inteligente",
  ],
  authors: [{ name: "Francisco D Zamora", url: "https://osmi.app" }],
  creator: "Francisco D Zamora",
  publisher: "osmi by Francisco D Zamora",
  metadataBase: new URL("https://osmi.app"),
  openGraph: {
    title: "osmi — Vive lo inolvidable",
    description:
      "La nueva generación de ticketing digital. Seguro, rápido y con la mejor experiencia. Por Francisco D Zamora.",
    type: "website",
    locale: "es_MX",
    siteName: "osmi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "osmi — momentos inolvidables",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "osmi — Vive lo inolvidable",
    description:
      "Ticketing digital de clase mundial. Por Francisco D Zamora.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
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