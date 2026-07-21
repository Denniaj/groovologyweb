import type { Metadata } from "next";
import { Anton, Questrial } from "next/font/google";
import "./globals.css";

// Sustitutos libres de las fuentes del manual (Extenda / Questral):
// - Anton: display pesado y CONDENSADO en mayúsculas (más estrecho, más impacto)
// - Questrial: sans limpia y geométrica para el cuerpo
const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

const sans = Questrial({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
  fallback: ["Helvetica", "Arial", "sans-serif"],
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white font-sans">
        {children}
      </body>
    </html>
  );
}
