"use client"

import { ThemeProvider } from "./theme-provider"

/**
 * Providers Wrapper
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
