export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  children?: React.ReactNode
}) {
  return (
    <section className="border-b border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">{eyebrow}</p>
        )}
        <h1 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
          {title}
        </h1>
        {subtitle && <p className="mt-5 max-w-xl text-base text-white/70">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
