'use client'
import { memo } from 'react'
import { cn } from '@/lib/utils'

/* A unique pizza for every song. Same title -> same pizza, always. */
function hash(str: string) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}
function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const TILES = ['#FFE3A8', '#FFD2C2', '#E4F0D0', '#FFECC7', '#FBD9B5']

type Topping = { x: number; y: number; r: number; kind: 'pep' | 'basil' | 'olive' | 'shroom'; rot: number }

export const PizzaArt = memo(function PizzaArt({ seed, className, bare = false, style }: { seed: string; className?: string; bare?: boolean; style?: React.CSSProperties }) {
  const rand = rng(hash(seed || 'vivi'))
  const tile = TILES[Math.floor(rand() * TILES.length)]
  const count = 7 + Math.floor(rand() * 5)
  const toppings: Topping[] = Array.from({ length: count }, () => {
    const ang = rand() * Math.PI * 2
    const dist = Math.sqrt(rand()) * 62
    const k = rand()
    return {
      x: 100 + Math.cos(ang) * dist,
      y: 100 + Math.sin(ang) * dist,
      r: 8 + rand() * 4,
      kind: k < 0.45 ? 'pep' : k < 0.7 ? 'basil' : k < 0.88 ? 'olive' : 'shroom',
      rot: rand() * 360,
    }
  })
  const blobs = Array.from({ length: 6 }, () => {
    const ang = rand() * Math.PI * 2
    const d = Math.sqrt(rand()) * 60
    return { x: 100 + Math.cos(ang) * d, y: 100 + Math.sin(ang) * d, r: 10 + rand() * 12 }
  })
  const slices = Array.from({ length: 4 }, (_, i) => (i * Math.PI) / 4)

  return (
    <svg viewBox={bare ? '14 14 172 172' : '0 0 200 200'} style={style} className={cn('block', className)} role="img" aria-label="Pizza illustration">
      {!bare && <rect width="200" height="200" fill={tile} />}
      {!bare && <circle cx="100" cy="106" r="84" fill="#8A4B1F" opacity=".18" />}
      {/* crust */}
      <circle cx="100" cy="100" r="84" fill="#E3A857" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="#C98A3E" strokeWidth="3" />
      <circle cx="100" cy="100" r="76" fill="#D32F1E" />
      {/* cheese */}
      <circle cx="100" cy="100" r="71" fill="#F8C65A" />
      {blobs.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#FDDF8E" opacity=".75" />)}
      {/* toppings */}
      {toppings.map((t, i) => {
        if (t.kind === 'pep')
          return (
            <g key={i}>
              <circle cx={t.x} cy={t.y} r={t.r} fill="#B3261E" />
              <circle cx={t.x} cy={t.y} r={t.r} fill="none" stroke="#7A1C12" strokeWidth="1.5" />
              <circle cx={t.x - t.r / 3} cy={t.y - t.r / 4} r="1.6" fill="#7A1C12" />
              <circle cx={t.x + t.r / 3} cy={t.y + t.r / 5} r="1.6" fill="#7A1C12" />
            </g>
          )
        if (t.kind === 'basil')
          return (
            <g key={i} transform={`rotate(${t.rot} ${t.x} ${t.y})`}>
              <ellipse cx={t.x} cy={t.y} rx={t.r * 0.8} ry={t.r * 0.45} fill="#2E7D32" />
              <line x1={t.x - t.r * 0.8} y1={t.y} x2={t.x + t.r * 0.8} y2={t.y} stroke="#1F5A24" strokeWidth="1" />
            </g>
          )
        if (t.kind === 'olive')
          return (
            <g key={i}>
              <circle cx={t.x} cy={t.y} r={t.r * 0.55} fill="#2B2B2B" />
              <circle cx={t.x} cy={t.y} r={t.r * 0.22} fill="#F8C65A" />
            </g>
          )
        return (
          <g key={i} transform={`rotate(${t.rot} ${t.x} ${t.y})`}>
            <ellipse cx={t.x} cy={t.y - t.r * 0.15} rx={t.r * 0.75} ry={t.r * 0.5} fill="#E9D8BE" />
            <rect x={t.x - t.r * 0.2} y={t.y} width={t.r * 0.4} height={t.r * 0.5} rx="1.5" fill="#D8C3A0" />
          </g>
        )
      })}
      {/* cut lines */}
      {slices.map((a, i) => (
        <line
          key={i}
          x1={100 - Math.cos(a) * 76} y1={100 - Math.sin(a) * 76}
          x2={100 + Math.cos(a) * 76} y2={100 + Math.sin(a) * 76}
          stroke="#FFF4DE" strokeOpacity=".5" strokeWidth="1.4"
        />
      ))}
    </svg>
  )
})

export function PizzaSlice({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 44 5 11c10-6 28-6 38 0L24 44Z" fill="#F8C65A" stroke="#C98A3E" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M5 11c10-6 28-6 38 0" fill="none" stroke="#C98A3E" strokeWidth="6" strokeLinecap="round" />
      <circle cx="19" cy="19" r="3.4" fill="#D32F1E" />
      <circle cx="29" cy="21" r="3.4" fill="#D32F1E" />
      <circle cx="24" cy="31" r="3" fill="#D32F1E" />
    </svg>
  )
}
