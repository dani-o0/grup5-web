'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface Location {
  id: string
  name: string
  date: string
}

const MOCK_LOCATIONS: Location[] = [
  { id: '1', name: 'LavaHome', date: '17/08/2022' },
  { id: '2', name: 'Bare More', date: '18/08/2022' },
  { id: '3', name: 'La casa de Pepa', date: '22/05/2005' },
  { id: '4', name: 'Lavabo Dani', date: '12/05/1999' },
  { id: '5', name: 'Premium Toilet', date: '11/09/2001' }
]

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const filteredLocations = MOCK_LOCATIONS.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteLocation = () => {
    // Implementar la lógica de eliminación
    setDeleteDialogOpen(false)
    setSelectedLocation(null)
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
        {filteredLocations.map(location => (
          <div
            key={location.id}
            className="bg-[#2f3146] p-4 rounded-lg flex items-center justify-between"
          >
            <div>
              <h3 className="text-white font-medium">{location.name}</h3>
              <p className="text-gray-400 text-sm">{location.date}</p>
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
                  setSelectedLocation(location)
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
        onConfirm={handleDeleteLocation}
        message="¿Estas seguro de que deseas eliminar la localización?"
      />
    </div>
  )
}

