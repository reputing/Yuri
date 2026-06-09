import type { NHGallery, ImageType } from './nhentai'
const NH_BASE = 'https://nhentai.net/api'
function getHeaders() {
  const h: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://nhentai.net/',
  }
  if (process.env.NHENTAI_SESSION_COOKIE) h['Cookie'] = `sessionid=${process.env.NHENTAI_SESSION_COOKIE}`
  return h
}
function extToType(t: string): ImageType {
  if (t === 'p') return 'p'
  if (t === 'g') return 'g'
  if (t === 'w') return 'w'
  return 'j'
}
function adapt(g: any): NHGallery {
  const mediaId = String(g.media_id ?? g.mediaId ?? g.id)
  return {
    id: g.id, media_id: mediaId,
    title: { english: g.title?.english ?? '', japanese: g.title?.japanese ?? '', pretty: g.title?.pretty ?? '' },
    images: {
      pages: (g.images?.pages ?? []).map((p: any) => ({ t: extToType(p.t || 'j'), w: p.w || 0, h: p.h || 0 })),
      cover: { t: extToType(g.images?.cover?.t || 'j'), w: g.images?.cover?.w || 0, h: g.images?.cover?.h || 0 },
      thumbnail: { t: extToType(g.images?.thumbnail?.t || 'j'), w: g.images?.thumbnail?.w || 0, h: g.images?.thumbnail?.h || 0 },
    },
    scanlator: g.scanlator || '', upload_date: g.upload_date || 0,
    tags: (g.tags || []).map((t: any) => ({ id: t.id || 0, type: t.type || 'tag', name: t.name || '', url: t.url || '', count: t.count || 0 })),
    num_pages: g.num_pages || g.images?.pages?.length || 0,
    num_favorites: g.num_favorites || 0,
  }
}
export async function serverSearchGalleries(query = '', page = 1, sort = 'recent') {
  try {
    const params = new URLSearchParams({ query, page: String(page), sort })
    const res = await fetch(`${NH_BASE}/galleries/search?${params}`, { headers: getHeaders(), next: { revalidate: 300 } })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    return { result: (data.result || []).map(adapt), num_pages: data.num_pages || 1 }
  } catch (e) { console.error('[nhentai] search error:', e); return { result: [], num_pages: 0 } }
}
export async function serverGetGallery(id: string) {
  try {
    const res = await fetch(`${NH_BASE}/gallery/${id}`, { headers: getHeaders(), next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()
    return adapt(data.gallery || data)
  } catch (e) { console.error('[nhentai] gallery error:', e); return null }
}
