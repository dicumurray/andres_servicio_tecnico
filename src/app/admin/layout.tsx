import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Administración',
  description: 'Panel de administración de Andrés Servicio Técnico.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}