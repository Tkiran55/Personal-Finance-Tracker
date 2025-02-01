"use client"

import type React from "react"
import { useState } from "react"
import { useFinance } from "../contexts/FinanceContext"

export function CategoryManager() {
  const { categories, addCategory, deleteCategory } = useFinance()
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#000000")
  const [error, setError] = useState<string | null>(null)

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (newCategoryName && newCategoryColor) {
      if (categories.some((cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
        setError("A category with this name already exists.")
        return
      }
      try {
        addCategory({ name: newCategoryName, color: newCategoryColor })
        setNewCategoryName("")
        setNewCategoryColor("#000000")
      } catch (err) {
        setError("Failed to add category. Please try again.")
      }
    } else {
      setError("Please provide both a name and a color for the new category.")
    }
  }

  const handleDeleteCategory = (categoryName: string) => {
    setError(null)
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      try {
        deleteCategory(categoryName)
      } catch (err) {
        setError(`Failed to delete category: ${categoryName}`)
      }
    }
  }

  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>
      <form onSubmit={handleAddCategory} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-grow px-3 py-2 border rounded-md bg-background text-foreground"
          />
          <input
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
            className="w-12 h-10 border rounded-md"
          />
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Add
          </button>
        </div>
      </form>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.name} className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
              <span>{category.name}</span>
            </div>
            <button onClick={() => handleDeleteCategory(category.name)} className="text-red-500 hover:text-red-700">
              Delete
            </button>
          </li>
        ))}
      </ul>
      {error && <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
    </div>
  )
}

