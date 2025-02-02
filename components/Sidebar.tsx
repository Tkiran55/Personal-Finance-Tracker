"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, DollarSign, PieChart, Settings, LogOut } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { ThemeToggle } from "./ThemeToggle"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const links = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Transactions", href: "/transactions", icon: DollarSign },
    { name: "Budget", href: "/budget", icon: PieChart },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="flex flex-col h-screen p-3 bg-white dark:bg-gray-800 shadow w-60">
      <div className="space-y-3">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">Finance Tracker</h2>
        </div>
        <div className="flex-1">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            {links.map((link) => (
              <li key={link.name} className="rounded-sm">
                <Link
                  href={link.href}
                  className={`flex items-center p-2 space-x-3 rounded-md ${
                    pathname === link.href ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <link.icon className="w-6 h-6" />
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-auto">
        <ThemeToggle />
        {user && (
          <button
            onClick={() => signOut(auth)}
            className="flex items-center p-2 space-x-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </div>
  )
}

