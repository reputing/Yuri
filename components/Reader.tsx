'use client'
import { useState, useEffect, useCallback } from 'react'
import { pageUrl, thumbPageUrl, type NHGallery } from '@/lib/nhentai'
export function Reader({ gallery }: { gallery: NHGallery }) {
  const [open, setOpen] = useState(false)
  const [startPage, setStartPage] = useState(1)
  return (
    <>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {gallery.images.pages.map((p, i) => (
          <button key={i} onClick={() => { setStartPage(i + 1); setOpen(true) }}
            className="aspect-[7/10] rounded-md overflow-hidden border-2 border-transparent hover:border-accent transition-colors group relative">
            <img src={thumbPageUrl(gallery.media_id, i + 1, p.t)} alt={`Page ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-end justify-end p-1 opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-[9px] font-bold bg-black/70 text-white px-1 rounded">{i + 1}</span></div>
          </button>
        ))}
      </div>
      {open && <ReaderModal gallery={gallery} initialPage={startPage} onClose={() => setOpen(false)} />}
    </>
  )
}
export function ReaderModal({ gallery, initialPage = 1, onClose }: { gallery: NHGallery; initialPage?: number; onClose: () => void }) {
  const pages = gallery.images.pages, total = pages.length
  const [current, setCurrent] = useState(initialPage)
  const [loading, setLoading] = useState(true)
  const [fitMode, setFitMode] = useState<'contain' | 'width'>('contain')
  const go = useCallback((d: number) => { setCurrent(p => { const n = p + d; if (n < 1 || n > total) return p; setLoading(true); return n }) }, [total])
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'ArrowLeft' || e.key === 'a') go(-1); if (e.key === 'ArrowRight' || e.key === 'd') go(1); if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [go, onClose])
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = '' } }, [])
  const p = pages[current - 1], src = p ? pageUrl(gallery.media_id, current, p.t) : '', title = gallery.title.english || gallery.title.pretty
  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col">
      <div className="flex items-center gap-3 px-4 h-[52px] bg-black/90 border-b border-border/50 flex-shrink-0">
        <button onClick={onClose} className="w-9 h-9 rounded-md bg-bg4 border border-border flex items-center justify-center text-muted hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex-shrink-0">✕</button>
        <span className="flex-1 text-xs text-muted truncate">{title}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setFitMode(m => m === 'contain' ? 'width' : 'contain')} className="w-8 h-8 rounded bg-bg4 border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-all text-xs font-bold">⇔</button>
          <span className="text-sm font-semibold text-muted min-w-[52px] text-right">{current}/{total}</span>
        </div>
      </div>
      <div className="flex-1 flex items-center relative overflow-hidden">
        <button onClick={() => go(-1)} disabled={current === 1} className="absolute left-2 z-10 w-12 h-20 rounded-lg bg-black/60 border border-border/50 flex items-center justify-center text-muted hover:bg-accent hover:text-white hover:border-accent disabled:opacity-20 transition-all">‹</button>
        <div className="flex-1 h-full flex items-center justify-center overflow-auto" onClick={e => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); go(e.clientX - r.left > r.width / 2 ? 1 : -1) }}>
          {loading && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="spinner" /></div>}
          <img key={src} src={src} alt={`Page ${current}`} draggable={false}
            className={`select-none transition-opacity duration-150 ${fitMode === 'width' ? 'w-full h-auto' : 'max-w-full max-h-full'} ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
        </div>
        <button onClick={() => go(1)} disabled={current === total} className="absolute right-2 z-10 w-12 h-20 rounded-lg bg-black/60 border border-border/50 flex items-center justify-center text-muted hover:bg-accent hover:text-white hover:border-accent disabled:opacity-20 transition-all">›</button>
      </div>
      <div className="bg-black/90 border-t border-border/50 overflow-x-auto flex-shrink-0">
        <div className="flex gap-1.5 p-2 min-h-[68px] items-center">
          {pages.map((p, i) => (
            <button key={i} onClick={() => { setCurrent(i + 1); setLoading(true) }}
              className={`flex-shrink-0 w-10 h-14 rounded overflow-hidden border-2 transition-all ${i + 1 === current ? 'border-accent opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}>
              <img src={thumbPageUrl(gallery.media_id, i + 1, p.t)} alt={`${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
