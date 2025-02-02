import { useState, useMemo } from "react"
import { useFinance, type Transaction } from "../contexts/FinanceContext"

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const { deleteTransaction, editTransaction, categories } = useFinance()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Omit<Transaction, "id">>({
    description: "",
    amount: 0,
    category: "",
    date: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setEditForm(transaction)
  }

  const handleSave = () => {
    if (editingId) {
      editTransaction(editingId, editForm)
      setEditingId(null)
    }
  }

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id)
  }

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteTransaction(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory === "" || t.category === filterCategory),
    )
  }, [transactions, searchTerm, filterCategory])

  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage)
  const currentTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName)
    return category ? category.color : "#000000"
  }

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Transactions</h2>
      </div>
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <ul className="space-y-4">
        {currentTransactions.map((transaction) => (
          <li key={transaction.id} className="border-b pb-2">
            {editingId === transaction.id ? (
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="px-2 py-1 border rounded bg-background text-foreground"
                />
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: Number.parseFloat(e.target.value) })}
                  className="px-2 py-1 border rounded bg-background text-foreground"
                />
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="px-2 py-1 border rounded bg-background text-foreground"
                >
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="px-2 py-1 border rounded bg-background text-foreground"
                />
                <button onClick={handleSave} className="px-2 py-1 bg-primary text-primary-foreground rounded">
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{transaction.description}</span>
                  <span
                    className="text-sm ml-2 px-2 py-1 rounded"
                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                  >
                    {transaction.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${transaction.amount >= 0 ? "text-green-500" : "text-red-500"}`}>
                    Rs. {Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  <button onClick={() => handleEdit(transaction)} className="text-blue-500">
                    Edit
                  </button>
                  {deleteConfirmId === transaction.id ? (
                    <>
                      <button onClick={confirmDelete} className="text-red-500">
                        Confirm
                      </button>
                      <button onClick={cancelDelete} className="text-gray-500">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleDelete(transaction.id)} className="text-red-500">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
          disabled={currentPage === pageCount}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
