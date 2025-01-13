'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { ConfirmDialog } from '@/components/confirm-dialog'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1b26]">
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#2f3146] transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-30`}
      >
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="w-full bg-gradient-to-r from-[#2196f3] to-[#0d47a1] text-white p-4 text-left md:cursor-default"
        >
          Menu
        </button>
        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard/users"
            className="block p-3 rounded-lg text-white hover:bg-[#1a1b26] transition-colors"
          >
            Administracion Usuarios
          </Link>
          <Link
            href="/dashboard/locations"
            className="block p-3 rounded-lg text-white hover:bg-[#1a1b26] transition-colors"
          >
            Administracion Localizaciones
          </Link>
        </nav>
      </aside>

      <div className="md:ml-64">
        <header className="bg-[#2f3146] p-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-white md:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                M
              </div>
              <span className="text-white text-lg">Manolo</span>
            </div>
            <button
              onClick={() => setLogoutDialogOpen(true)}
              className="text-white hover:underline"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="p-4">
          {children}
        </main>
      </div>

      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        message="¿Estas seguro de que deseas cerrar la sesión?"
      />
    </div>
  )
}

