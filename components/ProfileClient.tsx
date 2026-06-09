'use client'
import { useApp } from './Providers'
import { useRouter } from 'next/navigation'

export function ProfileClient({ user, profile, favCount, histCount }: { user: any; profile: any; favCount: number; histCount: number }) {
  const { supabase, showToast } = useApp()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    showToast('Signed out', 'info')
    router.push('/')
    router.refresh()
  }

  const letter = (profile?.username?.[0] || user.email?.[0] || '?').toUpperCase()

  return (
    <div>
      <div className="flex items-center gap-6 p-7 bg-bg3 rounded-2xl border border-border mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-purple flex items-center justify-center text-3xl font-extrabold text-white flex-shrink-0">{letter}</div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold truncate">{profile?.username || 'User'}</h2>
          <p className="text-sm text-faint">{user.email}</p>
          <div className="flex gap-6 mt-3">
            <div><div className="text-xl font-extrabold text-accent">{favCount}</div><div className="text-xs text-faint">Favorites</div></div>
            <div><div className="text-xl font-extrabold text-accent">{histCount}</div><div className="text-xs text-faint">Read</div></div>
          </div>
        </div>
        <button onClick={handleLogout} className="px-5 py-2 border border-red-500/50 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all self-start flex-shrink-0">Sign Out</button>
      </div>
      <h3 className="text-lg font-bold mb-5"><a href="/favorites" className="hover:text-accent transition-colors">↗ View Favorites →</a></h3>
    </div>
  )
}
