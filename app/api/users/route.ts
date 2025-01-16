import { auth } from 'firebase-admin'
import { NextResponse } from 'next/server'
import { initAdmin } from '@/lib/firebase-admin'

export async function GET() {
  try {
    // Inicializar Firebase Admin si no está inicializado
    initAdmin()
    
    // Obtener los usuarios
    const listUsersResult = await auth().listUsers()
    const users = listUsersResult.users.map(user => ({
      id: user.uid,
      name: user.displayName || user.email || 'Sin nombre',
      date: user.metadata.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString()
        : 'Fecha desconocida'
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}