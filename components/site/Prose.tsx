// Estilos compartidos para las páginas de texto legal.
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:uppercase [&_h2]:tracking-wide [&_li]:text-white/70 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-white/70 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
      {children}
    </article>
  )
}

export function DraftNotice() {
  return (
    <p className="border border-white/15 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-widest text-white/50">
      Borrador — pendiente de revisión legal antes del lanzamiento.
    </p>
  )
}
