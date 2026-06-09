export type ImageType = 'j' | 'p' | 'g' | 'w'
export interface NHImage { t: ImageType; w: number; h: number }
export interface NHTag { id: number; type: string; name: string; url: string; count: number }
export interface NHGallery {
  id: number; media_id: string
  title: { english: string; japanese: string; pretty: string }
  images: { pages: NHImage[]; cover: NHImage; thumbnail: NHImage }
  scanlator: string; upload_date: number; tags: NHTag[]; num_pages: number; num_favorites: number
}
const EXT: Record<string, string> = { j: 'jpg', p: 'png', g: 'gif', w: 'webp' }
export const coverUrl = (g: NHGallery) => `https://t.nhentai.net/galleries/${g.media_id}/cover.${EXT[g.images.cover.t] || 'jpg'}`
export const thumbnailUrl = (g: NHGallery) => `https://t.nhentai.net/galleries/${g.media_id}/thumbnail.${EXT[g.images.thumbnail.t] || 'jpg'}`
export const pageUrl = (m: string, n: number, t: ImageType) => `https://i.nhentai.net/galleries/${m}/${n}.${EXT[t] || 'jpg'}`
export const thumbPageUrl = (m: string, n: number, t: ImageType) => `https://t.nhentai.net/galleries/${m}/${n}t.${EXT[t] || 'jpg'}`
export const getTagsByType = (tags: NHTag[], type: string) => tags.filter(t => t.type === type)
export const getLangCode = (tags: NHTag[]) => { const l = getTagsByType(tags, 'language')[0]; if (!l) return 'other'; const n = l.name.toLowerCase(); return n.includes('english') ? 'en' : n.includes('japanese') ? 'jp' : n.includes('chinese') ? 'zh' : 'other' }
export const formatDate = (u: number) => new Date(u * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
export const formatCount = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n/1_000).toFixed(1)}k` : String(n)
