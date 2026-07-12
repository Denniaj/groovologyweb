type Settings = {
  instagram?: string | null
  tiktok?: string | null
  facebook?: string | null
  whatsapp?: string | null
} | null

function igUrl(v: string) {
  return v.startsWith('http') ? v : `https://instagram.com/${v.replace(/^@/, '')}`
}
function ttUrl(v: string) {
  return v.startsWith('http') ? v : `https://tiktok.com/@${v.replace(/^@/, '')}`
}
function fbUrl(v: string) {
  return v.startsWith('http') ? v : `https://facebook.com/${v}`
}
function waUrl(v: string) {
  return v.startsWith('http') ? v : `https://wa.me/${v.replace(/[^0-9]/g, '')}`
}

// Íconos de marca como SVG inline (independientes de la librería de íconos).
const S = ({ size = 20, children }: { size?: number; children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    {children}
  </svg>
)
const Instagram = ({ size }: { size?: number }) => (
  <S size={size}>
    <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.36 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .36-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 12 18.6 6.6 6.6 0 0 0 12 5.4zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zM18.9 5.6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
  </S>
)
const TikTok = ({ size }: { size?: number }) => (
  <S size={size}>
    <path d="M16.5 3c.3 2.1 1.6 3.6 3.5 3.8v2.5c-1.3.1-2.5-.3-3.5-1v6.7c0 3.4-2.7 5.9-6 5.5-2.6-.3-4.5-2.5-4.4-5.1.1-2.6 2.3-4.7 4.9-4.6.3 0 .6 0 .9.1v2.6c-.3-.1-.6-.2-.9-.2-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V3h3z" />
  </S>
)
const Facebook = ({ size }: { size?: number }) => (
  <S size={size}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.75-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
  </S>
)
const WhatsApp = ({ size }: { size?: number }) => (
  <S size={size}>
    <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3-1.3-5-4.4-5.1-4.6-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.9-.2 1.6z" />
  </S>
)

const cls = 'text-white/70 transition-colors hover:text-white'

export function Socials({ settings, size = 20, className = '' }: { settings: Settings; size?: number; className?: string }) {
  if (!settings) return null
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {settings.instagram && (
        <a href={igUrl(settings.instagram)} target="_blank" rel="noreferrer" aria-label="Instagram" className={cls}>
          <Instagram size={size} />
        </a>
      )}
      {settings.tiktok && (
        <a href={ttUrl(settings.tiktok)} target="_blank" rel="noreferrer" aria-label="TikTok" className={cls}>
          <TikTok size={size} />
        </a>
      )}
      {settings.facebook && (
        <a href={fbUrl(settings.facebook)} target="_blank" rel="noreferrer" aria-label="Facebook" className={cls}>
          <Facebook size={size} />
        </a>
      )}
      {settings.whatsapp && (
        <a href={waUrl(settings.whatsapp)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={cls}>
          <WhatsApp size={size} />
        </a>
      )}
    </div>
  )
}
