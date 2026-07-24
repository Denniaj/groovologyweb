import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAdminClass, getStylesForSelect } from '@/lib/admin'
import { ClassForm } from '@/components/admin/ClassForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditarClasePage({ params }: Props) {
  const { id } = await params
  const [cls, styles] = await Promise.all([getAdminClass(id), getStylesForSelect()])
  if (!cls) notFound()

  return (
    <div>
      <Link href="/admin/clases" className="text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white">
        ← Clases y horarios
      </Link>
      <h1 className="mt-3 font-display text-3xl uppercase tracking-tight">Editar clase</h1>
      <div className="mt-8">
        <ClassForm
          styles={styles}
          classId={cls.id}
          initial={{
            style_id: cls.style_id,
            level: cls.level,
            weekday: cls.weekday,
            start_time: cls.start_time,
            duration_minutes: cls.duration_minutes,
            room: cls.room ?? 'Salón 1',
            is_kids: cls.is_kids,
          }}
        />
      </div>
    </div>
  )
}
