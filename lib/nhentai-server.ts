/* eslint-disable @typescript-eslint/no-explicit-any */
import * as nhentaiLib from 'nhentai'
import type { NHGallery, ImageType } from './nhentai'

const api = new nhentaiLib.API()

function urlToType(url: string): ImageType {
  if (url.endsWith('.webp')) return 'w'
  if (url.endsWith('.png'))  return 'p'
  if (url.endsWith('.gif'))  return 'g'
  return 'j'
}

function extractMediaId(urls: string[]): string {
  for (const url of urls) {
    const m = url.match(/\/galleries\/(\d+)\//)
    if (m) return m[1]
  }
  return ''
}

function adaptDoujin(d: any): NHGallery {
  const pageUrls: string[] = (d.pages ?? []).map((p: any) => String(p.url ?? ''))
  const coverUrl  = String(d.cover?.url  ?? '')
  const thumbUrl  = String(d.thumbnail?.url ?? coverUrl)
  const mediaId   = extractMediaId([coverUrl, thumbUrl, ...pageUrls])

  return {
    id:       d.id,
    media_id: mediaId || String(d.mediaId ?? d.id),
    title: {
      english:  d.titles?.english  ?? d.titles?.pretty ?? '',
      japanese: d.titles?.japanese ?? '',
      pretty:   d.titles?.pretty   ?? '',
    },
    images: {
      pages:     pageUrls.map((url) => ({ t: urlToType(url), w: 0, h: 0, url })),
      cover:     { t: urlToType(coverUrl), w: 0, h: 0, url: coverUrl },
      thumbnail: { t: urlToType(thumbUrl), w: 0, h: 0, url: thumbUrl },
    },
    scanlator:    '',
    upload_date:  d.uploadDate instanceof Date
      ? Math.floor(d.uploadDate.getTime() / 1000)
      : (Number(d.uploadDate) || 0),
    tags: (d.tags?.all ?? d.tags ?? []).map((tag: any) => ({
      id:    tag.id    ?? 0,
      type:  tag.type  ?? 'tag',
      name:  tag.name  ?? '',
      url:   tag.url   ?? '',
      count: tag.count ?? 0,
    })),
    num_pages:     d.numPages    ?? pageUrls.length,
    num_favorites: d.numFavorites ?? 0,
  }
}

export async function serverSearchGalleries(
  query = '',
  page  = 1,
  sort  = 'recent'
): Promise<{ result: NHGallery[]; num_pages: number }> {
  try {
    const res: any = query
      ? await api.search(query, page, sort as any)
      : await api.fetchHomepage(page, sort as any)

    const doujins  = res.doujins  ?? res.result  ?? []
    const numPages = res.numPages ?? res.num_pages ?? 1

    return { result: doujins.map(adaptDoujin), num_pages: Number(numPages) }
  } catch (err) {
    console.error('[nhentai] search error:', err)
    return { result: [], num_pages: 0 }
  }
}

export async function serverGetGallery(id: string): Promise<NHGallery | null> {
  try {
    const d = await api.fetchDoujin(Number(id))
    if (!d) return null
    return adaptDoujin(d)
  } catch (err) {
    console.error('[nhentai] gallery error:', err)
    return null
  }
}

export async function serverRandomGallery(): Promise<NHGallery | null> {
  try {
    const d = await api.randomDoujin()
    if (!d) return null
    return adaptDoujin(d)
  } catch {
    return null
  }
}
