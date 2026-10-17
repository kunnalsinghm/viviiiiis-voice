'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Heart, Music2, Play, Search, Shuffle, Upload } from 'lucide-react'
import { cfg } from '@/lib/config'
import { configured, type Song } from '@/lib/supabase'
import { useApp } from '@/components/player-context'
import { SongGrid, SongSkeletons } from '@/components/SongCard'
import { EmptyState, SetupCard } from '@/components/States'
import { PizzaArt, PizzaSlice } from '@/components/PizzaArt'

export default function Home() {
  const { songs, loaded, recent, favs, play, setShuffle } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')

  const cats = useMemo(() => ['All', ...Array.from(new Set(songs.map((s) => s.category)))], [songs])
  const filtered = songs.filter(
    (s) => (cat === 'All' || s.category === cat) && `${s.title} ${s.category} ${s.lyrics || ''}`.toLowerCase().includes(q.toLowerCase())
  )
  const rec = recent.map((i) => songs.find((s) => s.id === i)).filter(Boolean) as Song[]
  const fv = songs.filter((s) => favs.includes(s.id))

  if (!configured) return <SetupCard />

  const words = cfg.title.split(' ')
  const last = words.pop()

  return (
    <div className="space-y-14 pt-6 md:pt-10">
      {/* ---------- Hero ---------- */}
      <section className="grid items-center gap-8 md:grid-cols-[1.1fr_.9fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-5 text-center md:text-left">
          <p className="eyebrow">Baked with love</p>
          <h1 className="font-display text-5xl font-black leading-[.95] sm:text-6xl lg:text-7xl">
            {words.join(' ')} <span className="italic text-tomato">{last}</span>
          </h1>
          <p className="font-display text-xl italic text-muted md:text-2xl">{cfg.tagline}</p>
          <p className="mx-auto max-w-md text-lg md:mx-0">{cfg.bio}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-1 md:justify-start">
            <button className="btn btn-primary" disabled={!songs.length} onClick={() => { setShuffle(false); play(songs[0], songs) }}>
              <Play size={20} fill="currentColor" /> Play all
            </button>
            <button className="btn btn-ghost" disabled={!songs.length} onClick={() => { setShuffle(true); play(songs[Math.floor(Math.random() * songs.length)], songs) }}>
              <Shuffle size={18} /> Shuffle
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-2 md:justify-start">
            <span className="chip !cursor-default hover:!border-crust/30 hover:!text-ink"><Music2 size={15} className="mr-1.5 text-tomato" />{songs.length} recordings</span>
            <span className="chip !cursor-default hover:!border-crust/30 hover:!text-ink"><Heart size={15} className="mr-1.5 fill-tomato text-tomato" />{favs.length} favourites</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.85, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, ease: [0.34, 1.3, 0.64, 1] }} className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="gingham absolute inset-4 rotate-6 rounded-[2.5rem] shadow-card" aria-hidden />
          {cfg.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cfg.photo} alt={cfg.name} className="relative h-full w-full rounded-full object-cover ring-[10px] ring-crust-light shadow-2xl" />
          ) : (
            <div className="relative h-full w-full rounded-full shadow-[0_30px_60px_-18px_rgba(43,20,13,.55)]">
              <PizzaArt seed="vivis-voice-hero" bare className="h-full w-full animate-spinSlow will-change-transform" />
            </div>
          )}
          <PizzaSlice className="absolute -bottom-2 -left-2 h-20 w-20 -rotate-12 drop-shadow-lg" />
        </motion.div>
      </section>

      {/* ---------- Songs ---------- */}
      {loaded && !songs.length ? (
        <EmptyState title={`${cfg.name}’s voice is waiting here.`} text="Upload her first recording to begin." seed="first">
          <Link href="/admin" className="btn btn-primary"><Upload size={18} /> Upload recording</Link>
        </EmptyState>
      ) : (
        <>
          <section className="space-y-5" aria-labelledby="songs-h">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 id="songs-h" className="section-title">Her Songs</h2>
              <div className="relative md:w-72">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input className="input !pl-11" type="search" placeholder="Search title, lyrics…" aria-label="Search songs" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
            </div>
            {cats.length > 2 && (
              <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
                {cats.map((c) => <button key={c} className="chip shrink-0" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
              </div>
            )}
            {!loaded ? <SongSkeletons /> : filtered.length ? <SongGrid list={filtered} /> : (
              <p className="rounded-3xl bg-white/60 py-12 text-center text-muted">No songs match “{q}”. Try another word?</p>
            )}
          </section>

          {!q && cat === 'All' && rec.length > 0 && (
            <section className="space-y-5">
              <h2 className="section-title flex items-center gap-3"><Clock className="text-tomato" size={26} /> Recently Played</h2>
              <SongGrid list={rec} />
            </section>
          )}
          {!q && cat === 'All' && fv.length > 0 && (
            <section className="space-y-5">
              <h2 className="section-title flex items-center gap-3"><Heart className="fill-tomato text-tomato" size={26} /> My Favourites</h2>
              <SongGrid list={fv} />
            </section>
          )}
        </>
      )}
    </div>
  )
}
