'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface Location {
  id: string
  name: string
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

export default function LocationDetail({ params }: { params: { id: string } }) {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const docRef = doc(db, 'Lavabos', params.id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setLocation({
            id: docSnap.id,
            ...docSnap.data()
          } as Location)
        }
      } catch (error) {
        console.error('Error fetching location:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [params.id])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  if (!location) {
    return <div className="flex justify-center items-center min-h-screen">Localización no encontrada</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button
        onClick={() => router.back()}
        className="mb-6"
        variant="outline"
      >
        Volver
      </Button>

      <div className="bg-[#2f3146] rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-4">{location.name}</h1>
        
        {location.imageUrl && (
          <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
            <Image
              src={location.imageUrl}
              alt={location.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {location.description && (
          <p className="text-gray-300 mb-4">{location.description}</p>
        )}

        {location.location && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white mb-2">Ubicación</h2>
            <p className="text-gray-300">
              Latitud: {location.location.latitude}
              <br />
              Longitud: {location.location.longitude}
            </p>
          </div>
        )}

        {location.rating && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white mb-2">Valoraciones</h2>
            <p className="text-gray-300">
              2.5 estrellas: {location.rating[0] || 0} valoraciones
              <br />
              4.5 estrellas: {location.rating[1] || 0} valoraciones
            </p>
          </div>
        )}

        <div className="text-sm text-gray-400">
          {location.timestamp && (
            <p>Fecha: {new Date(location.timestamp).toLocaleDateString()}</p>
          )}
          {location.userId && <p>ID de usuario: {location.userId}</p>}
        </div>
      </div>
    </div>
  )
} 