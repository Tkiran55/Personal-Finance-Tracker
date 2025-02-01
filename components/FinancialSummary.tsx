"use client"
import { useFinance } from "../contexts/FinanceContext"

export function FinancialSummary() {
  const { transactions } = useFinance()

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Financial Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Balance</p>
          <p className={`text-2xl font-bold ${totalBalance >= 0 ? "text-green-500" : "text-red-500"}`}>
            Rs. {totalBalance.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-2xl font-bold text-green-500">Rs. {totalIncome.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-red-500">Rs. {totalExpenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

