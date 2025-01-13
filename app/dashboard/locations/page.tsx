'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Search } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Location {
  id: string
  name: string
  date: string
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newLocationName, setNewLocationName] = useState('')
  const [isAddingLocation, setIsAddingLocation] = useState(false)

  useEffect(() => {
    const fetchLocations = async () => {
      const querySnapshot = await getDocs(collection(db, 'Lavabos'))
      const fetchedLocations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Location[]
      setLocations(fetchedLocations)
    }

    fetchLocations()
  }, [])

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteLocation = async () => {
    if (selectedLocation) {
      try {
        await deleteDoc(doc(db, 'Lavabos', selectedLocation.id))
        setLocations(locations.filter(loc => loc.id !== selectedLocation.id))
        setDeleteDialogOpen(false)
        setSelectedLocation(null)
      } catch (error) {
        console.error('Error deleting location:', error)
      }
    }
  }

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newLocationName.trim()) {
      try {
        const docRef = await addDoc(collection(db, 'locations'), {
          name: newLocationName.trim(),
          date: new Date().toLocaleDateString()
        })
        const newLocation = { id: docRef.id, name: newLocationName.trim(), date: new Date().toLocaleDateString() }
        setLocations([...locations, newLocation])
        setNewLocationName('')
        setIsAddingLocation(false)
      } catch (error) {
        console.error('Error adding location:', error)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2"
        />
      </div>

      {isAddingLocation ? (
        <form onSubmit={handleAddLocation} className="mb-6">
          <Input
            type="text"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            placeholder="Nombre de la nueva localización"
            className="w-full mb-2"
          />
          <div className="flex gap-2">
            <Button type="submit" className="bg-green-500 hover:bg-green-600">
              Añadir
            </Button>
            <Button
              type="button"
              onClick={() => setIsAddingLocation(false)}
              variant="secondary"
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setIsAddingLocation(true)}
          className="mb-6"
        >
          Añadir Localización
        </Button>
      )}

      <div className="grid gap-4">
        {filteredLocations.map(location => (
          <div
            key={location.id}
            className="bg-card p-4 rounded-lg flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{location.name}</h3>
              <p className="text-sm text-muted-foreground">{location.date}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {/* Implementar vista detalle */}}
                variant="secondary"
              >
                Entrar
              </Button>
              <Button
                onClick={() => {
                  setSelectedLocation(location)
                  setDeleteDialogOpen(true)
                }}
                variant="destructive"
              >
                Eliminar
              </Button>
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

