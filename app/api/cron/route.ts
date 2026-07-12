import { NextResponse, type NextRequest } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { runDailyTasks } from '@/lib/cron/tasks'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Compara el header Authorization con CRON_SECRET de forma timing-safe.
// Vercel Cron inyecta `Authorization: Bearer <CRON_SECRET>` automáticamente.
function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = request.headers.get('authorization') ?? ''
  const expected = `Bearer ${secret}`
  const a = Buffer.from(header)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const summary = await runDailyTasks()
  return NextResponse.json({ ok: true, ...summary })
}
