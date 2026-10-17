'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { configured, sb, type Song } from '@/lib/supabase'
import { cfg } from '@/lib/config'
import { cn } from '@/lib/utils'
import { PlayerCtx, TimeCtx, type PlayerState } from './player-context'
import { MiniPlayer } from './MiniPlayer'
import { NowPlaying } from './NowPlaying'

const read = <T,>(k: string, d: T): T => {
  try { return JSON.parse(localStorage.getItem(k) || '') ?? d } catch { return d }
}
const write = (k: string, v: unknown) => {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* private mode etc. */ }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([])
  const [loaded, setLoaded] = useState(false)
  const [queue, setQueue] = useState<Song[]>([])
  const [cur, setCur] = useState<Song | null>(null)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [dur, setDur] = useState(0)
  const [vol, setVol] = useState(1)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [favs, setFavs] = useState<string[]>([])
  const [recent, setRecent] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const audio = useRef<HTMLAudioElement>(null)

  const reload = useCallback(async () => {
    if (!configured) { setLoaded(true); return }
    const { data, error } = await sb.from('songs').select('*').order('created_at')
    if (error) console.error('Could not load songs:', error.message)
    setSongs((data as Song[]) || [])
    setLoaded(true)
  }, [])

  useEffect(() => {
    reload()
    setFavs(read<string[]>('favs', []))
    setRecent(read<string[]>('recent', []))
  }, [reload])

  const start = (s: Song) => {
    const e = audio.current
    if (e) {
      if (s.audio_url) {
        if (cur?.id !== s.id || !e.src) e.src = s.audio_url
        e.currentTime = 0
        e.play().catch(() => {})
      } else {
        // demo songs have no audio file: make sure the previous song stops
        e.pause(); e.removeAttribute('src'); e.load(); setPlaying(false)
      }
    }
    setCur(s); setT(0); setDur(s.duration || 0)
    const r = [s.id, ...recent.filter((i) => i !== s.id)].slice(0, 10)
    setRecent(r); write('recent', r)
  }

  const toggle = () => {
    const e = audio.current
    if (!e || !cur || !cur.audio_url) return
    if (e.paused) e.play().catch(() => {})
    else e.pause()
  }

  const play = (s: Song, list?: Song[]) => {
    if (list) setQueue(list)
    else if (!queue.length) setQueue(songs)
    if (cur?.id === s.id) { toggle(); return }
    start(s)
  }

  const step = (d: number) => {
    if (!queue.length || !cur) return
    let n: Song
    if (shuffle && queue.length > 1) {
      const others = queue.filter((x) => x.id !== cur.id)
      n = others[Math.floor(Math.random() * others.length)]
    } else {
      const i = queue.findIndex((x) => x.id === cur.id)
      n = queue[(i + d + queue.length) % queue.length]
    }
    start(n)
  }

  const seek = (n: number) => {
    if (audio.current) audio.current.currentTime = n
    setT(n)
  }

  const fav = (id: string) => {
    const f = favs.includes(id) ? favs.filter((i) => i !== id) : [...favs, id]
    setFavs(f); write('favs', f)
  }

  useEffect(() => {
    if (audio.current) { audio.current.volume = vol; audio.current.muted = muted }
  }, [vol, muted])

  // keep latest actions in a ref so the lock-screen / keyboard handlers never go stale
  const api = useRef({ next: () => {}, prev: () => {}, toggle: () => {} })
  api.current = { next: () => step(1), prev: () => step(-1), toggle }

  // Lock-screen / headphone / notification controls (Media Session API)
  useEffect(() => {
    if (!cur || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: cur.title, artist: cfg.name, album: cfg.title,
        artwork: cur.artwork_url ? [{ src: cur.artwork_url }] : [],
      })
      navigator.mediaSession.setActionHandler('play', () => api.current.toggle())
      navigator.mediaSession.setActionHandler('pause', () => api.current.toggle())
      navigator.mediaSession.setActionHandler('nexttrack', () => api.current.next())
      navigator.mediaSession.setActionHandler('previoustrack', () => api.current.prev())
    } catch { /* unsupported browser */ }
  }, [cur])
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try { navigator.mediaSession.playbackState = playing ? 'playing' : 'paused' } catch { /* noop */ }
    }
  }, [playing])

  // Space bar = play / pause (only when you're not typing or focused on a control)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag && tag !== 'BODY') return
      e.preventDefault(); api.current.toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const value: PlayerState = useMemo(
    () => ({
      songs, loaded, reload, cur, playing, queue, play, toggle, next: () => step(1), prev: () => step(-1), seek,
      vol, setVol, muted, setMuted, shuffle, setShuffle, repeat, setRepeat, favs, fav, recent, open, setOpen,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [songs, loaded, cur, playing, queue, vol, muted, shuffle, repeat, favs, recent, open]
  )
  const time = useMemo(() => ({ t, dur }), [t, dur])

  return (
    <MotionConfig reducedMotion="user">
      <PlayerCtx.Provider value={value}>
        <TimeCtx.Provider value={time}>
          <div className={cn('min-h-screen transition-[padding] duration-300', cur ? 'pb-36 md:pb-40' : 'pb-12')}>{children}</div>
          <audio
            ref={audio}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setPlaying(false)}
            onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
            onEnded={() => {
              const e = audio.current
              if (repeat && e) { e.currentTime = 0; e.play().catch(() => {}) }
              else step(1)
            }}
          />
          <MiniPlayer />
          <NowPlaying />
        </TimeCtx.Provider>
      </PlayerCtx.Provider>
    </MotionConfig>
  )
}
