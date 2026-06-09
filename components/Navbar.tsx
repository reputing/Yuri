'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from './Providers'

export function Navbar() {
  const router = useRouter()
  const { user, openAuth } = useApp()
  const [q, setQ] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  async function handleRandom() {
    const res = await fetch('/api/nhentai/gallery/random')
    if (res.ok) { const data = await res.json(); if (data.id) router.push(`/gallery/${data.id}`) }
  }

  return (
    <nav className="sticky top-0 z-50 bg-bg2 border-b border-border backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-3 sm:gap-4">
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-accent accent-glow text-xl">✿</span>
          <span className="hidden sm:block text-xl font-extrabold tracking-[3px] text-gradient">YURI</span>
        </a>

        <form onSubmit={handleSearch} className="flex-1 max-w-[540px] flex items-center bg-bg3 border border-border rounded-lg overflow-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
          <input value={q} onChange={e => setQ(e.target.value)} type="text" placeholder="Search doujinshi, tags, artists..."
            className="flex-1 px-4 h-9 bg-transparent text-sm outline-none placeholder:text-faint" />
          <button type="submit" className="w-10 h-9 flex items-center justify-center bg-accent hover:bg-accent2 transition-colors flex-shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        </form>

        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <button onClick={handleRandom} title="Random" className="w-9 h-9 rounded-md bg-bg3 border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
          </button>

          {user ? (
            <>
              <a href="/favorites" className="w-9 h-9 rounded-md bg-bg3 border border-border flex items-center justify-center text-muted hover:text-red-400 hover:border-red-400 transition-all" title="Favorites">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </a>
              <a href="/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-purple flex items-center justify-center text-white text-sm font-bold" title="Profile">
                {(user.user_metadata?.username?.[0] || user.email?.[0] || '?').toUpperCase()}
              </a>
            </>
          ) : (
            <>
              <button onClick={() => openAuth('login')} className="hidden sm:block px-4 py-1.5 rounded-md border border-border2 text-sm font-medium hover:border-accent hover:text-accent transition-all">Login</button>
              <button onClick={() => openAuth('register')} className="px-4 py-1.5 rounded-md bg-accent hover:bg-accent2 text-white text-sm font-semibold transition-colors">Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
