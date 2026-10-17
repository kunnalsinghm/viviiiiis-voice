'use client'
import { memo } from 'react'
import { PizzaArt } from './PizzaArt'
import { cn } from '@/lib/utils'
import type { Song } from '@/lib/supabase'

/** Song artwork. Uses the uploaded picture, otherwise a one-of-a-kind pizza. */
export const Art = memo(function Art({ s, cls = '', spin = false, spinning = false }: { s?: Song | null; cls?: string; spin?: boolean; spinning?: boolean }) {
  if (s?.artwork_url)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={s.artwork_url} alt="" loading="lazy" decoding="async" className={cn('object-cover', cls)} />
  if (spin)
    // round pizza that turns like a record while the song plays (shadow stays still: much cheaper to draw)
    return (
      <div className={cn('aspect-square rounded-full shadow-[0_24px_50px_-14px_rgba(0,0,0,.6)]', cls)}>
        <PizzaArt
          seed={s?.id || s?.title || 'vivi'}
          bare
          className="h-full w-full animate-spinSlow will-change-transform"
          style={{ animationPlayState: spinning ? 'running' : 'paused' }}
        />
      </div>
    )
  return <PizzaArt seed={s?.id || s?.title || 'vivi'} className={cn('overflow-hidden', cls)} />
})
