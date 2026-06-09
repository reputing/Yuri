import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileClient } from '@/components/ProfileClient'
export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/?auth=login')
  const [{ data: profile }, { count: favCount }, { count: histCount }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('read_history').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ])
  return <ProfileClient user={user} profile={profile} favCount={favCount ?? 0} histCount={histCount ?? 0} />
}
