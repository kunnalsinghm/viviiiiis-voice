'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gift, Heart, Lock } from 'lucide-react'
import { cfg } from '@/lib/config'
import { cn } from '@/lib/utils'
import { PizzaSlice } from './PizzaArt'

const links = [
  { href: '/liked', label: 'Favourites', Icon: Heart },
  { href: '/for-vivi', label: `For ${cfg.name}`, Icon: Gift },
]

export function Nav() {
  const path = usePathname()
  return (
    <header className="sticky top-0 z-30">
      <div className="gingham h-2" aria-hidden />
      <div className="border-b-2 border-crust/20 bg-dough/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-2 sm:px-5" aria-label="Main">
          <Link href="/" className="mr-auto flex min-h-[44px] items-center gap-2 rounded-full pr-3 font-display text-xl font-black">
            <PizzaSlice className="h-8 w-8 -rotate-12" />
            <span>{cfg.title.split(' ')[0]} <span className="italic text-tomato">{cfg.title.split(' ').slice(1).join(' ')}</span></span>
          </Link>
          {links.map(({ href, label, Icon }) => {
            const active = path === href
            return (
              <Link
                key={href} href={href} aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-[44px] items-center gap-2 rounded-full px-3 text-sm font-bold transition sm:px-4',
                  active ? 'bg-tomato text-white' : 'text-ink hover:bg-white hover:text-tomato'
                )}
              >
                <Icon size={18} className={cn(href === '/liked' && active && 'fill-current')} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sr-only sm:hidden">{label}</span>
              </Link>
            )
          })}
          <Link href="/admin" aria-label="Admin" title="Admin"
            className={cn('icon-btn text-muted hover:bg-white hover:text-tomato', path === '/admin' && 'bg-white text-tomato')}>
            <Lock size={17} />
          </Link>
        </nav>
      </div>
    </header>
  )
}
