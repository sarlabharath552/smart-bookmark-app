# 🔖 Smart Bookmark Manager

🚀 A fullstack real-time bookmark management application built using **Next.js (App Router)** and **Supabase**.

🌐 **Live Demo:**  
https://smart-bookmark-app-nine.vercel.app

---

## 📌 Overview

Smart Bookmark Manager allows users to securely save and manage personal bookmarks with real-time updates.

Each user:
- Authenticates via Google OAuth
- Can add and delete their own bookmarks
- Sees live updates across multiple browser tabs
- Cannot access other users’ data (secured with Row Level Security)

The application is production-ready and deployed on Vercel.

---

## 🛠 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

### Backend & Database
- Supabase (PostgreSQL)
- Supabase Auth (Google OAuth)
- Supabase Realtime (Postgres Changes)

### Deployment
- Vercel

---

## ✨ Features

- 🔐 Google OAuth Authentication
- 🗂 Personal bookmark storage
- ➕ Add bookmarks
- ❌ Delete bookmarks
- ⚡ Real-time multi-tab synchronization
- 🔒 Row Level Security (RLS)
- 🎨 Clean, responsive UI
- 🌍 Production deployment

---

## 🔐 Security Architecture

### Row Level Security (RLS)

The `bookmarks` table uses strict RLS policies to ensure user-level data isolation.

Policy used:

```sql
auth.uid() = user_id
```

This guarantees:
- Users can only view their own bookmarks
- Users can only insert bookmarks for themselves
- Users can only delete their own bookmarks

No shared or exposed data between users.

---

## ⚡ Realtime Implementation

The application listens to database changes using Supabase's realtime subscription:

```ts
supabase
  .channel("bookmarks-channel")
  .on("postgres_changes", { event: "*", schema: "public", table: "bookmarks" })
  .subscribe()
```

This enables:
- Instant UI updates
- Cross-tab synchronization
- Event-driven architecture (no polling)

To support delete events, the table was configured with:

```sql
ALTER TABLE bookmarks REPLICA IDENTITY FULL;
```

---

## 🧠 Key Design Decisions

- Used Supabase Auth to simplify secure OAuth handling
- Implemented RLS for production-grade data security
- Used Postgres realtime instead of polling
- Structured code for maintainability
- Added loading states and improved UX for production feel
- Proper environment variable configuration for secure deployment

---

## 🌍 Deployment

The application is deployed on **Vercel**.

Environment Variables configured:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

OAuth redirect URLs configured in:
- Supabase Auth settings
- Google Cloud Console

---

## 💻 Local Development

Clone the repository:

```bash
git clone <your-repo-url>
cd smart-bookmark-app
npm install
npm run dev
```

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📈 Project Highlights

- Full authentication flow implementation
- Secure multi-user architecture
- Real-time database sync
- Production-ready deployment
- Clean UI and UX improvements

---

## 👩‍💻 Author

Sarla Bharath Chandra  
Fullstack & Backend Developer  
B.Tech CSE (2025)

---
⭐ If you found this project interesting, feel free to explore and provide feedback!
