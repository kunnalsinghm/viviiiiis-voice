# Vivi's Voice 🍕
*Every version of her, in sound.*

A small private music site for Vivi's recordings. Next.js + Tailwind + Supabase, all on free tiers.
**v2 = the pizza-parlour redesign.** Your Supabase setup, songs, favourites and admin logins all keep working exactly as before.

## What's new in the design
- Pizza-parlour look: tomato red, melted-cheese yellow, basil green, a red-and-white tablecloth border, Playfair Display + Karla + a handwritten Caveat font for personal notes.
- **Every song without artwork gets its own unique pizza** (always the same pizza for the same song). On the Now Playing screen it spins like a record while the song plays.
- Floating mini-player, full-screen Now Playing with lyrics and your note as a pinned sticky note.
- Category chips on the home page, loading skeletons, friendly empty states.
- The romantic `/for-vivi` page: a gingham-framed letter with softly floating hearts.
- Lock-screen / headphone controls on phones (Media Session), and Space bar = play/pause on desktop.
- Fixed from v1: the music no longer stops when you click between pages; a demo song with no audio file no longer leaves the previous song playing; the garbled characters in `/admin` are gone; Enter now signs you in; unfinished setup shows a friendly card instead of a crash.
- Accessible: visible keyboard focus, proper button labels, 44px touch targets, and animations switch off for people who prefer reduced motion.

## 1. Supabase setup (one time)
*(skip if your Supabase project already works - nothing changed here)*
1. Create a free project at supabase.com.
2. **SQL Editor → New query**, paste all of `supabase/schema.sql`, click **Run**.
3. **Authentication → Users → Add user → Create new user** for each person who should log in (tick **Auto Confirm User**).
4. **Authentication → Sign In / Providers → Email** → switch off **Allow new users to sign up**.
5. Copy the **Project URL** and the **publishable** (or legacy **anon**) key. Never use the **secret** / **service_role** key.

## 2. Run it on your computer (Windows PowerShell)
Install Node.js (LTS) from nodejs.org. Open a terminal in the folder that contains `package.json`:

```
npm install
```

Create `.env.local` in that same folder (copy `.env.example`), with exactly:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Then:

```
npm run dev
```

Open http://localhost:3000. After editing `.env.local`, stop the server (Ctrl + C) and start it again.

> Upgrading from v1? Replace the old project files with these, run `npm install` again (there are a few new packages), and keep your existing `.env.local`.

## 3. Upload the recordings
1. Go to `/admin` and sign in.
2. Drag all your recordings onto the upload box (MP3, WAV, M4A, AAC, OGG).
3. Titles come from the filename (`vivi_song_1.mp3` → "Vivi Song 1").
4. Click **Edit** to set title, category, year, description, lyrics, personal note and artwork, then **Save**.
5. Delete the 4 demo songs once the real ones are in.

## 4. Personalise
- Her name, bio, photo URL and the **For Vivi** message: `lib/config.ts`
- Colours: `tailwind.config.js` (`tomato`, `cheese`, `basil`, `dough`, `oven`…)
- Tip: add a real photo URL in `lib/config.ts` and the home page shows it in a crust-coloured ring instead of the pizza.

## 5. Deploy free on Vercel
```
git init
git add .
git status
git commit -m "Vivi's Voice v2 - pizza"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```
Check that `git status` does **not** list `.env.local` or `node_modules`. On vercel.com: **Add New → Project**, import the repo, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, **Deploy**.
Already deployed? Just `git add . && git commit -m "Pizza redesign" && git push` and Vercel redeploys.

## Before you share the link
- Strong passwords for admin accounts; keep sign-ups switched off.
- Open the live link on your phone and play a song.

## Troubleshooting
| Problem | Fix |
|---|---|
| Home page says "The kitchen isn't connected yet" | `.env.local` is missing or still has the placeholder. Fill it in and restart. |
| `npm install` can't find `package.json` | Wrong folder. `cd` into the one that contains it. |
| "Failed to fetch" on sign in | Real URL not in `.env.local` yet. Save it and restart. |
| "Invalid login credentials" | Create the user under **Authentication → Users → Add user** with Auto Confirm ticked. |
| Songs don't appear | Run `supabase/schema.sql` again; check the URL and key. |
| Upload fails | Sign in at `/admin` first; check the `vivi` bucket exists under Storage. |
| Red "Extra attributes from the server" warning | A browser extension; harmless and dev-only. |

## Notes
- Recordings sit in a **public** bucket with hard-to-guess links. Fine for a private gift; don't post the site publicly.
- Favourites and Recently Played are saved in each visitor's own browser, so you and Vivi each have your own. The For Vivi playlist = the visitor's favourites (or all songs if none).
- Free Supabase storage is 1 GB. If you run out, compress WAV files to MP3.
