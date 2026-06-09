import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileClient } from '@/components/ProfileClient'
import type { Tables } from '@/lib/supabase/types'

type Profile = Tables<'profiles'>

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/?auth=login')

  const [profileResult, favResult, histResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('read_history').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const profile   = (profileResult.data ?? null) as Profile | null
  const favCount  = favResult.count  ?? 0
  const histCount = histResult.count ?? 0

  return (
    <ProfileClient
      user={user}
      profile={profile}
      favCount={favCount}
      histCount={histCount}
    />
  )
}
