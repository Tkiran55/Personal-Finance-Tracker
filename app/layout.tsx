import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { AuthProvider } from "../contexts/AuthContext"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Personal Finance Tracker",
  description: "Manage your income, expenses, and savings efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  )
}

