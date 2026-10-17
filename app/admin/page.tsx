'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ImagePlus, Loader2, LogOut, Pencil, Save, Trash2, UploadCloud, X } from 'lucide-react'
import { sb, BUCKET, configured, type Song } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Art } from '@/components/Art'
import { useApp } from '@/components/player-context'
import { SetupCard } from '@/components/States'

const CATS = ['Songs', 'Covers', 'Voice Notes', 'Live', 'Unreleased']

const pub = (p: string) => sb.storage.from(BUCKET).getPublicUrl(p).data.publicUrl
const pathOf = (url: string | null) => (url ? url.split(`/${BUCKET}/`)[1] : undefined)
const clean = (n: string) => n.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
const safe = (n: string) => n.replace(/[^\w.-]/g, '_')
const getDur = (f: File) =>
  new Promise<number>((r) => {
    const a = new Audio(URL.createObjectURL(f))
    a.onloadedmetadata = () => r(Math.round(a.duration) || 0)
    a.onerror = () => r(0)
  })

function Row({ s, done }: { s: Song; done: () => void }) {
  const [f, setF] = useState<Song>(s)
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const set = (k: keyof Song, v: unknown) => setF((p) => ({ ...p, [k]: v }))

  const save = async () => {
    setMsg('Saving…')
    const { error } = await sb.from('songs').update({
      title: f.title, category: f.category, year: f.year ? Number(f.year) : null, lyrics: f.lyrics,
      description: f.description, personal_note: f.personal_note, artwork_url: f.artwork_url,
    }).eq('id', s.id)
    setMsg(error ? error.message : 'Saved ✓')
    done()
  }
  const art = async (file?: File) => {
    if (!file) return
    setMsg('Uploading artwork…')
    const p = `art/${Date.now()}-${safe(file.name)}`
    const { error } = await sb.storage.from(BUCKET).upload(p, file)
    if (error) return setMsg(error.message)
    set('artwork_url', pub(p)); setMsg('Artwork added — press Save')
  }
  const del = async () => {
    if (!confirm(`Delete “${s.title}”? This can’t be undone.`)) return
    const files = [pathOf(s.audio_url), pathOf(s.artwork_url)].filter(Boolean) as string[]
    if (files.length) await sb.storage.from(BUCKET).remove(files)
    await sb.from('songs').delete().eq('id', s.id)
    done()
  }

  return (
    <div className="rounded-3xl bg-white p-3 shadow-card ring-1 ring-crust/15">
      <div className="flex items-center gap-3">
        <Art s={f} cls="h-14 w-14 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{s.title}</p>
          <p className="text-xs font-semibold text-muted">{s.category}{s.year ? ` · ${s.year}` : ''}{!s.audio_url && ' · demo (no audio)'}</p>
        </div>
        <button className="btn btn-ghost !min-h-[44px] !px-4" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? <X size={18} /> : <Pencil size={18} />} <span className="hidden sm:inline">{open ? 'Close' : 'Edit'}</span>
        </button>
        <button className="icon-btn text-tomato hover:bg-tomato/10" onClick={del} aria-label={`Delete ${s.title}`}><Trash2 size={20} /></button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid gap-3 px-1 pb-2 pt-4">
              <label className="grid gap-1 text-sm font-bold">Title<input className="input font-normal" value={f.title} onChange={(e) => set('title', e.target.value)} /></label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-bold">Category
                  <select className="input font-normal" value={f.category} onChange={(e) => set('category', e.target.value)}>
                    {CATS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-bold">Year<input className="input font-normal" type="number" placeholder="2024" value={f.year || ''} onChange={(e) => set('year', e.target.value)} /></label>
              </div>
              <label className="grid gap-1 text-sm font-bold">Description<input className="input font-normal" value={f.description || ''} onChange={(e) => set('description', e.target.value)} /></label>
              <label className="grid gap-1 text-sm font-bold">Personal note<textarea className="input font-normal" rows={2} value={f.personal_note || ''} onChange={(e) => set('personal_note', e.target.value)} /></label>
              <label className="grid gap-1 text-sm font-bold">Lyrics<textarea className="input font-normal" rows={6} value={f.lyrics || ''} onChange={(e) => set('lyrics', e.target.value)} /></label>
              <label className="btn btn-ghost w-fit cursor-pointer focus-within:outline focus-within:outline-[3px] focus-within:outline-tomato">
                <ImagePlus size={18} /> Artwork
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => art(e.target.files?.[0])} />
              </label>
              <div className="flex items-center gap-3">
                <button className="btn btn-primary" onClick={save}><Save size={18} /> Save</button>
                <span className="text-sm font-semibold text-muted" role="status">{msg}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type Up = { name: string; st: 'wait' | 'busy' | 'ok' | 'err'; note?: string }

export default function Admin() {
  const { songs, reload } = useApp()
  const [user, setUser] = useState<unknown>(null)
  const [ready, setReady] = useState(false)
  const [em, setEm] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [ups, setUps] = useState<Up[]>([])
  const [drag, setDrag] = useState(false)

  useEffect(() => {
    if (!configured) { setReady(true); return }
    sb.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setReady(true) })
    const { data } = sb.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])

  const upload = async (files: File[]) => {
    if (!files.length) return
    setUps(files.map((f) => ({ name: f.name, st: 'wait' })))
    const upd = (i: number, p: Partial<Up>) => setUps((all) => all.map((x, j) => (j === i ? { ...x, ...p } : x)))
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      upd(i, { st: 'busy' })
      const p = `audio/${Date.now()}-${safe(f.name)}`
      const { error } = await sb.storage.from(BUCKET).upload(p, f, { contentType: f.type || undefined })
      if (error) { upd(i, { st: 'err', note: error.message }); continue }
      const { error: e2 } = await sb.from('songs').insert({ title: clean(f.name), audio_url: pub(p), duration: await getDur(f) })
      upd(i, e2 ? { st: 'err', note: e2.message } : { st: 'ok' })
    }
    reload()
  }

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setErr('')
    const { error } = await sb.auth.signInWithPassword({ email: em, password: pw })
    setErr(error?.message || ''); setBusy(false)
  }

  if (!configured) return <SetupCard />
  if (!ready) return <p className="py-24 text-center text-muted" aria-busy="true">One moment…</p>

  if (!user)
    return (
      <form onSubmit={signIn} className="mx-auto mt-12 max-w-sm space-y-4 rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-crust/15">
        <div className="space-y-1 text-center">
          <p className="eyebrow">Kitchen staff only</p>
          <h1 className="font-display text-3xl font-black">Admin sign in</h1>
        </div>
        <label className="grid gap-1 text-sm font-bold">Email<input className="input font-normal" type="email" autoComplete="email" required value={em} onChange={(e) => setEm(e.target.value)} /></label>
        <label className="grid gap-1 text-sm font-bold">Password<input className="input font-normal" type="password" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} /></label>
        <button className="btn btn-primary w-full" disabled={busy}>{busy && <Loader2 size={18} className="animate-spin" />} Sign in</button>
        {err && <p className="text-center text-sm font-semibold text-tomato" role="alert">{err}</p>}
      </form>
    )

  return (
    <div className="space-y-8 pt-8 md:pt-12">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="eyebrow">Kitchen</p>
          <h1 className="font-display text-4xl font-black">Admin</h1>
        </div>
        <button className="btn btn-ghost" onClick={() => sb.auth.signOut()}><LogOut size={18} /> Sign out</button>
      </div>

      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload(Array.from(e.dataTransfer.files)) }}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-3 rounded-[2rem] border-4 border-dashed p-10 text-center transition focus-within:outline focus-within:outline-[3px] focus-within:outline-tomato',
          drag ? 'border-tomato bg-tomato/10' : 'border-crust/40 bg-white/60 hover:border-tomato'
        )}
      >
        <UploadCloud size={44} className="text-tomato" />
        <span className="font-display text-xl font-bold">Drop recordings here, or click to choose</span>
        <span className="text-sm text-muted">MP3, WAV, M4A, AAC or OGG — several at once is fine</span>
        <input type="file" multiple accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg" className="sr-only" onChange={(e) => e.target.files && upload(Array.from(e.target.files))} />
      </label>

      {ups.length > 0 && (
        <ul className="space-y-2" aria-live="polite">
          {ups.map((u, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm shadow-card">
              <span className="truncate font-semibold">{u.name}</span>
              <span className={cn('flex shrink-0 items-center gap-1.5 font-bold', u.st === 'ok' && 'text-basil', u.st === 'err' && 'text-tomato', (u.st === 'wait' || u.st === 'busy') && 'text-muted')}>
                {u.st === 'busy' && <Loader2 size={16} className="animate-spin" />}
                {u.st === 'ok' && <Check size={16} />}
                {u.st === 'err' && <X size={16} />}
                {u.st === 'wait' ? 'Waiting…' : u.st === 'busy' ? 'Uploading…' : u.st === 'ok' ? 'Done' : u.note || 'Failed'}
              </span>
            </li>
          ))}
        </ul>
      )}

      <section className="space-y-3">
        <h2 className="section-title">Songs ({songs.length})</h2>
        {songs.map((s) => <Row key={s.id} s={s} done={reload} />)}
      </section>
    </div>
  )
}
