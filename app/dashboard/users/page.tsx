'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface User {
  id: string
  name: string
  date: string
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Vector', date: '12/12/2006' },
  { id: '2', name: 'Marc', date: '01/12/2012' },
  { id: '3', name: 'Pablo', date: '02/09/2012' },
  { id: '4', name: 'Jose', date: '05/11/2022' },
  { id: '5', name: 'El Gatino', date: '05/11/2022' }
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const filteredUsers = MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteUser = () => {
    // Implementar la lógica de eliminación
    setDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
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
              <button
                onClick={() => {/* Implementar vista detalle */}}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setSelectedUser(user)
                  setDeleteDialogOpen(true)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Eliminar
              </button>
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

