import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSettings } from "@/lib/data";

// Display pesado en mayúsculas (como los titulares del mockup). Fallback a
// Impact/Arial Narrow para que se vea condensado aun sin descargar Anton.
const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://groovologycr.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Groovology — Estudio y compañía de baile en Costa Rica",
    template: "%s | Groovology",
  },
  description:
    "Estudio y compañía de bailarines en Cartago, Costa Rica. Clases de hip hop, dancehall, choreo y urban styles para todos los niveles.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
