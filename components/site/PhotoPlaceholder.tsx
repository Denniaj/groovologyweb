// Bloque oscuro para donde irán fotos reales (que el admin subirá luego).
// Estética urbana: gradiente + grano sutil + etiqueta en tipografía display.
export function PhotoPlaceholder({
  label,
  className = '',
  children,
}: {
  label?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-900 to-black ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 25%, #ffffff, transparent 55%)' }}
      />
      {label && (
        <span className="relative select-none font-display text-3xl uppercase tracking-wide text-white/20">
          {label}
        </span>
      )}
      {children}
    </div>
  )
}
