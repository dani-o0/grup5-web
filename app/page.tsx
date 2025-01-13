'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard/locations')
    } catch (error: any) {
      console.error('Login error:', error.message)
      setError(error.message || 'Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1b26] flex items-center justify-center">
      <div className="bg-[#2f3146] rounded-3xl p-8 w-full max-w-md mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-full h-full"
            >
              <path d="M12,21V19H20V21H12M8,21V19H10V21H8M6,19V17H8V19H6M4,19H2V17H4V19M20,17H18V15H20V17M20,13H18V11H20V13M20,9H18V7H20V9M20,5H18V3H20V5M8,17H6V15H8V17M12,13V5C12,3.34 10.66,2 9,2C7.34,2 6,3.34 6,5V13H12Z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">POOP APP</h1>
          <h2 className="text-white text-xl">Administrator</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#1a1b26] text-white border-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Contraseña..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#1a1b26] text-white border-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#2196f3] to-[#0d47a1] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

