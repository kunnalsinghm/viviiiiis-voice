'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Pause, Play } from 'lucide-react'
import { fmt, type Song } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Art } from './Art'
import { useApp } from './player-context'

export function Equalizer({ playing, className }: { playing: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex h-3 items-end gap-[2px]', !playing && 'eq-paused', className)} aria-hidden>
      <i className="eq-bar" /><i className="eq-bar" /><i className="eq-bar" />
    </span>
  )
}

export function SongCard({ s, list, i = 0 }: { s: Song; list: Song[]; i?: number }) {
  const { play, fav, favs, cur, playing } = useApp()
  const isCur = cur?.id === s.id
  const isFav = favs.includes(s.id)
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: Math.min(i, 12) * 0.05, ease: [0.34, 1.3, 0.64, 1] }}
      className={cn(
        'group relative rounded-3xl bg-white p-3 shadow-card ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-xl',
        isCur ? 'ring-2 ring-tomato' : 'ring-crust/15'
      )}
    >
      <div className="relative">
        <Link href={`/song/${s.id}`} className="block overflow-hidden rounded-2xl" aria-label={`Open ${s.title}`}>
          <Art s={s} cls="aspect-square w-full transition duration-500 group-hover:scale-105" />
        </Link>
        <button
          onClick={() => play(s, list)}
          aria-label={isCur && playing ? `Pause ${s.title}` : `Play ${s.title}`}
          className={cn(
            'icon-btn absolute bottom-2 right-2 h-12 w-12 bg-tomato text-white shadow-pop transition active:translate-y-[3px] active:shadow-none hover:bg-tomato-dark',
            'md:translate-y-1 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100',
            isCur && 'md:translate-y-0 md:opacity-100'
          )}
        >
          {isCur && playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-1 px-1">
        <div className="min-w-0">
          <Link href={`/song/${s.id}`} className="line-clamp-2 break-words font-bold leading-tight hover:text-tomato">{s.title}</Link>
          <span className="mt-0.5 flex items-center gap-1.5 truncate text-xs font-semibold text-muted">
            {isCur ? (<><Equalizer playing={playing} className="text-tomato" /><span className="text-tomato">Now playing</span></>) : (<>{fmt(s.duration || 0)} · {s.category}</>)}
          </span>
        </div>
        <button
          onClick={() => fav(s.id)} aria-pressed={isFav} aria-label={isFav ? `Remove ${s.title} from favourites` : `Add ${s.title} to favourites`}
          className="icon-btn h-10 w-10 shrink-0 text-tomato hover:bg-tomato/10"
        >
          <Heart key={String(isFav)} size={22} className={cn(isFav && 'animate-pop fill-tomato')} />
        </button>
      </div>
    </motion.article>
  )
}

export function SongGrid({ list }: { list: Song[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {list.map((s, i) => <SongCard key={s.id} s={s} list={list} i={i} />)}
    </div>
  )
}

export function SongSkeletons() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4" aria-busy="true" aria-label="Loading songs">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="animate-pulse rounded-3xl bg-white p-3 shadow-card">
          <div className="aspect-square rounded-2xl bg-dough-200" />
          <div className="mt-3 h-4 w-3/4 rounded-full bg-dough-200" />
          <div className="mt-2 h-3 w-1/2 rounded-full bg-dough-200" />
        </div>
      ))}
    </div>
  )
}
