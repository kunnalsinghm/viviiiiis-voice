import '@fontsource-variable/playfair-display'
import '@fontsource-variable/playfair-display/wght-italic.css'
import '@fontsource-variable/karla'
import '@fontsource-variable/caveat'
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Provider } from '@/components/PlayerProvider'
import { Nav } from '@/components/Nav'
import { cfg } from '@/lib/config'

export const metadata: Metadata = { title: cfg.title, description: cfg.tagline }
export const viewport: Viewport = { themeColor: '#D32F1E', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Provider>
          <Nav />
          <main className="mx-auto max-w-5xl px-4 sm:px-5">{children}</main>
        </Provider>
      </body>
    </html>
  )
}
