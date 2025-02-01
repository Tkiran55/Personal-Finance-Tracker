"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useFinance } from "../contexts/FinanceContext"
import { TransactionList } from "./TransactionList"
import { AddTransactionForm } from "./AddTransactionForm"
import { FinancialSummary } from "./FinancialSummary"
import { FinancialInsights } from "./FinancialInsights"
import { ThemeToggle } from "./ThemeToggle"
import { CategoryManager } from "./CategoryManager"
import { PINLock } from "./PINLock"
import { Expenses } from "./Expenses"
import { CSVExport } from "./CSVExport"
import { ResetAll } from "./ResetAll"
import { AuthForm } from "./AuthForm"
import { PINSetup } from "./PINSetup"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../lib/firebase"

export function Dashboard() {
  const { user, loading, logOut } = useAuth()
  const { transactions } = useFinance()
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [needsPINSetup, setNeedsPINSetup] = useState(false)

  useEffect(() => {
    const checkPINSetup = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (!userDoc.exists() || !userDoc.data()?.pin) {
          setNeedsPINSetup(true)
        }
      }
    }

    checkPINSetup()
  }, [user])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />
  }

  if (needsPINSetup) {
    return <PINSetup onPINSet={() => setNeedsPINSetup(false)} />
  }

  if (!isUnlocked) {
    return <PINLock onUnlock={() => setIsUnlocked(true)} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Personal Finance Tracker</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button onClick={logOut} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Log Out
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <FinancialSummary />
          <AddTransactionForm />
          <CategoryManager />
          <CSVExport />
          <ResetAll />
        </div>
        <div className="space-y-8">
          <Expenses />
          <FinancialInsights />
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  )
}

