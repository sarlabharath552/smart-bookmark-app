📌 Smart Bookmark Manager

A fullstack real-time bookmark management application built using Next.js (App Router) and Supabase.

Live Demo:
👉 https://smart-bookmark-app-nine.vercel.app

🚀 Overview

Smart Bookmark Manager allows users to:

Sign in securely using Google OAuth

Add personal bookmarks

Delete bookmarks

View real-time updates across multiple tabs

Access only their own data using Row Level Security (RLS)

The application is fully deployed on Vercel and uses Supabase for authentication, database, and real-time subscriptions.

🛠 Tech Stack

Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS

Backend & DB: Supabase (PostgreSQL)

Authentication: Google OAuth (via Supabase Auth)

Realtime: Supabase Postgres Changes

Deployment: Vercel

🔐 Security Architecture
Row Level Security (RLS)

The bookmarks table uses RLS policies to ensure users can:

✅ View only their own bookmarks

✅ Insert only their own bookmarks

✅ Delete only their own bookmarks

Policy condition:

auth.uid() = user_id


This guarantees strict user-level data isolation.

⚡ Realtime Implementation

The app subscribes to Postgres changes using:

supabase.channel().on("postgres_changes", ...)


This enables:

Instant updates across multiple browser tabs

Real-time UI sync without refresh

Event-driven architecture

To support delete events, the table uses:

ALTER TABLE bookmarks REPLICA IDENTITY FULL;


This ensures deleted row data is published correctly.

🌍 Deployment

The application is deployed on Vercel.

Environment variables configured:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

OAuth redirect URLs were configured in:

Supabase Auth settings

Google Cloud Console

🧠 Key Design Decisions

Used Supabase Auth to simplify secure OAuth handling

Implemented RLS for production-grade data security

Used Postgres realtime instead of polling

Separated client logic cleanly using React state management

Added loading states and UX improvements for production feel

📦 Local Setup
git clone <repo-url>
cd smart-bookmark-app
npm install
npm run dev


Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

✅ Features Summary

Google OAuth login

Secure per-user bookmarks

Add / Delete functionality

Real-time multi-tab sync

Clean, responsive UI

Production deployment
