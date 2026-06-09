'use client'
import { GalleryCard } from './GalleryCard'
import type { NHGallery } from '@/lib/nhentai'

export function GalleryGrid({ galleries }: { galleries: NHGallery[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {galleries.map(g => <GalleryCard key={g.id} gallery={g} />)}
    </div>
  )
}
