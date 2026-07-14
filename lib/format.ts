export const WEEKDAYS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
] as const

// Días con clases, en orden de lunes a sábado (el orden del sitio).
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6]

// '18:00:00' -> '6:00pm'
export function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const ampm = h < 12 ? 'am' : 'pm'
  const hh = ((h + 11) % 12) + 1
  return `${hh}:${String(m).padStart(2, '0')}${ampm}`
}

const LEVELS: Record<string, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  todos: 'Todos los niveles',
}

export function levelLabel(level: string): string {
  return LEVELS[level] ?? level
}
