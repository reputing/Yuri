import type { NHGallery, NHSearchResult } from './nhentai'

function getHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Referer':    'https://nhentai.net/',
    'Accept':     'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
  }
  if (process.env.NHENTAI_SESSION_COOKIE) {
    h['Cookie'] = `sessionid=${process.env.NHENTAI_SESSION_COOKIE}`
  }
  return h
}

export async function serverSearchGalleries(
  query = '',
  page  = 1,
  sort  = 'recent'
): Promise<{ result: NHGallery[]; num_pages: number }> {
  try {
    const params = new URLSearchParams({ query, page: String(page), sort })
    const res = await fetch(
      `https://nhentai.net/api/galleries/search?${params}`,
      { headers: getHeaders(), next: { revalidate: sort.startsWith('popular') ? 3600 : 300 } }
    )
    if (!res.ok) return { result: [], num_pages: 0 }
    return res.json() as Promise<NHSearchResult>
  } catch {
    return { result: [], num_pages: 0 }
  }
}

export async function serverGetGallery(id: string): Promise<NHGallery | null> {
  try {
    const res = await fetch(
      `https://nhentai.net/api/gallery/${id}`,
      { headers: getHeaders(), next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    return res.json() as Promise<NHGallery>
  } catch {
    return null
  }
}

export async function serverRandomGallery(): Promise<NHGallery | null> {
  try {
    const res = await fetch(
      'https://nhentai.net/api/gallery/random',
      { headers: getHeaders(), cache: 'no-store' }
    )
    if (!res.ok) return null
    return res.json() as Promise<NHGallery>
  } catch {
    return null
  }
}
