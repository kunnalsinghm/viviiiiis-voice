import { PizzaArt } from './PizzaArt'
import { cn } from '@/lib/utils'

export function EmptyState({ title, text, children, seed = 'empty', className }: { title: string; text?: string; children?: React.ReactNode; seed?: string; className?: string }) {
  return (
    <div className={cn('mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center', className)}>
      <PizzaArt seed={seed} bare className="h-40 w-40 opacity-90 drop-shadow-lg" />
      <h2 className="font-display text-3xl font-bold">{title}</h2>
      {text && <p className="text-muted">{text}</p>}
      {children}
    </div>
  )
}

export function SetupCard() {
  return (
    <div className="mx-auto mt-12 max-w-xl rounded-[2rem] bg-white p-8 shadow-card ring-1 ring-crust/20">
      <p className="eyebrow">One quick thing</p>
      <h1 className="mt-2 font-display text-3xl font-bold">The kitchen isn’t connected yet</h1>
      <p className="mt-3 text-muted">
        Add your Supabase details to a file called <code className="rounded bg-dough-200 px-1.5 py-0.5 text-ink">.env.local</code> (same folder as <code className="rounded bg-dough-200 px-1.5 py-0.5 text-ink">package.json</code>):
      </p>
      <pre className="mt-4 overflow-x-auto rounded-2xl bg-oven p-4 text-sm leading-6 text-dough">{`NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key`}</pre>
      <p className="mt-4 text-sm text-muted">Then stop the server (Ctrl + C) and run <code className="rounded bg-dough-200 px-1.5 py-0.5 text-ink">npm run dev</code> again.</p>
    </div>
  )
}
