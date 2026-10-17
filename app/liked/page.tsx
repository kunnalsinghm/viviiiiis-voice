'use client'
import Link from 'next/link'
import { Heart, Play, Shuffle } from 'lucide-react'
import { useApp } from '@/components/player-context'
import { SongGrid } from '@/components/SongCard'
import { EmptyState } from '@/components/States'

export default function Liked() {
  const { songs, favs, play, setShuffle } = useApp()
  const list = songs.filter((s) => favs.includes(s.id))
  return (
    <div className="space-y-8 pt-8 md:pt-12">
      <div className="space-y-2">
        <p className="eyebrow">Saved on this device</p>
        <h1 className="flex items-center gap-3 font-display text-4xl font-black md:text-5xl">
          <Heart className="fill-tomato text-tomato" size={40} /> Favourites
        </h1>
      </div>
      {list.length ? (
        <>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => { setShuffle(false); play(list[0], list) }}><Play size={20} fill="currentColor" /> Play all</button>
            <button className="btn btn-ghost" onClick={() => { setShuffle(true); play(list[Math.floor(Math.random() * list.length)], list) }}><Shuffle size={18} /> Shuffle</button>
          </div>
          <SongGrid list={list} />
          <p className="text-sm text-muted">Tap the heart on a card to remove a favourite.</p>
        </>
      ) : (
        <EmptyState title="No favourites yet" text="Tap the heart on any song and it will be saved here." seed="fav">
          <Link href="/" className="btn btn-primary">Find a song to love</Link>
        </EmptyState>
      )}
    </div>
  )
}
