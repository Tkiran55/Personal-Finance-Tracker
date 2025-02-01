"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../lib/firebase"

type PINLockProps = {
  onUnlock: () => void
}

export function PINLock({ onUnlock }: PINLockProps) {
  const [enteredPin, setEnteredPin] = useState("")
  const [isResetting, setIsResetting] = useState(false)
  const { user } = useAuth()

  const handleUnlock = async () => {
    if (!user) return

    const userDoc = await getDoc(doc(db, "users", user.uid))
    const storedPin = userDoc.data()?.pin

    if (enteredPin === storedPin) {
      onUnlock()
    } else {
      alert("Incorrect PIN")
      setEnteredPin("")
    }
  }

  const handleResetPin = async () => {
    if (!user || !user.email) return

    try {
      setIsResetting(true)
      await sendPasswordResetEmail(auth, user.email)
      alert("A PIN reset email has been sent to your email address.")
    } catch (error) {
      console.error("Error sending reset email:", error)
      alert("Failed to send reset email. Please try again.")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4">Enter PIN</h2>
        <input
          type="password"
          maxLength={4}
          value={enteredPin}
          onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ""))}
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground mb-4"
          placeholder="Enter 4-digit PIN"
        />
        <button onClick={handleUnlock} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md mb-2">
          Unlock
        </button>
        <button
          onClick={handleResetPin}
          disabled={isResetting}
          className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
        >
          {isResetting ? "Sending Reset Email..." : "Reset PIN"}
        </button>
      </div>
    </div>
  )
}

