import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
// Accepts either variable name so both "anon" and "publishable" keys work.
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

/** false when .env.local is missing / still has the placeholder -> the UI shows a friendly setup card instead of crashing */
export const configured = Boolean(url && key && !url.includes('YOUR-PROJECT'))

export const sb = createClient(
  configured ? (url as string) : 'https://placeholder.supabase.co',
  configured ? (key as string) : 'placeholder-key'
)

export const BUCKET = 'vivi'

export type Song = {
  id: string
  title: string
  audio_url: string
  artwork_url: string | null
  category: string
  year: number | null
  lyrics: string | null
  description: string | null
  personal_note: string | null
  duration: number | null
  created_at: string
}

export const fmt = (s: number) =>
  !s || isNaN(s) ? '0:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
