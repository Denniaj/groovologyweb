// Resultado estándar de una Server Action. `fieldErrors` mapea cada campo
// del formulario a sus mensajes de error (para pintarlos junto al input).
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
