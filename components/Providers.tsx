'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, SupabaseClient } from '@supabase/supabase-js'
import { AuthModal } from './AuthModal'
import { ToastContainer } from './Toast'

interface AppCtx {
  user: User | null
  supabase: SupabaseClient
  openAuth: (tab?: 'login' | 'register') => void
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
  toggleFavorite: (galleryId: number, meta?: { title?: string; cover?: string; pages?: number }) => Promise<void>
  isFavorite: (galleryId: number) => boolean
}

const Ctx = createContext<AppCtx | null>(null)
export const useApp = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be inside Providers')
  return ctx
}

export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([])
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) loadFavorites(user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadFavorites(session.user.id)
      else setFavorites(new Set())
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const auth = params.get('auth')
    if (auth === 'login' || auth === 'register') { setAuthTab(auth); setAuthOpen(true) }
  }, [])

  async function loadFavorites(userId: string) {
    const { data } = await supabase.from('favorites').select('gallery_id').eq('user_id', userId)
    if (data) setFavorites(new Set(data.map(f => f.gallery_id)))
  }

  const openAuth = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthTab(tab); setAuthOpen(true)
  }, [])

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }, [])

  const toggleFavorite = useCallback(async (
    galleryId: number,
    meta?: { title?: string; cover?: string; pages?: number }
  ) => {
    if (!user) { openAuth('login'); return }
    if (favorites.has(galleryId)) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('gallery_id', galleryId)
      setFavorites(prev => { const s = new Set(prev); s.delete(galleryId); return s })
      showToast('Removed from favorites', 'info')
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id, gallery_id: galleryId,
        gallery_title: meta?.title ?? null,
        gallery_cover: meta?.cover ?? null,
        gallery_num_pages: meta?.pages ?? null,
      })
      setFavorites(prev => new Set([...prev, galleryId]))
      showToast('Added to favorites ♥', 'success')
    }
  }, [user, favorites, supabase, openAuth, showToast])

  const isFavorite = useCallback((id: number) => favorites.has(id), [favorites])

  return (
    <Ctx.Provider value={{ user, supabase, openAuth, showToast, toggleFavorite, isFavorite }}>
      {children}
      {authOpen && <AuthModal initialTab={authTab} onClose={() => setAuthOpen(false)} onSuccess={() => setAuthOpen(false)} />}
      <ToastContainer toasts={toasts} />
    </Ctx.Provider>
  )
}
