import { z } from 'zod'

// ---------------------------------------------------------------------
// Piezas reutilizables
// ---------------------------------------------------------------------

const uuid = z.uuid('Identificador inválido')

// Cédula de Costa Rica: dígitos con guiones opcionales (9–12 dígitos).
const cedula = z
  .string()
  .trim()
  .regex(/^[0-9]{1,2}-?[0-9]{3,4}-?[0-9]{4,5}$/, 'Cédula inválida')

// Teléfono CR: 8 dígitos, con o sin prefijo +506 y separadores.
const phone = z
  .string()
  .trim()
  .regex(/^(\+?506[-\s]?)?[0-9]{4}[-\s]?[0-9]{4}$/, 'Teléfono inválido')

// Fecha de nacimiento: 'YYYY-MM-DD', real y no futura.
const birthDate = z.iso
  .date('Fecha de nacimiento inválida')
  .refine((d) => {
    const date = new Date(d)
    return date <= new Date() && date.getFullYear() > 1900
  }, 'Fecha de nacimiento fuera de rango')

// Contraseña: mínimo 8, con al menos una letra y un número.
const password = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Za-z]/, 'Debe incluir al menos una letra')
  .regex(/[0-9]/, 'Debe incluir al menos un número')

// ---------------------------------------------------------------------
// Registro (un solo formulario, todo junto)
// ---------------------------------------------------------------------
export const registerSchema = z
  .object({
    first_name: z.string().trim().min(1, 'Nombre requerido'),
    last_name: z.string().trim().min(1, 'Apellidos requeridos'),
    email: z.email('Correo inválido'),
    password,
    phone,
    birth_date: birthDate,
    national_id: cedula,
    is_new_student: z.boolean(),
    // Si NO es nueva: elige paquete y clase(s). Si es nueva: opcionales
    // (se le ofrece la clase de prueba en lugar de forzar paquete).
    package_id: uuid.optional(),
    class_ids: z.array(uuid).default([]),
    minor_name: z.string().trim().min(1).optional(),
    event_ids: z.array(uuid).default([]),
  })
  .refine(
    (d) => d.is_new_student || d.package_id !== undefined,
    { error: 'Selecciona un paquete', path: ['package_id'] }
  )
  .refine(
    (d) => d.is_new_student || d.class_ids.length > 0,
    { error: 'Selecciona al menos una clase', path: ['class_ids'] }
  )

export type RegisterInput = z.infer<typeof registerSchema>

// ---------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------
export const loginSchema = z.object({
  email: z.email('Correo inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export type LoginInput = z.infer<typeof loginSchema>

// ---------------------------------------------------------------------
// Inscribirse a paquete/clase(s) (desde la cuenta)
// ---------------------------------------------------------------------
export const enrollSchema = z.object({
  package_id: uuid,
  class_ids: z.array(uuid).min(1, 'Selecciona al menos una clase'),
  minor_name: z.string().trim().min(1).optional(),
})

export type EnrollInput = z.infer<typeof enrollSchema>

// ---------------------------------------------------------------------
// Unirse a un evento
// ---------------------------------------------------------------------
export const joinEventSchema = z.object({
  event_id: uuid,
})

export type JoinEventInput = z.infer<typeof joinEventSchema>

// ---------------------------------------------------------------------
// Clase de prueba / clase suelta
// ---------------------------------------------------------------------
export const trialClassSchema = z.object({
  class_id: uuid,
})

export type TrialClassInput = z.infer<typeof trialClassSchema>

// ---------------------------------------------------------------------
// Cancelar inscripción
// ---------------------------------------------------------------------
export const cancelEnrollmentSchema = z.object({
  enrollment_id: uuid,
})

export type CancelEnrollmentInput = z.infer<typeof cancelEnrollmentSchema>

// ---------------------------------------------------------------------
// Editar perfil (nombre, apellidos, teléfono)
// ---------------------------------------------------------------------
export const editProfileSchema = z.object({
  first_name: z.string().trim().min(1, 'Nombre requerido'),
  last_name: z.string().trim().min(1, 'Apellidos requeridos'),
  phone,
})

export type EditProfileInput = z.infer<typeof editProfileSchema>

// ---------------------------------------------------------------------
// Subida de comprobante (validación del archivo)
// ---------------------------------------------------------------------
const MAX_RECEIPT_BYTES = 5 * 1024 * 1024 // 5 MB (igual que el bucket)
const RECEIPT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

export const receiptUploadSchema = z.object({
  charge_id: uuid,
  file: z
    .instanceof(File, { error: 'Archivo requerido' })
    .refine((f) => f.size > 0, 'El archivo está vacío')
    .refine((f) => f.size <= MAX_RECEIPT_BYTES, 'El archivo supera los 5 MB')
    .refine(
      (f) => RECEIPT_TYPES.includes(f.type),
      'Formato no permitido (usa JPG, PNG, WEBP o PDF)'
    ),
})

export type ReceiptUploadInput = z.infer<typeof receiptUploadSchema>
