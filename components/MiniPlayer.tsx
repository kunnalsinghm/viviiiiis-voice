'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { cfg } from '@/lib/config'
import { Art } from './Art'
import { Controls } from './Controls'
import { Seek } from './Seek'
import { useApp, useTime } from './player-context'

export function MiniPlayer() {
  const { cur, open, setOpen, playing, toggle, next, prev, vol, setVol, muted, setMuted } = useApp()
  const { t, dur } = useTime()
  const pct = dur ? (t / dur) * 100 : 0
  const dim = 'icon-btn text-dough/80 hover:bg-white/10 hover:text-white'

  return (
    <AnimatePresence>
      {cur && !open && (
        <motion.div
          initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:px-6 md:pb-5"
        >
          <div className="pointer-events-auto mx-auto max-w-5xl overflow-hidden rounded-3xl bg-oven text-dough shadow-player ring-1 ring-white/10">
            <div className="h-1 bg-white/10 md:hidden"><div className="h-1 bg-cheese" style={{ width: `${pct}%` }} /></div>
            <div className="flex items-center gap-3 p-2.5 md:px-4 md:py-3">
              <button
                onClick={() => setOpen(true)} aria-label={`Open now playing: ${cur.title}`}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl text-left md:w-72 md:flex-none"
              >
                <Art s={cur} cls="h-12 w-12 shrink-0 rounded-xl" />
                <span className="min-w-0">
                  <span className="block truncate font-bold">{cur.title}</span>
                  <span className="block truncate text-xs text-dough/60">{cfg.name} · {cur.category}</span>
                </span>
              </button>

              <div className="hidden flex-1 md:block"><Controls /><Seek /></div>

              <div className="flex items-center md:hidden">
                <button className={dim} onClick={prev} aria-label="Previous song"><SkipBack size={20} fill="currentColor" /></button>
                <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}
                  className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-tomato text-white shadow-[0_3px_0_#8f1d12] active:translate-y-[2px] active:shadow-none">
                  {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
                </button>
                <button className={dim} onClick={next} aria-label="Next song"><SkipForward size={20} fill="currentColor" /></button>
              </div>

              <div className="hidden w-40 items-center gap-1 md:flex">
                <button className={dim} onClick={() => setMuted(!muted)} aria-label={muted ? 'Unmute' : 'Mute'}>
                  {muted || !vol ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range" min={0} max={1} step={0.01} value={muted ? 0 : vol} aria-label="Volume"
                  onChange={(e) => { setVol(+e.target.value); setMuted(false) }}
                  style={{ ['--p' as string]: `${(muted ? 0 : vol) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
