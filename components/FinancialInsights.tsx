"use client"
import { useFinance } from "../contexts/FinanceContext"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export function FinancialInsights() {
  const { transactions } = useFinance()

  const categoryTotals = transactions.reduce(
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

  const data = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Financial Insights</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `Rs. ${Number(value).toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

