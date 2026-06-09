export type ImageType = 'j' | 'p' | 'g'

export interface NHImage { t: ImageType; w: number; h: number }

export interface NHTag {
  id: number
  type: 'tag' | 'artist' | 'parody' | 'character' | 'language' | 'group' | 'category'
  name: string
  url: string
  count: number
}

export interface NHGallery {
  id: number
  media_id: string
  title: { english: string; japanese: string; pretty: string }
  images: { pages: NHImage[]; cover: NHImage; thumbnail: NHImage }
  scanlator: string
  upload_date: number
  tags: NHTag[]
  num_pages: number
  num_favorites: number
}

export interface NHSearchResult { result: NHGallery[]; num_pages: number; per_page: number }

const EXT: Record<ImageType, string> = { j: 'jpg', p: 'png', g: 'gif' }

export const coverUrl     = (g: NHGallery) => `https://t.nhentai.net/galleries/${g.media_id}/cover.${EXT[g.images.cover.t]}`
export const thumbnailUrl = (g: NHGallery) => `https://t.nhentai.net/galleries/${g.media_id}/thumbnail.${EXT[g.images.thumbnail.t]}`
export const pageUrl      = (mediaId: string, pageNum: number, ext: ImageType) => `https://i.nhentai.net/galleries/${mediaId}/${pageNum}.${EXT[ext]}`
export const thumbPageUrl = (mediaId: string, pageNum: number, ext: ImageType) => `https://t.nhentai.net/galleries/${mediaId}/${pageNum}t.${EXT[ext]}`
export const getTagsByType = (tags: NHTag[], type: NHTag['type']) => tags.filter(t => t.type === type)
export const getLanguage   = (tags: NHTag[]) => { const l = getTagsByType(tags, 'language')[0]; return l ? l.name.charAt(0).toUpperCase() + l.name.slice(1) : 'Unknown' }
export const getLangCode   = (tags: NHTag[]) => { const l = getTagsByType(tags, 'language')[0]; if (!l) return 'other'; const n = l.name.toLowerCase(); return n.includes('english') ? 'en' : n.includes('japanese') ? 'jp' : n.includes('chinese') ? 'zh' : 'other' }
export const formatDate    = (unix: number) => new Date(unix * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
export const formatCount   = (n: number) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n/1_000).toFixed(1)}k` : String(n)
