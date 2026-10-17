'use client'
import { fmt } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useApp, useTime } from './player-context'

export function Seek({ light = false, className }: { light?: boolean; className?: string }) {
  const { seek } = useApp()
  const { t, dur } = useTime()
  const pct = dur ? Math.min(100, (t / dur) * 100) : 0
  return (
    <div className={cn('flex items-center gap-3 text-xs tabular-nums', light ? 'text-muted' : 'text-dough/70', className)}>
      <span className="w-9 text-right">{fmt(t)}</span>
      <input
        type="range" aria-label="Seek" min={0} max={dur || 0} step={0.1} value={Math.min(t, dur || 0)}
        onChange={(e) => seek(+e.target.value)}
        className={cn('flex-1', light && 'range-light')}
        style={{ ['--p' as string]: `${pct}%` }}
      />
      <span className="w-9">{fmt(dur)}</span>
    </div>
  )
}
