"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "./AuthContext"

export type Transaction = {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

type Category = {
  name: string
  color: string
}

type FinanceContextType = {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>
  editTransaction: (id: string, transaction: Omit<Transaction, "id">) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  categories: Category[]
  addCategory: (category: Category) => Promise<void>
  deleteCategory: (categoryName: string) => Promise<void>
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

const defaultCategories: Category[] = [
  { name: "Food", color: "#FF6B6B" },
  { name: "Rent", color: "#4ECDC4" },
  { name: "Transport", color: "#45B7D1" },
  { name: "Entertainment", color: "#FFA07A" },
  { name: "Utilities", color: "#98D8C8" },
  { name: "Income", color: "#66BB6A" },
]

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchTransactions()
      fetchCategories()
    } else {
      setTransactions([])
      setCategories(defaultCategories)
    }
  }, [user])

  const fetchTransactions = async () => {
    if (!user) return
    const q = query(collection(db, "transactions"), where("userId", "==", user.uid))
    const querySnapshot = await getDocs(q)
    const fetchedTransactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      fetchedTransactions.push({ id: doc.id, ...doc.data() } as Transaction)
    })
    setTransactions(fetchedTransactions)
  }

  const fetchCategories = async () => {
    if (!user) return
    const q = query(collection(db, "categories"), where("userId", "==", user.uid))
    const querySnapshot = await getDocs(q)
    const fetchedCategories: Category[] = []
    querySnapshot.forEach((doc) => {
      fetchedCategories.push(doc.data() as Category)
    })
    setCategories(fetchedCategories.length > 0 ? fetchedCategories : defaultCategories)
  }

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user) throw new Error("User not authenticated")
    const docRef = await addDoc(collection(db, "transactions"), {
      ...transaction,
      userId: user.uid,
    })
    setTransactions([...transactions, { id: docRef.id, ...transaction }])
  }

  const editTransaction = async (id: string, updatedTransaction: Omit<Transaction, "id">) => {
    if (!user) throw new Error("User not authenticated")
    await updateDoc(doc(db, "transactions", id), updatedTransaction)
    setTransactions(transactions.map((t) => (t.id === id ? { ...updatedTransaction, id } : t)))
  }

  const deleteTransaction = async (id: string) => {
    if (!user) throw new Error("User not authenticated")
    await deleteDoc(doc(db, "transactions", id))
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const addCategory = async (category: Category) => {
    if (!user) throw new Error("User not authenticated")
    await addDoc(collection(db, "categories"), {
      ...category,
      userId: user.uid,
    })
    setCategories([...categories, category])
  }

  const deleteCategory = async (categoryName: string) => {
    if (!user) throw new Error("User not authenticated")
    const q = query(collection(db, "categories"), where("userId", "==", user.uid), where("name", "==", categoryName))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    })
    setCategories(categories.filter((c) => c.name !== categoryName))
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        categories,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}

