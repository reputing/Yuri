import React from 'react'
import { GalleryGrid } from '@/components/GalleryGrid'
import { serverSearchGalleries } from '@/lib/nhentai-server'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>
}) {
  const { q, page: pageParam, sort: sortParam } = await searchParams
  const query = q || ''
  const page  = Number(pageParam) || 1
  const sort  = sortParam || 'recent'
  const data  = await serverSearchGalleries(query, page, sort)

  const sorts = [
    { value: 'recent',        label: 'Recent' },
    { value: 'popular',       label: 'Popular' },
    { value: 'popular-today', label: 'Today' },
    { value: 'popular-week',  label: 'This Week' },
    { value: 'popular-month', label: 'This Month' },
  ]

  const buildUrl = (p: number, s: string) =>
    `/search?${new URLSearchParams({ q: query, page: String(p), sort: s })}`

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">
          {query
            ? <span>Results for <span className="text-accent">&quot;{query}&quot;</span></span>
            : 'Browse All'}
        </h1>
        {data.num_pages > 0 && (
          <p className="text-sm text-faint">Page {page} of {data.num_pages.toLocaleString()}</p>
        )}
        <div className="flex gap-2 flex-wrap mt-4 items-center">
          <span className="text-sm text-faint mr-1">Sort:</span>
          {sorts.map(s => (
            <a key={s.value} href={buildUrl(1, s.value)}
              className={'px-3 py-1.5 rounded-full text-sm border transition-all ' +
                (sort === s.value
                  ? 'bg-accent/20 border-accent text-accent'
                  : 'bg-bg3 border-border text-muted hover:border-accent hover:text-accent')}
            >{s.label}</a>
          ))}
        </div>
      </div>

      {data.result.length > 0 ? (
        <>
          <GalleryGrid galleries={data.result} />
          <Pagination current={page} total={data.num_pages} builder={buildUrl} sort={sort} />
        </>
      ) : (
        <div className="flex flex-col items-center py-24 text-faint">
          <div className="text-5xl mb-4 opacity-40">\uD83D\uDD0D</div>
          <h3 className="text-lg text-muted mb-2">No results found</h3>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  )
}

function Pagination({
  current, total, builder, sort,
}: {
  current: number; total: number
  builder: (p: number, s: string) => string; sort: string
}) {
  if (total <= 1) return null

  const cls = (active: boolean) =>
    'min-w-[36px] h-9 px-2 rounded-md border text-sm font-medium flex items-center justify-center transition-all ' +
    (active ? 'bg-accent border-accent text-white' : 'bg-bg3 border-border text-muted hover:border-accent hover:text-accent')

  const start = Math.max(1, current - 2)
  const end   = Math.min(total, current + 2)
  const pages: React.ReactNode[] = []

  if (start > 1) {
    pages.push(<a key={1} href={builder(1, sort)} className={cls(false)}>1</a>)
    if (start > 2) pages.push(<span key="el" className="text-faint px-1">\u2026</span>)
  }
  for (let i = start; i <= end; i++) {
    pages.push(<a key={i} href={builder(i, sort)} className={cls(i === current)}>{i}</a>)
  }
  if (end < total) {
    if (end < total - 1) pages.push(<span key="er" className="text-faint px-1">\u2026</span>)
    pages.push(<a key={total} href={builder(total, sort)} className={cls(false)}>{total}</a>)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
      {current > 1 && <a href={builder(current - 1, sort)} className={cls(false)}>\u2039</a>}
      {pages}
      {current < total && <a href={builder(current + 1, sort)} className={cls(false)}>\u203A</a>}
    </div>
  )
}
