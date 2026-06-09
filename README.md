# ✿ Yuri — Manga Library

A beautiful, full-featured manga/doujinshi library powered by nhentai, built with Next.js 14, Supabase, and deployed on Vercel.

## Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Framework  | Next.js 14 (App Router)       |
| Auth & DB  | Supabase (PostgreSQL + Auth)  |
| Styling    | Tailwind CSS                  |
| Deploy     | Vercel                        |
| API        | nhentai (proxied server-side) |

## Features

- 🔥 Browse recent & popular doujinshi
- 🔍 Full search with sort options (recent, popular, today, week, month)
- 📖 In-browser reader with keyboard navigation (←/→) & thumbnail strip
- ♥ Favorites — saved per user via Supabase
- 🔐 Auth — register / login via Supabase Auth (email + password)
- 🛡️ All nhentai API calls proxied server-side — zero CORS issues
- ⚡ ISR caching: gallery pages cache for 1h, home page 5min

## Setup

### 1. Clone & install

```bash
git clone https://github.com/reputing/yuri
cd yuri
npm install
```

### 2. Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_init.sql` in the SQL Editor
3. Copy your Project URL and anon key

### 3. Environment

```bash
cp .env.local.example .env.local
```

Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional but recommended
NHENTAI_SESSION_COOKIE=your_session_id_here
```

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy to Vercel

```bash
npx vercel
```

Set the same env vars in your Vercel project settings.

> **Note:** nhentai has Cloudflare protection. The `NHENTAI_SESSION_COOKIE` significantly improves API reliability.

## Project Structure

```
├── app/
│   ├── page.tsx              # Homepage
│   ├── search/page.tsx       # Search results
│   ├── gallery/[id]/page.tsx # Gallery detail + reader
│   ├── favorites/page.tsx    # Favorites (auth required)
│   ├── profile/page.tsx      # Profile (auth required)
│   └── api/nhentai/[...slug] # nhentai proxy (server-side)
├── components/
│   ├── Providers.tsx         # Supabase auth context
│   ├── AuthModal.tsx         # Login/register modal
│   ├── GalleryCard.tsx       # Gallery card
│   ├── Reader.tsx            # Full-screen reader
│   └── ...
├── lib/
│   ├── nhentai.ts
│   └── supabase/
└── supabase/migrations/
```
