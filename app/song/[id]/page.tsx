'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Pause, Pin, Play } from 'lucide-react'
import { cfg } from '@/lib/config'
import { cn } from '@/lib/utils'
import { Art } from '@/components/Art'
import { useApp } from '@/components/player-context'
import { Equalizer } from '@/components/SongCard'
import { EmptyState } from '@/components/States'

export default function SongPage() {
  const { id } = useParams<{ id: string }>()
  const { songs, loaded, play, fav, favs, cur, playing } = useApp()
  const s = songs.find((x) => x.id === id)

  if (!s) {
    return loaded ? (
      <EmptyState title="Song not found" text="This slice seems to have been eaten." seed="missing">
        <Link href="/" className="btn btn-primary">Back to all songs</Link>
      </EmptyState>
    ) : (
      <p className="py-24 text-center text-muted" aria-busy="true">Warming up the oven…</p>
    )
  }

  const isCur = cur?.id === s.id
  const isFav = favs.includes(s.id)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 pt-6 md:pt-10">
      <Link href="/" className="inline-flex min-h-[44px] items-center gap-2 font-bold text-muted hover:text-tomato"><ArrowLeft size={18} /> All songs</Link>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative">
          <div className="gingham absolute inset-3 -rotate-3 rounded-[2.5rem]" aria-hidden />
          <Art s={s} cls="relative aspect-square w-full rounded-[2rem] shadow-card ring-4 ring-white" />
        </div>
        <div className="space-y-5">
          <p className="eyebrow">{s.category}{s.year ? ` · ${s.year}` : ''}</p>
          <h1 className="font-display text-4xl font-black leading-tight md:text-6xl">{s.title}</h1>
          <p className="flex items-center gap-2 font-bold text-muted">
            {cfg.name}
            {isCur && <><span aria-hidden>·</span><Equalizer playing={playing} className="text-tomato" /><span className="text-tomato">Now playing</span></>}
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => play(s, songs)}>
              {isCur && playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              {isCur && playing ? 'Pause' : 'Play'}
            </button>
            <button className="btn btn-ghost" onClick={() => fav(s.id)} aria-pressed={isFav}>
              <Heart key={String(isFav)} size={20} className={cn('text-tomato', isFav && 'animate-pop fill-tomato')} />
              {isFav ? 'Favourited' : 'Favourite'}
            </button>
          </div>
          {s.description && <p className="text-lg text-muted">{s.description}</p>}
          {s.personal_note && (
            <div className="relative -rotate-1 rounded-sm bg-cheese-light px-6 pb-6 pt-8 shadow-card">
              <Pin size={22} className="absolute left-1/2 top-2 -translate-x-1/2 text-tomato" fill="currentColor" />
              <p className="font-hand text-3xl leading-9 text-oven">{s.personal_note}</p>
            </div>
          )}
        </div>
      </div>
      {s.lyrics && (
        <section className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-crust/15 md:p-12">
          <h2 className="section-title mb-5 text-center">Lyrics</h2>
          <p className="whitespace-pre-wrap text-center font-display text-lg italic leading-9 md:text-xl">{s.lyrics}</p>
        </section>
      )}
    </motion.div>
  )
}
