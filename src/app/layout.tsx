"use client"

import "./globals.css";

import type { Metadata } from "next";
import { Quicksand, Rubik } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";

const mainFontFamily = Quicksand({
  variable: "--font-family-main",
  preload: true,
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
});
const submainFontFamily = Rubik({
  variable: "--font-family-submain",
  preload: true,
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
});

// export const metadata: Metadata = {
//   title: "SISV",
//   description: "Sistema de Informação de Vendas",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <meta title="SISV" aria-description="Sistema de Informação de Vendas" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-main antialiased",
          `${mainFontFamily.variable} ${submainFontFamily.variable}`
      )}>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </UserProvider>
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
