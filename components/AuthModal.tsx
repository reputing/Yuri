'use client'
import { useState, useEffect } from 'react'
import { useApp } from './Providers'

interface Props {
  initialTab: 'login' | 'register'
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ initialTab, onClose, onSuccess }: Props) {
  const { supabase, showToast } = useApp()
  const [tab, setTab] = useState(initialTab)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPw, setLoginPw] = useState('')
  const [regUser, setRegUser] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPw, setRegPw] = useState('')
  const [pwShow, setPwShow] = useState(false)
  const [pwStrength, setPwStrength] = useState(0)

  useEffect(() => {
    const s = (regPw.length >= 8 ? 1 : 0) + (/[A-Z]/.test(regPw) ? 1 : 0) + (/[0-9]/.test(regPw) ? 1 : 0) + (/[^A-Za-z0-9]/.test(regPw) ? 1 : 0)
    setPwStrength(s)
  }, [regPw])

  useEffect(() => { setErr('') }, [tab])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPw })
    setLoading(false)
    if (error) { setErr(error.message); return }
    showToast('Welcome back! ✿', 'success')
    onSuccess()
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (regPw.length < 8) { setErr('Password must be at least 8 characters'); return }
    setLoading(true); setErr('')
    const { error } = await supabase.auth.signUp({ email: regEmail, password: regPw, options: { data: { username: regUser } } })
    setLoading(false)
    if (error) { setErr(error.message); return }
    showToast('Account created! Check your email to confirm ✿', 'success')
    onSuccess()
  }

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-in relative z-10 bg-bg2 border border-border2 rounded-2xl p-8 w-full max-w-[420px] shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-md bg-bg4 border border-border flex items-center justify-center text-muted hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-accent accent-glow text-2xl">✿</span>
          <span className="text-2xl font-extrabold tracking-[3px] text-gradient">YURI</span>
        </div>

        <div className="flex gap-1 bg-bg3 rounded-lg p-1 mb-6">
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={'flex-1 py-2 rounded-md text-sm font-semibold transition-all ' + (tab === t ? 'bg-bg4 text-[#e8e8f0] shadow' : 'text-faint hover:text-muted')}>
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Email">
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email"
                className="w-full px-3.5 py-2.5 bg-bg3 border border-border rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition placeholder:text-faint" />
            </Field>
            <Field label="Password">
              <PwField value={loginPw} onChange={setLoginPw} show={pwShow} onToggle={() => setPwShow(!pwShow)} autocomplete="current-password" />
            </Field>
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-accent hover:bg-accent2 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <p className="text-center text-xs text-faint">No account? <button type="button" onClick={() => setTab('register')} className="text-accent hover:underline">Register</button></p>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <Field label="Username">
              <input type="text" value={regUser} onChange={e => setRegUser(e.target.value)} placeholder="sakura_chan" required minLength={3} maxLength={24} autoComplete="username"
                className="w-full px-3.5 py-2.5 bg-bg3 border border-border rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition placeholder:text-faint" />
            </Field>
            <Field label="Email">
              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email"
                className="w-full px-3.5 py-2.5 bg-bg3 border border-border rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition placeholder:text-faint" />
            </Field>
            <Field label="Password">
              <PwField value={regPw} onChange={setRegPw} show={pwShow} onToggle={() => setPwShow(!pwShow)} autocomplete="new-password" />
              {regPw.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-bg4 rounded overflow-hidden">
                    <div className={`h-full rounded transition-all duration-300 ${strengthColors[pwStrength - 1] || 'bg-red-500'}`} style={{ width: `${(pwStrength / 4) * 100}%` }} />
                  </div>
                  <span className="text-xs text-faint">{strengthLabels[pwStrength - 1] || 'Weak'}</span>
                </div>
              )}
            </Field>
            {err && <p className="text-red-400 text-xs">{err}</p>}
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-accent hover:bg-accent2 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            <p className="text-center text-xs text-faint">Have an account? <button type="button" onClick={() => setTab('login')} className="text-accent hover:underline">Sign in</button></p>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

function PwField({ value, onChange, show, onToggle, autocomplete }: { value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; autocomplete: string }) {
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
        placeholder="••••••••" required minLength={8} autoComplete={autocomplete}
        className="w-full px-3.5 py-2.5 pr-10 bg-bg3 border border-border rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition placeholder:text-faint" />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-accent transition-colors">
        {show
          ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        }
      </button>
    </div>
  )
}
