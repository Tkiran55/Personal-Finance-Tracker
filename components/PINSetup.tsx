"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../lib/firebase"

type PINSetupProps = {
  onPINSet: () => void
}

export const PINSetup: React.FC<PINSetupProps> = ({ onPINSet }) => {
  const [pin, setPin] = useState("")
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.length !== 4) {
      alert("PIN must be 4 digits")
      return
    }
    try {
      if (user) {
        await setDoc(
          doc(db, "users", user.uid),
          {
            pin: pin,
          },
          { merge: true },
        )
        onPINSet()
      }
    } catch (error) {
      console.error("Error setting PIN:", error)
      alert("Failed to set PIN. Please try again.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Set Up PIN</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-muted-foreground">
              Enter 4-digit PIN
            </label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="mt-1 block w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
              maxLength={4}
              pattern="\d{4}"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Set PIN
          </button>
        </form>
      </div>
    </div>
  )
}

