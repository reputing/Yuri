-- Yuri — Supabase Migration 001

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username    TEXT        UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id                 UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id            UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  gallery_id         INTEGER     NOT NULL,
  gallery_title      TEXT,
  gallery_cover      TEXT,
  gallery_num_pages  INTEGER,
  added_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, gallery_id)
);

CREATE TABLE IF NOT EXISTS public.read_history (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  gallery_id INTEGER     NOT NULL,
  last_page  INTEGER     DEFAULT 1,
  num_pages  INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, gallery_id)
);

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.read_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile_select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profile_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "favorites_all"  ON public.favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "history_all"    ON public.read_history FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
