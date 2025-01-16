import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Poop APP Administrator',
  description: 'Poop APP Administrator',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
