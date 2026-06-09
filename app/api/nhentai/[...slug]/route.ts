import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://nhentai.net/api'

const HEADERS: HeadersInit = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Referer': 'https://nhentai.net/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
}

if (process.env.NHENTAI_SESSION_COOKIE) {
  (HEADERS as Record<string, string>)['Cookie'] = `sessionid=${process.env.NHENTAI_SESSION_COOKIE}`
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug.join('/')
  const search = req.nextUrl.searchParams.toString()
  const url = `${BASE}/${slug}${search ? `?${search}` : ''}`

  try {
    const res = await fetch(url, {
      headers: HEADERS,
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'API request failed', status: res.status },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    })
  } catch (err) {
    console.error('nhentai proxy error:', err)
    return NextResponse.json({ error: 'Proxy error' }, { status: 502 })
  }
}
