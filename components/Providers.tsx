"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "./theme-provider"

/**
 * Providers Wrapper
 * Includes NextAuth SessionProvider and any other global providers.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
