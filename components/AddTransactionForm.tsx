"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useFinance } from "../contexts/FinanceContext"

export function AddTransactionForm() {
  const { addTransaction, categories } = useFinance()
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState("")

  const handleSubmit = (e: React.FormEvent, isExpense: boolean) => {
    e.preventDefault()
    if (!description || !amount || !category || !date) {
      alert("Please fill in all fields")
      return
    }
    const transactionAmount = isExpense ? -Math.abs(Number.parseFloat(amount)) : Math.abs(Number.parseFloat(amount))
    addTransaction({
      description,
      amount: transactionAmount,
      category,
      date,
    })
    setDescription("")
    setAmount("")
    setCategory("")
    setDate("")
  }

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => (
      <option key={cat.name} value={cat.name} style={{ color: cat.color }}>
        {cat.name}
      </option>
    ))
  }, [categories])

  return (
    <form className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add Transaction</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground">
            Amount (Rs.)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-muted-foreground">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background focus:border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
          >
            <option value="">Select a category</option>
            {categoryOptions}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-muted-foreground">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
          />
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          type="submit"
          onClick={(e) => handleSubmit(e, false)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Add Income
        </button>
        <button
          type="submit"
          onClick={(e) => handleSubmit(e, true)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Add Expense
        </button>
      </div>
    </form>
  )
}

