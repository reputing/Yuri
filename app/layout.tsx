import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Yuri — Manga Library',
  description: 'Your personal doujinshi library',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-[#e8e8f0]">
        <Providers>
          <Navbar />
          <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 pb-20 min-h-[calc(100vh-60px)]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
