# template-band

A production-ready, reusable website template for bands and solo artists. Built with **Next.js 15**, **Payload CMS 3**, **TypeScript**, and **Tailwind CSS v4**.

## What's Included

- **Hero** — Configurable full-viewport hero with headline and CTA buttons
- **About/Bio** — Artist biography section driven by CMS global settings
- **Tour Dates** — Upcoming shows with date, venue, city, ticket links — all from CMS
- **Music/Streaming** — Release cards (singles, albums, EPs) with streaming platform links
- **Members** — Band member grid with photos, names, and roles
- **Videos** — YouTube video grid with lazy-loaded thumbnails
- **Gallery** — Photo grid with lightbox viewer
- **News/Blog** — News posts with featured images, excerpts, individual pages
- **Contact Form** — Resend email delivery + Cloudflare Turnstile spam protection + honeypot
- **Social Links** — Instagram, Facebook, YouTube, Spotify, Twitter/X, TikTok, LinkedIn
- **Payload Admin** — Full CMS admin panel at `/admin`

## Quick Start

```bash
# 1. Clone/create from template
git clone https://github.com/swift-studios-io/template-band.git my-band-site
cd my-band-site

# 2. Install dependencies
npm install

# 3. Copy and configure environment
cp .env.example .env.local
# Edit .env.local — at minimum set PAYLOAD_SECRET

# 4. Run dev server
npm run dev
# → http://localhost:3333 (site)
# → http://localhost:3333/admin (CMS)
```

The template runs locally with **SQLite** — no Postgres setup needed for development. First visit to `/admin` will prompt you to create an admin user.

## Customizing the Theme

The visual identity is controlled by **CSS variables** in `src/app/globals.css`:

```css
@theme inline {
  --color-primary: #c41e1e;       /* Change this to your brand color */
  --color-primary-dark: #a01818;  /* Darker variant for hover states */
  --color-primary-light: #e63232; /* Lighter variant */
  --color-background: #0a0a0a;
  --color-foreground: #ededed;
  --color-card: #1a1a1a;
}
```

**To change fonts**, edit the Google Font imports in `src/app/layout.tsx` and update the CSS variable mappings.

**Swapping visual identity = changing CSS variables + font imports.** No component surgery needed.

## Managing Content

All content is managed through **Payload CMS** at `/admin`:

| Collection | What it manages |
|---|---|
| Tour Dates | Upcoming shows with date, venue, city, ticket links |
| Members | Band/artist members with photos and roles |
| Gallery Items | Photos and video embeds for the gallery |
| News Posts | Blog posts with rich text content |
| Releases | Singles, albums, EPs with streaming links |
| Videos | YouTube videos with thumbnails |
| Media | All uploaded images (auto-optimized, stored in R2) |

**Global Settings** (`/admin/globals/site-settings`):
- Artist/band name, tagline, bio
- Social media links
- Contact email

## Deployment (Vercel)

1. Push repo to GitHub
2. Import in Vercel, connect to your repo
3. Set environment variables in Vercel project settings:

| Variable | Required | Description |
|---|---|---|
| `PAYLOAD_SECRET` | ✅ | Random string for Payload auth |
| `POSTGRES_URL` | ✅ | Neon Postgres connection string |
| `NEXT_PUBLIC_SERVER_URL` | ✅ | Production URL (e.g. `https://myband.com`) |
| `R2_BUCKET` | For media | Cloudflare R2 bucket name |
| `R2_ACCESS_KEY_ID` | For media | R2 S3-compatible access key |
| `R2_SECRET_ACCESS_KEY` | For media | R2 S3-compatible secret key |
| `R2_ENDPOINT` | For media | R2 S3 endpoint URL |
| `R2_PUBLIC_URL` | For media | Public URL for R2 media (e.g. `https://media.myband.com`) |
| `RESEND_API_KEY` | For contact | Resend API key for email delivery |
| `CONTACT_FORM_RECIPIENT` | For contact | Email address to receive form submissions |
| `CONTACT_FORM_SITE_NAME` | For contact | Name shown in email subject |
| `TURNSTILE_SECRET_KEY` | For contact | Cloudflare Turnstile secret key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | For contact | Cloudflare Turnstile site key |
| `NEXT_PUBLIC_SITE_ENV` | Optional | Set to `staging` to show draft content |

4. Deploy. Vercel auto-builds on push.

## Stack

- **Framework:** Next.js 15 (App Router)
- **CMS:** Payload CMS 3
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Database:** SQLite (local) / Neon Postgres (production)
- **Media Storage:** Cloudflare R2 (S3-compatible)
- **Email:** Resend
- **Spam Protection:** Cloudflare Turnstile

## Project Structure

```
├── payload.config.ts       # Payload CMS configuration
├── next.config.ts          # Next.js configuration
├── src/
│   ├── access/roles.ts     # Access control (admin, editor, public)
│   ├── collections/        # Payload CMS collection definitions
│   ├── globals/            # Payload CMS global configs
│   ├── hooks/              # Payload hooks (image optimization)
│   ├── lib/                # Utility functions
│   ├── config/theme.ts     # Theme configuration
│   └── app/
│       ├── page.tsx        # Homepage (all sections)
│       ├── layout.tsx      # Root layout (fonts, metadata)
│       ├── globals.css     # Tailwind theme + custom styles
│       ├── contact/        # Contact form page
│       ├── news/           # News listing + individual posts
│       ├── preview/        # Template preview with all sections
│       ├── api/contact/    # Contact form API route
│       ├── components/     # Reusable UI components
│       └── (payload)/      # Payload admin routes
```

## License

Private — Swift Studios internal template.
