'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Heart, Mic2, Pin } from 'lucide-react'
import { cfg } from '@/lib/config'
import { cn } from '@/lib/utils'
import { Art } from './Art'
import { Controls } from './Controls'
import { Seek } from './Seek'
import { useApp } from './player-context'

export function NowPlaying() {
  const { cur, open, setOpen, playing, fav, favs } = useApp()
  const [lyr, setLyr] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, setOpen])

  useEffect(() => setLyr(false), [cur?.id])

  const isFav = !!cur && favs.includes(cur.id)

  return (
    <AnimatePresence>
      {cur && open && (
        <motion.div
          role="dialog" aria-modal="true" aria-label="Now playing"
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 34, stiffness: 280 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-oven text-dough"
          style={{ backgroundImage: 'radial-gradient(700px 420px at 50% 0%, rgba(211,47,30,.55), transparent 70%), radial-gradient(500px 300px at 100% 100%, rgba(247,183,51,.18), transparent 70%)' }}
        >
          <div className="mx-auto flex min-h-full max-w-md flex-col gap-6 px-6 pb-10 pt-5">
            <div className="flex items-center justify-between">
              <button autoFocus onClick={() => setOpen(false)} aria-label="Close now playing" className="icon-btn bg-white/10 hover:bg-white/20">
                <ChevronDown size={26} />
              </button>
              <span className="text-xs font-bold uppercase tracking-[.2em] text-cheese">Now playing</span>
              <button onClick={() => fav(cur.id)} aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'} aria-pressed={isFav} className="icon-btn bg-white/10 hover:bg-white/20">
                <Heart key={String(isFav)} size={22} className={cn(isFav && 'animate-pop fill-tomato-light text-tomato-light')} />
              </button>
            </div>

            <div className="mx-auto w-full max-w-[22rem]">
              {cur.artwork_url ? (
                <Art s={cur} cls={cn('aspect-square w-full rounded-[2rem] shadow-2xl ring-4 ring-cheese/40 transition-transform duration-700', playing ? 'scale-100' : 'scale-90')} />
              ) : (
                <Art s={cur} spin spinning={playing} cls="w-full" />
              )}
            </div>

            <div className="text-center">
              <h2 className="font-display text-3xl font-bold leading-tight">{cur.title}</h2>
              <p className="mt-1 text-dough/70">{cfg.name} · {cur.category}{cur.year ? ` · ${cur.year}` : ''}</p>
            </div>

            <Seek />
            <Controls big />

            <div className="space-y-4">
              {cur.lyrics && (
                <button onClick={() => setLyr(!lyr)} aria-expanded={lyr} className="btn btn-dark w-full">
                  <Mic2 size={18} /> {lyr ? 'Hide lyrics' : 'Show lyrics'}
                </button>
              )}
              <AnimatePresence initial={false}>
                {lyr && cur.lyrics && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden whitespace-pre-wrap text-center font-display text-lg italic leading-8"
                  >
                    {cur.lyrics}
                  </motion.p>
                )}
              </AnimatePresence>

              {cur.personal_note && (
                <div className="relative -rotate-1 rounded-sm bg-cheese-light px-5 pb-5 pt-7 text-oven shadow-xl">
                  <Pin size={20} className="absolute left-1/2 top-2 -translate-x-1/2 text-tomato" fill="currentColor" />
                  <p className="font-hand text-2xl leading-8">{cur.personal_note}</p>
                </div>
              )}

              <Link href={`/song/${cur.id}`} onClick={() => setOpen(false)} className="block text-center text-sm font-bold text-dough/70 underline-offset-4 hover:text-white hover:underline">
                Open song page
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
