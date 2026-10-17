'use client'
import { motion } from 'framer-motion'
import { Heart, Play } from 'lucide-react'
import { cfg } from '@/lib/config'
import { useApp } from '@/components/player-context'
import { SongGrid } from '@/components/SongCard'
import { PizzaSlice } from '@/components/PizzaArt'

// fixed values (not random) so server and browser render the same hearts
const HEARTS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 11) % 96, delay: (i * 1.7) % 12, dur: 9 + ((i * 1.3) % 7), size: 14 + ((i * 5) % 20), tone: i % 3,
}))

export default function ForVivi() {
  const { songs, favs, play, setShuffle } = useApp()
  const fv = songs.filter((s) => favs.includes(s.id))
  const list = fv.length ? fv : songs

  return (
    <div className="relative pt-8 md:pt-12">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        {HEARTS.map((h, i) => (
          <Heart key={i} className="float-heart absolute -bottom-10 animate-floatUp"
            style={{ left: `${h.left}%`, width: h.size, height: h.size, animationDelay: `${h.delay}s`, animationDuration: `${h.dur}s`, opacity: 0, color: ['#D32F1E', '#F26B57', '#F7B733'][h.tone], fill: 'currentColor' }} />
        ))}
      </div>

      <div className="relative z-10 space-y-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-8 text-center">
          <div className="space-y-3">
            <p className="eyebrow">A little something</p>
            <h1 className="font-display text-5xl font-black md:text-7xl">
              For <span className="italic text-tomato">{cfg.name}</span> <Heart className="inline-block -translate-y-1 fill-tomato text-tomato" size={48} />
            </h1>
          </div>

          <div className="relative mx-auto max-w-2xl">
            <PizzaSlice className="absolute -right-3 -top-8 z-10 h-16 w-16 rotate-12 drop-shadow-lg md:-right-8 md:h-20 md:w-20" />
            <div className="gingham rounded-[2rem] p-3 shadow-card">
              <div className="rounded-[1.5rem] bg-dough-50 px-6 py-10 md:px-14 md:py-14">
                <p className="font-display text-xl italic leading-9 md:text-2xl md:leading-[3rem]">{cfg.message}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <section className="space-y-6">
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="section-title">Songs I Love Hearing You Sing</h2>
            {list[0] && (
              <button className="btn btn-primary !px-9 !py-4 text-lg" onClick={() => { setShuffle(false); play(list[0], list) }}>
                <Play size={22} fill="currentColor" /> Play our playlist
              </button>
            )}
          </div>
          <SongGrid list={list} />
        </section>
      </div>
    </div>
  )
}
