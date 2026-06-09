'use client'
import { useApp } from './Providers'
import { coverUrl, getLangCode, formatCount, type NHGallery } from '@/lib/nhentai'

export function GalleryCard({ gallery }: { gallery: NHGallery }) {
  const { toggleFavorite, isFavorite } = useApp()
  const cover = coverUrl(gallery)
  const lang  = getLangCode(gallery.tags)
  const faved = isFavorite(gallery.id)

  const LANG_BADGE: Record<string, string> = {
    en: 'bg-blue-900 text-blue-300',
    jp: 'bg-red-900 text-red-300',
    zh: 'bg-green-900 text-green-300',
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden card-hover group cursor-pointer relative">
      <a href={`/gallery/${gallery.id}`} className="block">
        <div className="relative aspect-[7/10] bg-bg4 overflow-hidden">
          <img src={cover} alt={gallery.title.pretty} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          {LANG_BADGE[lang] && (
            <span className={`absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${LANG_BADGE[lang]}`}>{lang.toUpperCase()}</span>
          )}
          <span className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/70 text-muted border border-border">{gallery.num_pages}p</span>
          <div className="absolute bottom-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={e => { e.preventDefault(); toggleFavorite(gallery.id, { title: gallery.title.english || gallery.title.pretty, cover, pages: gallery.num_pages }) }}
              className={'w-8 h-8 rounded-md flex items-center justify-center text-sm transition-all ' +
                (faved ? 'bg-red-500 text-white' : 'bg-black/50 text-white/70 hover:bg-red-500 hover:text-white')}
            >{faved ? '♥' : '♡'}</button>
          </div>
        </div>
      </a>
      <div className="px-3 py-2.5">
        <a href={`/gallery/${gallery.id}`} className="block">
          <p className="text-xs font-medium leading-snug line-clamp-2 text-[#e8e8f0] hover:text-accent transition-colors">
            {gallery.title.english || gallery.title.pretty}
          </p>
        </a>
        <div className="flex items-center justify-between mt-1.5 text-[10px] text-faint">
          <span>{new Date(gallery.upload_date * 1000).getFullYear()}</span>
          <span className="text-red-400">♥ {formatCount(gallery.num_favorites)}</span>
        </div>
      </div>
    </div>
  )
}
