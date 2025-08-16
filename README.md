# 🐻🍓 Our Cute Couple Journal (Next.js + Supabase)

A private, adorable journal for two — add moments with photos, date, and captions, then browse them on a cozy timeline.

## ✨ Features (MVP)
- Email magic-link sign-in (Supabase Auth)
- Create/Join **Couple** (share couple code with partner)
- Add **Moments** (date, title, caption, multiple photos)
- Browse **Timeline** (latest moments first)
- Private **Supabase Storage** with signed URLs

## 🧰 Tech
- Next.js (App Router), React, Tailwind CSS
- Supabase (Auth, Postgres, Storage)
- react-hook-form + zod, date-fns, lucide-react
- Image compression on upload

---

## 🚀 Quick Start

### 1) Create Supabase project
- Go to Supabase, create a project
- Create a **storage bucket** named `photos` (keep it **Private**)

### 2) Run SQL (Tables & RLS)
Open Supabase SQL editor and run the files in `/sql` in this order:

1. `schema.sql`
2. `policies.sql`

> These create tables and Row Level Security so only couple members can access their data.

### 3) Configure env
Copy `.env.local.example` to `.env.local` and fill with your values:

```
NEXT_PUBLIC_SUPABASE_URL=...your supabase url...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...your anon key...
NEXT_PUBLIC_SUPABASE_BUCKET=photos
APP_NAME=Our Cute Journal
```

### 4) Install & run
```bash
npm install
npm run dev
# open http://localhost:3000
```

### 5) Setup in the app
- Open `/setup`
- Sign in with your email (magic link)
- Click **Create our couple** to get a couple code; share with your partner
- Your partner logs in and **Join with code**

### 6) Add a moment
- Go to `/moments/new`
- Pick date, add caption, upload photos
- View them in `/timeline`

---

## 🛡️ Notes on Privacy
- Storage bucket `photos` is private; app generates **signed URLs** for display.
- Row Level Security (RLS) ensures only couple members can access rows for their couple.

## 🗺️ Roadmap
- Reactions & comments
- Calendar view
- Anniversary reminders
- Albums & tags
- Export/backup

Enjoy building & cherishing your memories! 💖
