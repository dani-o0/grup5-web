'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, doc, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Search } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'

interface Location {
  id: string
  name: string
  date: string
  description?: string
  imageUrl?: string
  location?: {
    latitude: number
    longitude: number
  }
  rating?: {
    0?: number
    1?: number
  }
  timestamp?: string
  userId?: string
}

export default function LocationsPage() {
  const router = useRouter()
  const [locations, setLocations] = useState<Location[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
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
              <Button
                onClick={() => router.push(`/dashboard/locations/${location.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                variant="secondary"
              >
                Entrar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

