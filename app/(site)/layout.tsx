import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { getSettings } from '@/lib/data'

// Chrome del sitio público (Header + Footer). El panel admin usa el suyo.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  )
}
