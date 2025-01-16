'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface User {
  id: string
  username: string
  email: string
  profilePicture?: string
  createdAt?: any
}

interface Location {
  id: string
  name: string
  date: string
  description?: string
  imageUrl?: string
  userId?: string
}

export default function UserDetail({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [userLocations, setUserLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndLocations = async () => {
      try {
        // Obtener datos del usuario
        const userDoc = await getDoc(doc(db, 'Users', params.id))
        
        if (userDoc.exists()) {
          setUser({
            id: userDoc.id,
            ...userDoc.data()
          } as User)

          // Obtener las locations del usuario
          const locationsQuery = query(
            collection(db, 'Lavabos'),
            where('userId', '==', params.id)
          )
          const locationsSnapshot = await getDocs(locationsQuery)
          const locations = locationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Location[]
          
          setUserLocations(locations)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndLocations()
  }, [params.id])

  const handleDeleteUser = async () => {
    if (!user) return

    try {
      // Primero eliminamos todas las locations del usuario
      for (const location of userLocations) {
        await deleteDoc(doc(db, 'Lavabos', location.id))
      }

      // Luego eliminamos el usuario
      await deleteDoc(doc(db, 'Users', user.id))

      // También eliminamos el usuario de Firebase Auth usando nuestra API
      await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      })

      router.push('/dashboard/users')
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Usuario no encontrado</div>
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

      <div className="bg-[#2f3146] rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {user.profilePicture && (
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={user.profilePicture}
                alt={user.username}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{user.username}</h1>
            <p className="text-gray-400">{user.email}</p>
            {user.createdAt && (
              <p className="text-sm text-gray-400 mt-2">
                Miembro desde: {user.createdAt.toDate().toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-2">Estadísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Total de locations:</p>
              <p className="text-white text-xl">{userLocations.length}</p>
            </div>
            {/* Puedes agregar más estadísticas aquí */}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Locations del Usuario</h2>
        <div className="grid gap-4">
          {userLocations.map(location => (
            <div
              key={location.id}
              className="bg-[#2f3146] p-4 rounded-lg flex items-center justify-between"
            >
              {location.imageUrl && (
                <div className="relative w-32 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={location.imageUrl}
                    alt={location.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-white font-medium">{location.name}</h3>
                <p className="text-gray-400 text-sm">{location.date}</p>
              </div>
              <Button
                onClick={() => router.push(`/dashboard/locations/${location.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                variant="secondary"
              >
                Entrar
              </Button>
            </div>
          ))}
          {userLocations.length === 0 && (
            <p className="text-gray-400">Este usuario no ha creado ninguna location.</p>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        message={`¿Estás seguro de que deseas eliminar al usuario ${user.username}? Esta acción también eliminará todas sus locations.`}
      />
    </div>
  )
} 