import { auth } from 'firebase-admin'
import { NextResponse } from 'next/server'
import { initAdmin } from '@/lib/firebase-admin'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    initAdmin()
    await auth().deleteUser(params.id)
    return NextResponse.json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    )
  }
} 