import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function FavoritesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/?auth=login')

  const { data: favorites } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">
        ♥ <span className="text-accent">Favorites</span>
        <span className="ml-3 text-lg font-normal text-faint">({favorites?.length || 0})</span>
      </h1>
      {favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map(fav => (
            <a key={fav.id} href={`/gallery/${fav.gallery_id}`} className="block">
              <div className="bg-card border border-border rounded-xl overflow-hidden card-hover">
                <div className="aspect-[7/10] bg-bg4 relative">
                  {fav.gallery_cover ? (
                    <img src={fav.gallery_cover} alt={fav.gallery_title || ''} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-faint text-4xl">✿</div>
                  )}
                  <div className="absolute top-1.5 right-1.5 text-xs font-semibold px-1.5 py-0.5 rounded bg-black/70 text-muted border border-border">{fav.gallery_num_pages}p</div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium leading-snug line-clamp-2 text-[#e8e8f0]">{fav.gallery_title}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-24 text-faint">
          <div className="text-5xl mb-4 opacity-40">♡</div>
          <h3 className="text-lg text-muted mb-2">No favorites yet</h3>
          <p className="text-sm">Heart a doujinshi to save it here</p>
        </div>
      )}
    </div>
  )
}
