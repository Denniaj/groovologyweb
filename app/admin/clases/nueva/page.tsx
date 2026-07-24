import Link from 'next/link'
import { getStylesForSelect } from '@/lib/admin'
import { ClassForm } from '@/components/admin/ClassForm'

export default async function NuevaClasePage() {
  const styles = await getStylesForSelect()

  return (
    <div>
      <Link href="/admin/clases" className="text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white">
        ← Clases y horarios
      </Link>
      <h1 className="mt-3 font-display text-3xl uppercase tracking-tight">Nueva clase</h1>
      <div className="mt-8">
        <ClassForm styles={styles} />
      </div>
    </div>
  )
}
