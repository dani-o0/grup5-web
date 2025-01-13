'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc, Timestamp, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { ConfirmDialog } from '@/components/confirm-dialog'

// Importación dinámica del mapa para evitar problemas de SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

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
  timestamp?: any
  userId?: string
}

interface User {
  username: string
  email: string
  profilePicture: string
}

export default function LocationDetail({ params }: { params: { id: string } }) {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string>('')
  const router = useRouter()
  const [icon, setIcon] = useState<any>(null)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Cargar el icono del marcador
  useEffect(() => {
    (async () => {
      if (typeof window !== 'undefined') {
        const L = (await import('leaflet')).default
        setIcon(
          new L.Icon({
            iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          })
        )
      }
    })()
  }, [])

  useEffect(() => {
    const fetchLocationAndUsername = async () => {
      try {
        // Obtener datos de la localización
        const locationDoc = await getDoc(doc(db, 'Lavabos', params.id))
        
        if (locationDoc.exists()) {
          const locationData = {
            id: locationDoc.id,
            ...locationDoc.data()
          } as Location
          
          setLocation(locationData)

          // Si existe userId, buscar el username en la colección Users
          if (locationData.userId) {
            const userDoc = await getDoc(doc(db, 'Users', locationData.userId))
            if (userDoc.exists()) {
              const userData = userDoc.data() as User
              setUsername(userData.username)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocationAndUsername()
  }, [params.id])

  // Añadir función para manejar el borrado
  const handleDeleteLocation = async () => {
    try {
      await deleteDoc(doc(db, 'Lavabos', params.id))
      router.push('/dashboard/locations') // Redirigir a la lista después de borrar
    } catch (error) {
      console.error('Error deleting location:', error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  if (!location) {
    return <div className="flex justify-center items-center min-h-screen">Localización no encontrada</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-3 items-center mb-6">
        <Button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          variant="secondary"
        >
          Volver
        </Button>
        
        <Button
          onClick={() => setDeleteDialogOpen(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          variant="destructive"
        >
          Eliminar
        </Button>
      </div>

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

        <h2 className="text-lg font-semibold text-white mb-2">Descripcion</h2>

        {location.description && (
            <p className="text-gray-300 mb-4">{location.description}</p>
        )}

        {location.location && icon && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white mb-2">Ubicación</h2>
            <div className="w-[350px] h-[350px] rounded-lg overflow-hidden">
              <MapContainer
                center={[location.location.latitude, location.location.longitude]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                dragging={false}
                touchZoom={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                boxZoom={false}
                keyboard={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker 
                  position={[location.location.latitude, location.location.longitude]}
                  icon={icon}
                >
                  <Popup>
                    {location.name}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        {location.rating && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white mb-2">Valoraciones</h2>
            <p className="text-gray-300">
              {/* Calcular la media de las valoraciones */}
              {(() => {
                const ratings = Object.values(location.rating); // Extraer los valores del objeto rating
                const total = ratings.reduce((sum, val) => sum + (val || 0), 0); // Sumar valores
                const average = ratings.length > 0 ? total / ratings.length : 0; // Calcular media
                return `Media: ${average.toFixed(2)} estrellas`;
              })()}
            </p>
          </div>
        )}

        <div className="text-sm text-gray-400">
          {location?.timestamp && (
            <p>Fecha: {location.timestamp.toDate().toLocaleDateString()}</p>
          )}
          {location?.userId && (
            <>
              <p>ID de usuario: {location.userId}</p>
              <p>Nombre de usuario: {username || 'No encontrado'}</p>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteLocation}
        message="¿Estás seguro de que deseas eliminar esta localización?"
      />
    </div>
  )
} 