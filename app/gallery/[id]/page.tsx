import { notFound } from 'next/navigation'
import Image from 'next/image'
import { coverUrl, getTagsByType, getLangCode, formatDate, formatCount } from '@/lib/nhentai'
import { serverGetGallery } from '@/lib/nhentai-server'
import { GalleryActions } from '@/components/GalleryActions'
import { Reader } from '@/components/Reader'

const TAG_STYLES: Record<string, string> = {
  artist:    'border-purple-500/60 text-purple-400 bg-purple-500/10',
  parody:    'border-blue-500/60 text-blue-400 bg-blue-500/10',
  character: 'border-green-500/60 text-green-400 bg-green-500/10',
  language:  'border-yellow-500/60 text-yellow-400 bg-yellow-500/10',
  category:  'border-red-500/60 text-red-400 bg-red-500/10',
  tag:       'border-border text-muted bg-bg3',
  group:     'border-orange-500/60 text-orange-400 bg-orange-500/10',
}

const LANG_BADGE: Record<string, string> = {
  en: 'bg-blue-900 text-blue-300',
  jp: 'bg-red-900 text-red-300',
  zh: 'bg-green-900 text-green-300',
}

const META_TYPES = [
  { type: 'parody',    label: 'Parody' },
  { type: 'character', label: 'Characters' },
  { type: 'tag',       label: 'Tags' },
  { type: 'artist',    label: 'Artists' },
  { type: 'group',     label: 'Groups' },
  { type: 'language',  label: 'Language' },
  { type: 'category',  label: 'Category' },
] as const

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const gallery = await serverGetGallery(id)
  if (!gallery) notFound()

  const lang  = getLangCode(gallery.tags)
  const cover = coverUrl(gallery)

  return (
    <div>
      <div className="grid gap-10 md:grid-cols-[260px_1fr]">
        <div className="md:sticky md:top-20 self-start">
          <div className="relative aspect-[7/10] rounded-xl overflow-hidden border border-border shadow-2xl">
            <Image
              src={cover}
              alt={gallery.title.pretty}
              fill
              className="object-cover"
              sizes="260px"
              unoptimized
            />
            {LANG_BADGE[lang] && (
              <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${LANG_BADGE[lang]}`}>
                {lang.toUpperCase()}
              </div>
            )}
            <div className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded bg-black/70 text-muted border border-border">{gallery.num_pages}p</div>
          </div>
          <GalleryActions gallery={gallery} />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-1">
            {gallery.title.english || gallery.title.pretty}
          </h1>
          {gallery.title.japanese && (
            <p className="text-sm text-faint italic mb-6">{gallery.title.japanese}</p>
          )}

          <div className="space-y-4 mb-8">
            {META_TYPES.map(({ type, label }) => {
              const tags = getTagsByType(gallery.tags, type)
              if (!tags.length) return null
              return (
                <div key={type} className="flex gap-4 items-start text-sm">
                  <span className="text-faint text-xs uppercase tracking-wide min-w-[100px] pt-1">{label}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(tag => (
                      <a
                        key={tag.id}
                        href={`/search?q=${encodeURIComponent(tag.name)}`}
                        className={`px-2.5 py-1 rounded-full text-xs border transition-all hover:opacity-80 ${TAG_STYLES[type] ?? TAG_STYLES.tag}`}
                      >
                        {tag.name}
                        <span className="ml-1 opacity-50 text-[10px]">{formatCount(tag.count)}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )
            })}
            <div className="flex gap-4 items-center text-sm">
              <span className="text-faint text-xs uppercase tracking-wide min-w-[100px]">Uploaded</span>
              <span className="text-muted">{formatDate(gallery.upload_date)}</span>
            </div>
            <div className="flex gap-4 items-center text-sm">
              <span className="text-faint text-xs uppercase tracking-wide min-w-[100px]">Favorites</span>
              <span className="text-red-400">\u2665 {formatCount(gallery.num_favorites)}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">Pages</h3>
            <Reader gallery={gallery} />
          </div>
        </div>
      </div>
    </div>
  )
}
