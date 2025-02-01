"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useFinance } from "../contexts/FinanceContext"

type ExportFilter = {
  startDate: string
  endDate: string
  category: string
}

export function CSVExport() {
  const { transactions, categories } = useFinance()
  const [filter, setFilter] = useState<ExportFilter>({
    startDate: "",
    endDate: "",
    category: "",
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilter((prev) => ({ ...prev, [name]: value }))
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const dateInRange =
        (!filter.startDate || t.date >= filter.startDate) && (!filter.endDate || t.date <= filter.endDate)
      const categoryMatch = !filter.category || t.category === filter.category
      return dateInRange && categoryMatch
    })
  }, [transactions, filter])

  const { csvData, totalIncome, totalExpenses, balance } = useMemo(() => {
    let runningBalance = 0
    const csvData = filteredTransactions.map((t) => {
      runningBalance += t.amount
      return [t.date, t.amount >= 0 ? "Income" : "Expense", t.category, t.amount.toFixed(2), runningBalance.toFixed(2)]
    })

    const totalIncome = filteredTransactions.filter((t) => t.amount >= 0).reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = filteredTransactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return { csvData, totalIncome, totalExpenses, balance: runningBalance }
  }, [filteredTransactions])

  const generateCSV = () => {
    const headers = ["Date", "Type", "Category", "Amount", "Balance"]
    const summaryRow = ["", "Summary", "", "", ""]
    const totalIncomeRow = ["", "Total Income", "", totalIncome.toFixed(2), ""]
    const totalExpensesRow = ["", "Total Expenses", "", (-totalExpenses).toFixed(2), ""]
    const finalBalanceRow = ["", "Final Balance", "", balance.toFixed(2), ""]

    const csvContent = [headers, ...csvData, summaryRow, totalIncomeRow, totalExpensesRow, finalBalanceRow]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `finance_report_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Export Transactions</h2>
      <div className="space-y-4 mb-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-muted-foreground">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filter.startDate}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-muted-foreground">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filter.endDate}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-muted-foreground">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={generateCSV}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Download CSV
      </button>
    </div>
  )
}

