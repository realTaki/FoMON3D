import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ClientOnly } from "@/components/ClientOnly";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoMON3D",
  description: "FOMO Game + Treasury Shares on Monad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-[#0a0a0f] text-slate-200`}
      >
        <ClientOnly>
          <Providers>{children}</Providers>
        </ClientOnly>
      </body>
    </html>
  );
}
