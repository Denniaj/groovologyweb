import Link from 'next/link'
import { getAdminDashboard, getNotifications } from '@/lib/admin'
import { NotificationsPanel } from '@/components/admin/NotificationsPanel'

const crc = (n: number) => '₡' + n.toLocaleString('es-CR')

export default async function AdminDashboard() {
  const [stats, notifications] = await Promise.all([getAdminDashboard(), getNotifications()])

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-tight">Dashboard</h1>

      {/* RESUMEN FINANCIERO */}
      <div className="mt-6 grid gap-px border border-white/10 sm:grid-cols-3">
        <div className="bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-widest text-white/40">Ingresos del mes</p>
          <p className="mt-1 font-display text-2xl text-green-300">{crc(stats.ingresosMes)}</p>
        </div>
        <div className="bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-widest text-white/40">Pendiente</p>
          <p className="mt-1 font-display text-2xl text-amber-200">{crc(stats.pendiente)}</p>
        </div>
        <div className="bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-widest text-white/40">Vencido</p>
          <p className="mt-1 font-display text-2xl text-red-300">{crc(stats.vencido)}</p>
        </div>
      </div>

      {/* ALERTAS / ACCESOS */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/pagos" className="border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/30">
          <p className="text-xs uppercase tracking-widest text-white/40">Comprobantes por revisar</p>
          <p className="mt-1 font-display text-3xl">{stats.needsReview}</p>
        </Link>
        <Link href="/admin/alumnos" className="border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/30">
          <p className="text-xs uppercase tracking-widest text-white/40">Alumnos activos</p>
          <p className="mt-1 font-display text-3xl">{stats.activeStudents}</p>
        </Link>
        <div className="border border-white/10 bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-widest text-white/40">Solicitudes de prueba</p>
          <p className="mt-1 font-display text-3xl">{stats.trialRequests}</p>
        </div>
      </div>

      {/* NOTIFICACIONES */}
      <div className="mt-8">
        <NotificationsPanel notifications={notifications} />
      </div>
    </div>
  )
}
