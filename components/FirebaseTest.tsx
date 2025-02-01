"use client"

import { useAuth } from "../contexts/AuthContext"

export function FirebaseTest() {
  const { user, signIn, signOut } = useAuth()

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Firebase Test</h2>
      {user ? (
        <div>
          <p>Signed in as: {user.email}</p>
          <button onClick={signOut} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={signIn} className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign In with Google
        </button>
      )}
    </div>
  )
}

