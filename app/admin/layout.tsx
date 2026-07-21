import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/admin'
import { AdminNav, AdminSidebar } from '@/components/admin/AdminNav'

export const metadata: Metadata = {
  title: 'Panel',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Redirige si no es admin (a /login o /).
  await requireAdmin()

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
