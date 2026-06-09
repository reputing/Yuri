import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://nhentai.net/api'

function getHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Referer':    'https://nhentai.net/',
    'Accept':     'application/json, text/plain, */*',
  }
  if (process.env.NHENTAI_SESSION_COOKIE) {
    h['Cookie'] = `sessionid=${process.env.NHENTAI_SESSION_COOKIE}`
  }
  return h
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const path   = slug.join('/')
  const search = req.nextUrl.searchParams.toString()
  const url    = `${BASE}/${path}${search ? `?${search}` : ''}`

  try {
    const res = await fetch(url, { headers: getHeaders(), next: { revalidate: 3600 } })
    if (!res.ok) return NextResponse.json({ error: 'API error', status: res.status }, { status: res.status })
    const data = await res.json()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    })
  } catch (err) {
    console.error('nhentai proxy error:', err)
    return NextResponse.json({ error: 'Proxy error' }, { status: 502 })
  }
}
