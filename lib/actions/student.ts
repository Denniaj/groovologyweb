'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  enrollSchema,
  joinEventSchema,
  trialClassSchema,
  type EnrollInput,
  type JoinEventInput,
  type TrialClassInput,
} from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'
import type { ActionResult } from '@/lib/actions/types'

const TRIAL_EXTRA_CRC = 2000 // clase suelta en semana de prueba (₡2 000)
const TOO_MANY = 'Demasiados intentos. Espera un momento e inténtalo de nuevo.'

// Devuelve el id del usuario autenticado (validado contra el servidor de auth)
// o null. getUser() verifica el JWT, no solo lee la cookie.
async function getUserId(): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

function fieldErrors(error: z.ZodError) {
  return z.flattenError(error).fieldErrors as Record<string, string[]>
}

// ---------------------------------------------------------------------
// Inscribirse a paquete + clase(s) desde la cuenta.
// ---------------------------------------------------------------------
export async function enroll(input: EnrollInput): Promise<ActionResult<{ enrollmentId: string }>> {
  if (!(await rateLimit('enroll', 10, 60))) return { success: false, error: TOO_MANY }

  const parsed = enrollSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Revisa los campos.', fieldErrors: fieldErrors(parsed.error) }
  }

  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Debes iniciar sesión.' }

  const admin = createAdminClient()
  const { data, error } = await admin.rpc('enroll_student', {
    p_student_id: userId,
    p_package_id: parsed.data.package_id,
    p_class_ids: parsed.data.class_ids,
    p_minor_name: parsed.data.minor_name ?? undefined,
  })

  if (error) {
    const noCupo = /cupo/i.test(error.message)
    return {
      success: false,
      error: noCupo
        ? 'Una de las clases ya no tiene cupo disponible.'
        : 'No se pudo completar la inscripción.',
    }
  }

  revalidatePath('/mi-cuenta')
  return { success: true, data: { enrollmentId: data as string } }
}

// ---------------------------------------------------------------------
// Unirse a un evento/competencia (genera sus cargos de evento).
// ---------------------------------------------------------------------
export async function joinEvent(input: JoinEventInput): Promise<ActionResult<{ participantId: string }>> {
  const parsed = joinEventSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Revisa los campos.', fieldErrors: fieldErrors(parsed.error) }
  }

  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Debes iniciar sesión.' }

  const admin = createAdminClient()
  const { data, error } = await admin.rpc('join_event', {
    p_event_id: parsed.data.event_id,
    p_student_id: userId,
  })

  if (error) {
    const dup = /duplicate|unique/i.test(error.message)
    const closed = /abierto/i.test(error.message)
    return {
      success: false,
      error: dup
        ? 'Ya estás inscrito en este evento.'
        : closed
          ? 'Las inscripciones a este evento están cerradas.'
          : 'No se pudo unir al evento.',
    }
  }

  revalidatePath('/mi-cuenta')
  return { success: true, data: { participantId: data as string } }
}

// ---------------------------------------------------------------------
// Tomar la clase de prueba gratis (una en la vida). La barrera dura es el
// UNIQUE(student_id) de trial_classes; el RPC la traduce a un mensaje claro.
// ---------------------------------------------------------------------
export async function takeTrialClass(input: TrialClassInput): Promise<ActionResult<{ trialId: string }>> {
  const parsed = trialClassSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Revisa los campos.', fieldErrors: fieldErrors(parsed.error) }
  }

  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Debes iniciar sesión.' }

  const admin = createAdminClient()
  const { data, error } = await admin.rpc('take_trial_class', {
    p_student_id: userId,
    p_class_id: parsed.data.class_id,
  })

  if (error) {
    const usada = /prueba|unique|duplicate/i.test(error.message)
    return {
      success: false,
      error: usada
        ? 'Ya usaste tu clase de prueba gratuita.'
        : 'No se pudo registrar la clase de prueba.',
    }
  }

  revalidatePath('/mi-cuenta')
  return { success: true, data: { trialId: data as string } }
}

// ---------------------------------------------------------------------
// Reservar una clase suelta (₡2 000) durante la semana de prueba. Crea un
// cargo trial_extra. El monto es fijo y se pone en el servidor: el alumno
// no puede alterarlo.
// ---------------------------------------------------------------------
export async function bookExtraClass(input: TrialClassInput): Promise<ActionResult<{ chargeId: string }>> {
  const parsed = trialClassSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Revisa los campos.', fieldErrors: fieldErrors(parsed.error) }
  }

  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Debes iniciar sesión.' }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('charges')
    .insert({
      student_id: userId,
      type: 'trial_extra',
      description: 'Clase suelta (semana de prueba)',
      amount_crc: TRIAL_EXTRA_CRC,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    return { success: false, error: 'No se pudo reservar la clase suelta.' }
  }

  revalidatePath('/mi-cuenta')
  return { success: true, data: { chargeId: data.id } }
}
