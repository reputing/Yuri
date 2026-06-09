'use client'
import { useState } from 'react'
import { useApp } from './Providers'
import { coverUrl, type NHGallery } from '@/lib/nhentai'
import { ReaderModal } from './Reader'

export function GalleryActions({ gallery }: { gallery: NHGallery }) {
  const { toggleFavorite, isFavorite } = useApp()
  const [readerOpen, setReaderOpen] = useState(false)
  const faved = isFavorite(gallery.id)
  const cover = coverUrl(gallery)

  return (
    <>
      <div className="flex flex-col sm:flex-row md:flex-col gap-2 mt-4">
        <button onClick={() => setReaderOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 font-bold text-white rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #e91e8c, #b5179e)' }}>
          ▶ Read Now
        </button>
        <button
          onClick={() => toggleFavorite(gallery.id, { title: gallery.title.english || gallery.title.pretty, cover, pages: gallery.num_pages })}
          className={'flex-1 flex items-center justify-center gap-2 py-3 font-semibold rounded-lg border transition-all ' +
            (faved ? 'border-red-500 text-red-400 bg-red-500/10 hover:bg-red-500/20' : 'border-border text-muted hover:border-red-400 hover:text-red-400')}>
          {faved ? '♥ Favorited' : '♡ Favorite'}
        </button>
      </div>
      {readerOpen && <ReaderModal gallery={gallery} onClose={() => setReaderOpen(false)} />}
    </>
  )
}
