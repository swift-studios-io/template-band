# template-band

A reusable band/artist website template built with **Next.js 15**, **Payload CMS 3**, **TypeScript**, and **Tailwind CSS v4**.

Production-tested patterns extracted from live artist sites. Designed for quick customization — swap colors, fonts, and content to launch a new artist site in hours, not weeks.

## Stack

- **Next.js 15** — App Router, ISR, server components
- **Payload CMS 3** — Headless CMS with admin panel at `/admin`
- **TypeScript** — Full type safety
- **Tailwind CSS v4** — Utility-first styling with CSS custom properties
- **SQLite** (local dev) / **PostgreSQL** (production via Neon)
- **Cloudflare R2** — S3-compatible media storage
- **Resend** — Contact form email delivery
- **Cloudflare Turnstile** — Spam protection

## Quick Start

```bash
# 1. Clone or use as template
git clone <your-repo-url>
cd template-band

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local — at minimum set PAYLOAD_SECRET:
#   openssl rand -hex 32

# 4. Run dev server (SQLite, no external services needed)
npm run dev
# Opens at http://localhost:3333
# Admin panel at http://localhost:3333/admin

# 5. Create your first admin user at /admin
```

## Customizing the Theme

The visual identity is controlled by **CSS custom properties** in `src/app/globals.css`:

```css
@theme inline {
  --color-primary: #c41e1e;        /* Change this to your brand color */
  --color-primary-dark: #a01818;   /* Darker shade for hover states */
  --color-background: #0a0a0a;    /* Page background */
  --color-foreground: #ededed;    /* Text color */
  --color-card: #1a1a1a;          /* Card backgrounds */
  --color-muted: #888888;         /* Secondary text */
  --font-sans: var(--font-heebo); /* Body font */
  --font-heading: var(--font-syne); /* Heading font */
}
```

To change fonts, update `src/app/layout.tsx` to import different Google Fonts.

**Key principle:** Swapping visual identity = changing CSS variables + font imports, not touching components. All components use `text-primary`, `bg-primary`, `bg-card`, etc.

## Content Management

All content is managed through the Payload CMS admin panel at `/admin`:

- **Tour Dates** — Shows with dates, venues, ticket links
- **Members** — Band/artist members with photos, roles, bios
- **Releases** — Music releases with streaming links (Spotify, Apple Music, YouTube, Amazon)
- **News Posts** — Blog posts with rich text, featured images
- **Gallery Items** — Photos and video embeds
- **Videos** — YouTube videos with thumbnails
- **Site Settings** — Artist name, tagline, bio, social links
- **Media** — All uploaded images/files with automatic optimization

## Pages

| Route | Description |
|-------|-------------|
| `/` | Single-page homepage with all sections |
| `/news` | News listing page |
| `/news/[slug]` | Individual news post |
| `/contact` | Contact form page |
| `/preview` | Template preview with all sections and placeholder content |
| `/admin` | Payload CMS admin panel |

## Deployment to Vercel

1. Push to GitHub
2. Import in Vercel
3. Set environment variables (see below)
4. Deploy

The `.npmrc` with `legacy-peer-deps=true` is required for Vercel builds.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PAYLOAD_SECRET` | Yes | Secret key for Payload CMS (`openssl rand -hex 32`) |
| `POSTGRES_URL` | Production | PostgreSQL connection string (leave empty for local SQLite) |
| `NEXT_PUBLIC_SERVER_URL` | Yes | Your site URL (`http://localhost:3333` for dev) |
| `R2_BUCKET` | Production | Cloudflare R2 bucket name |
| `R2_ACCESS_KEY_ID` | Production | R2 access key |
| `R2_SECRET_ACCESS_KEY` | Production | R2 secret key |
| `R2_ENDPOINT` | Production | R2 endpoint URL |
| `R2_PUBLIC_URL` | Production | Public URL for R2 media |
| `RESEND_API_KEY` | Optional | Resend API key for contact form emails |
| `CONTACT_FORM_RECIPIENT` | Optional | Email address to receive contact form submissions |
| `CONTACT_FORM_SITE_NAME` | Optional | Site name shown in email notifications |
| `TURNSTILE_SECRET_KEY` | Optional | Cloudflare Turnstile secret for spam protection |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional | Turnstile public site key |
| `NEXT_PUBLIC_SITE_ENV` | Optional | Set to `staging` to show draft content |

## Project Structure

```
template-band/
├── payload.config.ts         # CMS config (dual DB, R2 storage)
├── src/
│   ├── access/roles.ts       # Access control (isLoggedIn, isAdmin, publicRead)
│   ├── collections/          # Payload CMS collections
│   │   ├── Users.ts          # Admin/editor users
│   │   ├── Media.ts          # Uploads with image optimization
│   │   ├── TourDates.ts      # Tour dates with noon-UTC hook
│   │   ├── Releases.ts       # Music releases + streaming links
│   │   ├── NewsPosts.ts      # News with rich text
│   │   ├── Members.ts        # Band members
│   │   ├── GalleryItems.ts   # Photo/video gallery
│   │   ├── Videos.ts         # YouTube/self-hosted videos
│   │   └── FormSubmissions.ts # Contact form entries
│   ├── globals/
│   │   └── SiteSettings.ts   # Global config (artist name, social, etc.)
│   ├── hooks/
│   │   └── optimizeImage.ts  # R2 image optimization (Sharp)
│   ├── lib/
│   │   └── media.ts          # Media URL helpers
│   ├── config/
│   │   └── theme.ts          # Theme config (CSS variable references)
│   └── app/
│       ├── layout.tsx         # Root layout with fonts
│       ├── globals.css        # Tailwind v4 theme + animations
│       ├── page.tsx           # Homepage (all sections, CMS-driven)
│       ├── preview/page.tsx   # Template preview with placeholders
│       ├── news/              # News pages
│       ├── contact/page.tsx   # Contact form
│       ├── api/contact/       # Contact form API
│       └── components/        # Reusable components
```
