import { NextRequest, NextResponse } from 'next/server'
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
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  try {
    const url = slug[0] === 'gallery' && slug[1] ? `${NH_BASE}/gallery/${slug[1]}` : `${NH_BASE}/${slug.join('/')}`
    const res = await fetch(url, { headers: getHeaders(), next: { revalidate: slug[1] === 'random' ? 0 : 3600 } })
    if (!res.ok) return NextResponse.json({ error: 'API error' }, { status: res.status })
    return NextResponse.json(await res.json())
  } catch { return NextResponse.json({ error: 'Proxy error' }, { status: 502 }) }
}
