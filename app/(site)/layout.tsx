import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { getSettings } from '@/lib/data'
import { getViewer } from '@/lib/account'

// Chrome del sitio público (Header + Footer). El panel admin usa el suyo.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, viewer] = await Promise.all([getSettings(), getViewer()])
  return (
    <>
      <Header viewer={viewer ? { isAdmin: viewer.isAdmin } : null} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  )
}
