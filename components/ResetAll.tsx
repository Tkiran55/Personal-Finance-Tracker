"use client"

import { useState, useCallback } from "react"
import { useFinance } from "../contexts/FinanceContext"

export function ResetAll() {
  const { transactions, categories, addTransaction, addCategory, deleteTransaction, deleteCategory } = useFinance()
  const [isConfirming, setIsConfirming] = useState(false)

  const handleReset = () => {
    setIsConfirming(true)
  }

  const confirmReset = useCallback(() => {
    // Clear all transactions
    transactions.forEach((t) => deleteTransaction(t.id))

    // Reset categories to default
    categories.forEach((c) => deleteCategory(c.name))
    const defaultCategories = [
      { name: "Food", color: "#FF6B6B" },
      { name: "Rent", color: "#4ECDC4" },
      { name: "Transport", color: "#45B7D1" },
      { name: "Entertainment", color: "#FFA07A" },
      { name: "Utilities", color: "#98D8C8" },
      { name: "Income", color: "#66BB6A" },
    ]
    defaultCategories.forEach((c) => addCategory(c))

    // Clear localStorage
    localStorage.removeItem("transactions")
    localStorage.removeItem("categories")

    setIsConfirming(false)
  }, [transactions, categories, deleteTransaction, deleteCategory, addCategory])

  const cancelReset = () => {
    setIsConfirming(false)
  }

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Reset All Data</h2>
      {isConfirming ? (
        <div>
          <p className="mb-4">Are you sure you want to reset all data? This action cannot be undone.</p>
          <div className="flex space-x-2">
            <button
              onClick={confirmReset}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Confirm Reset
            </button>
            <button
              onClick={cancelReset}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Reset All Data
        </button>
      )}
    </div>
  )
}

