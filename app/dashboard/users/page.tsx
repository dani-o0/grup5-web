'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  date: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        if (data.users) {
          setUsers(data.users)
        }
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== selectedUser.id))
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
    }

    setDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#2f3146] text-white rounded-lg border-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="bg-[#2f3146] p-4 rounded-lg flex items-center justify-between"
          >
            <div>
              <h3 className="text-white font-medium">{user.name}</h3>
              <p className="text-gray-400 text-sm">{user.date}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push(`/dashboard/users/${user.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                variant="secondary"
              >
                Entrar
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        message="¿Estas seguro de que deseas eliminar este usuario?"
      />
    </div>
  )
}

