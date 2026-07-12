import type { MetadataRoute } from 'next'

// No indexar páginas privadas ni la API. El catálogo público sí.
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://groovologycr.vercel.app'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/registro', '/mi-cuenta', '/admin', '/api'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
