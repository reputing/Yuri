/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import * as nhentaiLib from 'nhentai'

const api = new nhentaiLib.API()

function urlToType(url: string) {
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

function adaptDoujin(d: any) {
  const pageUrls: string[] = (d.pages ?? []).map((p: any) => String(p.url ?? ''))
  const coverUrl = String(d.cover?.url ?? '')
  const mediaId  = extractMediaId([coverUrl, ...pageUrls])
  return {
    id: d.id,
    media_id: mediaId || String(d.mediaId ?? d.id),
    title: { english: d.titles?.english ?? '', japanese: d.titles?.japanese ?? '', pretty: d.titles?.pretty ?? '' },
    images: {
      pages: pageUrls.map((url) => ({ t: urlToType(url), w: 0, h: 0, url })),
      cover:     { t: urlToType(coverUrl), w: 0, h: 0, url: coverUrl },
      thumbnail: { t: urlToType(coverUrl), w: 0, h: 0, url: coverUrl },
    },
    scanlator: '',
    upload_date: d.uploadDate instanceof Date ? Math.floor(d.uploadDate.getTime() / 1000) : (Number(d.uploadDate) || 0),
    tags: (d.tags?.all ?? d.tags ?? []).map((t: any) => ({ id: t.id ?? 0, type: t.type ?? 'tag', name: t.name ?? '', url: t.url ?? '', count: t.count ?? 0 })),
    num_pages: d.numPages ?? pageUrls.length,
    num_favorites: d.numFavorites ?? 0,
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  try {
    if (slug[0] === 'gallery' && slug[1] === 'random') {
      const d = await api.randomDoujin()
      return NextResponse.json(adaptDoujin(d))
    }
    if (slug[0] === 'gallery' && slug[1]) {
      const d = await api.fetchDoujin(Number(slug[1]))
      if (!d) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(adaptDoujin(d))
    }
    return NextResponse.json({ error: 'Unknown route' }, { status: 400 })
  } catch (err) {
    console.error('[nhentai route]', err)
    return NextResponse.json({ error: 'API error' }, { status: 502 })
  }
}
