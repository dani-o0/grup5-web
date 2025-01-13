'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

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
  timestamp?: Timestamp
  userId?: string
}

export default function LocationDetail({ params }: { params: { id: string } }) {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [icon, setIcon] = useState<any>(null)

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
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-3"
        variant="secondary"
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
          {location.timestamp && (
            <p>Fecha: {location.timestamp.toDate().toLocaleDateString()}</p>
          )}
          {location.userId && <p>ID de usuario: {location.userId}</p>}
        </div>
      </div>
    </div>
  )
} 