import "./globals.css"
import type { Metadata } from "next"
import { Quicksand, Rubik } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/providers/theme-provider"
import { UserProvider } from "@/contexts/UserContext"
import MainMenu from "@/components/ui/main-menu"
import { Toaster } from "@/components/ui/sonner"

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

export const metadata: Metadata = {
  title: 'SISV',
  description: 'Sistema de Informação de Vendas',
  creator: '4easy Tecnologia'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-main antialiased",
          `${mainFontFamily.variable} ${submainFontFamily.variable}`
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <UserProvider>
            <MainMenu />
            {children}
          </UserProvider>
        </ThemeProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
