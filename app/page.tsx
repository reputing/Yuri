import React from 'react'
import { GalleryGrid } from '@/components/GalleryGrid'
import { HeroSection } from '@/components/HeroSection'
import { serverSearchGalleries } from '@/lib/nhentai-server'
export default async function HomePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1
  const [recent, popular] = await Promise.all([
    serverSearchGalleries('', page, 'recent'),
    serverSearchGalleries('', 1, 'popular'),
  ])
  return (
    <div>
      <HeroSection />
      {popular.result.length > 0 && (
        <section className="mb-12">
          <SectionHeader title="🔥 Popular" href="/search?sort=popular" />
          <GalleryGrid galleries={popular.result.slice(0, 12)} />
        </section>
      )}
      <section>
        <SectionHeader title="🕐 Recently Added" href="/search?sort=recent" />
        {recent.result.length > 0 ? (
          <><GalleryGrid galleries={recent.result} /><Pagination current={page} total={recent.num_pages} /></>
        ) : (
          <div className="flex flex-col items-center py-24 text-faint">
            <div className="text-5xl mb-4 opacity-40">✿</div>
            <h3 className="text-lg text-muted mb-2">Could not reach nhentai</h3>
            <p className="text-sm">Add a NHENTAI_SESSION_COOKIE env var</p>
          </div>
        )}
      </section>
    </div>
  )
}
function SectionHeader({ title, href }: { title: string; href: string }) {
  return <div className="flex items-center justify-between mb-5"><h2 className="text-xl font-bold">{title}</h2><a href={href} className="text-sm text-faint hover:text-accent transition-colors">See all →</a></div>
}
function Pagination({ current, total }: { current: number; total: number }) {
  if (total <= 1) return null
  const cls = (a: boolean) => 'min-w-[36px] h-9 px-2 rounded-md border text-sm font-medium flex items-center justify-center transition-all ' + (a ? 'bg-accent border-accent text-white' : 'bg-bg3 border-border text-muted hover:border-accent hover:text-accent')
  const start = Math.max(1, current - 2), end = Math.min(total, current + 2)
  const pages: React.ReactNode[] = []
  if (start > 1) { pages.push(<a key={1} href="/?page=1" className={cls(false)}>1</a>); if (start > 2) pages.push(<span key="el" className="text-faint px-1">…</span>) }
  for (let i = start; i <= end; i++) pages.push(<a key={i} href={`/?page=${i}`} className={cls(i === current)}>{i}</a>)
  if (end < total) { if (end < total - 1) pages.push(<span key="er" className="text-faint px-1">…</span>); pages.push(<a key={total} href={`/?page=${total}`} className={cls(false)}>{total}</a>) }
  return <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">{current > 1 && <a href={`/?page=${current - 1}`} className={cls(false)}>‹</a>}{pages}{current < total && <a href={`/?page=${current + 1}`} className={cls(false)}>›</a>}</div>
}
