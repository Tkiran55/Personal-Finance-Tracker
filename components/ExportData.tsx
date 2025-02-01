"use client"
import { useFinance } from "../contexts/FinanceContext"

export function ExportData() {
  const { transactions } = useFinance()

  const exportToCSV = () => {
    const csvContent = [
      ["Description", "Amount", "Category", "Date"],
      ...transactions.map((t) => [t.description, t.amount, t.category, t.date]),
    ]
      .map((e) => e.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "transactions.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Export Data</h2>
      <button onClick={exportToCSV} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
        Export to CSV
      </button>
    </div>
  )
}

