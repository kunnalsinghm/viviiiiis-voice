'use client'
import { createContext, useContext } from 'react'
import type { Song } from '@/lib/supabase'

export type PlayerState = {
  songs: Song[]
  loaded: boolean
  reload: () => Promise<void>
  cur: Song | null
  playing: boolean
  queue: Song[]
  play: (s: Song, list?: Song[]) => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (n: number) => void
  vol: number
  setVol: (n: number) => void
  muted: boolean
  setMuted: (b: boolean) => void
  shuffle: boolean
  setShuffle: (b: boolean) => void
  repeat: boolean
  setRepeat: (b: boolean) => void
  favs: string[]
  fav: (id: string) => void
  recent: string[]
  open: boolean
  setOpen: (b: boolean) => void
}

export const PlayerCtx = createContext<PlayerState | null>(null)
export const TimeCtx = createContext({ t: 0, dur: 0 })

export function useApp() {
  const c = useContext(PlayerCtx)
  if (!c) throw new Error('useApp must be used inside <Provider>')
  return c
}
export const useTime = () => useContext(TimeCtx)
