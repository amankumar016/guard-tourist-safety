import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import WaterfallAnimation from "@/components/waterfall-animation"
import TeamFooter from "@/components/team-footer"
import { Suspense } from "react"
import { TranslationProvider } from "@/hooks/use-translation"

export const metadata: Metadata = {
  title: "GUARD - Smart Tourist Safety",
  description: "Your personal safety companion for safe travels",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <TranslationProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <WaterfallAnimation />
            <div className="relative z-10">
              {children}
              <TeamFooter />
            </div>
          </Suspense>
        </TranslationProvider>
        <Analytics />
      </body>
    </html>
  )
}
