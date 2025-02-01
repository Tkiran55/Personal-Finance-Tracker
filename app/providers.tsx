"use client"

import type React from "react"
import { ThemeProvider } from "next-themes"
import { FinanceProvider } from "../contexts/FinanceContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FinanceProvider>{children}</FinanceProvider>
    </ThemeProvider>
  )
}

