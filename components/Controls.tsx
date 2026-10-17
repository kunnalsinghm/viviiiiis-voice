'use client'
import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from './player-context'

export function Controls({ big = false }: { big?: boolean }) {
  const { toggle, playing, prev, next, shuffle, setShuffle, repeat, setRepeat } = useApp()
  const side = 'icon-btn text-dough/80 hover:bg-white/10 hover:text-white'
  return (
    <div className={cn('flex items-center justify-center', big ? 'gap-3' : 'gap-1')}>
      <button className={cn(side, shuffle && '!text-cheese')} onClick={() => setShuffle(!shuffle)} aria-label="Shuffle" aria-pressed={shuffle}>
        <Shuffle size={big ? 22 : 18} />
      </button>
      <button className={side} onClick={prev} aria-label="Previous song"><SkipBack size={big ? 26 : 20} fill="currentColor" /></button>
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause' : 'Play'}
        className={cn(
          'inline-flex cursor-pointer items-center justify-center rounded-full bg-tomato text-white shadow-[0_4px_0_#8f1d12] transition hover:bg-tomato-light active:translate-y-[3px] active:shadow-none',
          big ? 'h-[72px] w-[72px]' : 'h-12 w-12'
        )}
      >
        {playing ? <Pause size={big ? 30 : 22} fill="currentColor" /> : <Play size={big ? 30 : 22} fill="currentColor" className="ml-0.5" />}
      </button>
      <button className={side} onClick={next} aria-label="Next song"><SkipForward size={big ? 26 : 20} fill="currentColor" /></button>
      <button className={cn(side, repeat && '!text-cheese')} onClick={() => setRepeat(!repeat)} aria-label="Repeat" aria-pressed={repeat}>
        <Repeat size={big ? 22 : 18} />
      </button>
    </div>
  )
}
