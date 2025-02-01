"use client"

import { useMemo } from "react"
import { useFinance } from "../contexts/FinanceContext"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function Expenses() {
  const { transactions, categories } = useFinance()

  const { expenseData, totalExpenses } = useMemo(() => {
    const expensesByCategory = transactions
      .filter((t) => t.amount < 0)
      .reduce(
        (acc, transaction) => {
          const { category, amount } = transaction
          if (!acc[category]) {
            acc[category] = 0
          }
          acc[category] += Math.abs(amount)
          return acc
        },
        {} as { [key: string]: number },
      )

    const expenseData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }))
    const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0)

    return { expenseData, totalExpenses }
  }, [transactions])

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
      <div className="mb-4">
        <p className="text-lg font-semibold">Total Expenses: Rs. {totalExpenses.toFixed(2)}</p>
      </div>
      {expenseData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={categories.find((c) => c.name === entry.name)?.color || "#000000"}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `Rs. ${Number(value).toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Expense Breakdown</h3>
            <ul className="space-y-2">
              {expenseData.map((item) => (
                <li key={item.name} className="flex justify-between items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: categories.find((c) => c.name === item.name)?.color }}
                  ></span>
                  <span>{item.name}</span>
                  <span>
                    Rs. {item.value.toFixed(2)} ({((item.value / totalExpenses) * 100).toFixed(2)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>No expenses recorded yet.</p>
      )}
    </div>
  )
}

