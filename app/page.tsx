'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
        <div className="w-32 h-32 mb-4 relative">
          <Image
            src="/LogoLetrasB.png"
            alt="Poop App Logo"
            width={128}
            height={128}
            className="object-contain"
          />
        </div>
          <br/>
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

