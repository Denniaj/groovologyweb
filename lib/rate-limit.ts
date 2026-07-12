import 'server-only'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

// IP del cliente a partir de las cabeceras del proxy/CDN.
async function getClientIp(): Promise<string> {
  const h = await headers()
  const fwd = h.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return h.get('x-real-ip')?.trim() || 'unknown'
}

// Devuelve true si la acción está PERMITIDA para esta IP, false si se pasó
// del límite. Fail-open: si el limiter falla, no bloquea (mejor un intento
// de más que caerse). El límite se cuenta por IP + nombre de acción.
export async function rateLimit(
  action: string,
  max: number,
  windowSeconds: number
): Promise<boolean> {
  try {
    const ip = await getClientIp()
    const admin = createAdminClient()
    const { data, error } = await admin.rpc('check_rate_limit', {
      p_key: `${action}:${ip}`,
      p_max: max,
      p_window_seconds: windowSeconds,
    })
    if (error) return true
    return data as boolean
  } catch {
    return true
  }
}
