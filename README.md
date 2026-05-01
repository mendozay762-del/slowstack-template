# slowstack-template

Reusable Next.js + Tailwind landing page template for slowstack-studio products.

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4
- Supabase (signup form storage)
- next-themes (light / dark / system)

## Getting started

```sh
npm install
npm run dev
```

Open http://localhost:3000.

`.env.local` needs:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Development workflow

```
edit → check on localhost → npm run verify → git push
```

**Always run `npm run verify` before pushing.** It runs `npm run lint` and `npm run build` — the same checks Vercel runs in CI. A local failure costs ~10 seconds; a failed Vercel deploy costs 1–3 minutes per cycle, and you only learn about it after the push lands.

If verify passes, the push will too.
