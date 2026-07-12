'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { registerSchema, loginSchema, type RegisterInput, type LoginInput } from '@/lib/validations'
import { sendWelcomeEmail } from '@/lib/email/send'
import { rateLimit } from '@/lib/rate-limit'
import type { ActionResult } from '@/lib/actions/types'

const TOO_MANY = 'Demasiados intentos. Espera un momento e inténtalo de nuevo.'

// ---------------------------------------------------------------------
// Registro: crea la cuenta y, si no es alumna nueva, genera su inscripción
// (paquete + clases) y los cargos vía enroll_student. Si marcó eventos,
// la une con join_event. La alumna nueva no inscribe nada aquí: se le
// ofrece la clase de prueba luego, desde su cuenta.
// ---------------------------------------------------------------------
export async function register(
  input: RegisterInput
): Promise<ActionResult<{ needsEmailConfirmation: boolean }>> {
  if (!(await rateLimit('register', 5, 60))) return { success: false, error: TOO_MANY }

  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Revisa los campos del formulario.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    }
  }
  const data = parsed.data

  const supabase = await createClient()
  const { data: signUp, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        birth_date: data.birth_date,
        national_id: data.national_id,
        is_new_student: data.is_new_student,
      },
    },
  })

  if (error) {
    const already = /already|registered|exists/i.test(error.message)
    return {
      success: false,
      error: already
        ? 'Ya existe una cuenta con ese correo.'
        : 'No se pudo crear la cuenta. Inténtalo de nuevo.',
    }
  }

  const studentId = signUp.user?.id
  if (!studentId) {
    return { success: false, error: 'No se pudo crear la cuenta. Inténtalo de nuevo.' }
  }

  // El perfil ya lo creó el trigger handle_new_user. Generamos inscripción y
  // cargos con el cliente admin (aún puede no haber sesión si el correo
  // requiere confirmación).
  const admin = createAdminClient()

  if (!data.is_new_student && data.package_id) {
    const { error: enrollError } = await admin.rpc('enroll_student', {
      p_student_id: studentId,
      p_package_id: data.package_id,
      p_class_ids: data.class_ids,
      p_minor_name: data.minor_name ?? undefined,
    })
    if (enrollError) {
      return {
        success: false,
        error: 'Tu cuenta se creó, pero no se pudo completar la inscripción. '
          + 'Escríbenos para terminar de inscribirte.',
      }
    }
  }

  for (const eventId of data.event_ids) {
    const { error: joinError } = await admin.rpc('join_event', {
      p_event_id: eventId,
      p_student_id: studentId,
    })
    if (joinError) {
      // No abortamos el registro por un evento; se puede reintentar desde la cuenta.
      console.error('join_event falló en registro:', joinError.message)
    }
  }

  await sendWelcomeEmail(data.email, data.first_name)

  return { success: true, data: { needsEmailConfirmation: !signUp.session } }
}

// ---------------------------------------------------------------------
// Login: inicia sesión y redirige a la cuenta del alumno.
// ---------------------------------------------------------------------
export async function login(input: LoginInput): Promise<ActionResult> {
  if (!(await rateLimit('login', 10, 60))) return { success: false, error: TOO_MANY }

  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Revisa los campos.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { success: false, error: 'Correo o contraseña incorrectos.' }
  }

  redirect('/mi-cuenta')
}

// ---------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------
export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
