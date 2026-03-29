import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import ScrollReveal from "./components/ScrollReveal";
import YouTubeThumbnail from "./components/YouTubeThumbnail";
import GalleryLightbox from "./components/GalleryLightbox";
import ScrollToTop from "./components/ScrollToTop";
import ActiveNav from "./components/ActiveNav";
import { getMediaUrl } from "@/lib/media";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#tour", label: "Tour" },
  { href: "#streaming", label: "Music" },
  { href: "#members", label: "Band" },
  { href: "#videos", label: "Videos" },
  { href: "#gallery", label: "Gallery" },
  { href: "#news", label: "News" },
];

// ── Placeholder data for "The Voltage" ──────────────────────────────
const FALLBACK_TOUR_DATES: { date: string; venue: string; city: string; ticketLink: string | null; showTime?: string | null; linkType?: string }[] = [
  { date: "2026-04-12", venue: "The Electric Room", city: "Austin, TX", ticketLink: "#", linkType: "tickets", showTime: "Doors 7pm, Show 8pm" },
  { date: "2026-04-25", venue: "Sunset Strip Music Festival", city: "Los Angeles, CA", ticketLink: "#", linkType: "tickets" },
  { date: "2026-05-03", venue: "The Blue Note", city: "Nashville, TN", ticketLink: null, showTime: "9:00 PM" },
  { date: "2026-05-17", venue: "Mercury Lounge", city: "New York, NY", ticketLink: "#", linkType: "tickets" },
  { date: "2026-06-07", venue: "Summer Sounds Festival", city: "Denver, CO", ticketLink: null },
  { date: "2026-06-21", venue: "The Fillmore", city: "San Francisco, CA", ticketLink: "#", linkType: "tickets" },
  { date: "2026-07-04", venue: "Freedom Fest Main Stage", city: "Chicago, IL", ticketLink: null },
  { date: "2026-07-19", venue: "The Roxy Theatre", city: "Atlanta, GA", ticketLink: "#", linkType: "tickets" },
];

const FALLBACK_MEMBERS = [
  { name: "Mika Torres", role: "Lead Vocals / Guitar", image: "" },
  { name: "Jax Rivera", role: "Lead Guitar", image: "" },
  { name: "Sasha Kim", role: "Bass / Backing Vocals", image: "" },
  { name: "Remy Okafor", role: "Drums", image: "" },
];

const FALLBACK_RELEASES = [
  { title: "Neon Highways", type: "Album", image: null as string | null, spotify: null, apple: null, youtube: null },
  { title: "Static Heart", type: "Single", image: null as string | null, spotify: null, apple: null, youtube: null },
  { title: "Afterglow", type: "EP", image: null as string | null, spotify: null, apple: null, youtube: null },
];

const FALLBACK_NEWS = [
  {
    title: "NEW ALBUM ANNOUNCEMENT",
    slug: "new-album-announcement",
    excerpt: "The Voltage is thrilled to announce our debut album 'Neon Highways' dropping this summer. Pre-save now on all platforms.",
    date: "March 2026",
    image: "",
  },
  {
    title: "SUMMER TOUR ANNOUNCED",
    slug: "summer-tour-announced",
    excerpt: "We're hitting the road this summer with stops across the US. Tickets on sale now for select dates.",
    date: "February 2026",
    image: "",
  },
  {
    title: "BEHIND THE SCENES",
    slug: "behind-the-scenes",
    excerpt: "Take a look inside our recording sessions for the upcoming album. New sounds, new energy, same voltage.",
    date: "January 2026",
    image: "",
  },
];

const FALLBACK_GALLERY_VIDEOS = [
  { title: "Live at The Electric Room", id: "dQw4w9WgXcQ" },
  { title: "Static Heart — Official Video", id: "dQw4w9WgXcQ" },
  { title: "Backstage Diary Ep. 1", id: "dQw4w9WgXcQ" },
];

const FALLBACK_SITE_SETTINGS = {
  artistName: "The Voltage",
  tagline: "Turn It Up",
  socialLinks: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
    spotify: "#",
    twitter: "#",
    tiktok: "#",
    linkedin: null,
  },
};

const FALLBACK_BIO = [
  "The Voltage is an electrifying four-piece band that blends raw energy with polished songwriting. Formed in a cramped garage in Austin, TX, the band quickly built a reputation for explosive live shows and hooks that stick with you for days.",
  "Drawing inspiration from classic rock legends and modern indie pioneers, The Voltage creates a sound that feels both timeless and fresh. Their debut EP 'Afterglow' earned critical acclaim and a loyal following across the touring circuit.",
  "With a debut album on the horizon and a packed summer tour schedule, The Voltage is ready to bring their signature sound to stages everywhere.",
];

// ── Helpers ───────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr.includes("T") ? dateStr : dateStr + "T00:00:00");
  return {
    day: d.getDate(),
    dayOfWeek: d.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
}

function isPast(dateStr: string) {
  const d = dateStr.includes("T") ? dateStr : dateStr + "T23:59:59";
  return new Date(d) < new Date();
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function formatNewsDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function truncateExcerpt(text: string, max = 120): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

// ── Data fetching ─────────────────────────────────────────────────────

async function fetchCMSData() {
  try {
    const payload = await getPayload({ config });

    const isStaging = process.env.NEXT_PUBLIC_SITE_ENV === 'staging';
    const statusFilter = isStaging ? undefined : { _status: { equals: 'published' as const } };

    const emptyResult = { docs: [] };
    const [tourDatesRes, membersRes, releasesRes, newsRes, galleryRes, siteSettings] = await Promise.all([
      payload.find({ collection: "tour-dates", sort: "-date", limit: 100, ...(statusFilter && { where: statusFilter }), draft: isStaging }).catch(() => emptyResult),
      payload.find({ collection: "members", sort: "order", limit: 20, ...(statusFilter && { where: statusFilter }), draft: isStaging }).catch(() => emptyResult),
      payload.find({ collection: "releases", limit: 20, ...(statusFilter && { where: statusFilter }), draft: isStaging }).catch(() => emptyResult),
      payload.find({ collection: "news-posts", sort: "-publishedDate", limit: 20, ...(statusFilter && { where: statusFilter }), draft: isStaging }).catch(() => emptyResult),
      payload.find({ collection: "gallery-items", sort: "order", limit: 100, ...(statusFilter && { where: statusFilter }), draft: isStaging }).catch(() => emptyResult),
      payload.findGlobal({ slug: "site-settings" }).catch(() => ({} as Record<string, unknown>)),
    ]);

    const tourDates = tourDatesRes.docs.map((td) => ({
      date: td.date as string,
      venue: td.venue as string,
      city: td.city as string,
      ticketLink: (td.ticketLink as string) || null,
      linkType: (td.linkType as string) || 'more-info',
      showTime: (td.showTime as string) || null,
    }));

    const members = membersRes.docs.map((m) => {
      const photo = m.photo as { url?: string; filename?: string } | number | null;
      const photoUrl = (photo && typeof photo === "object") ? getMediaUrl(photo) : "";
      return {
        name: (m.displayName as string) || (m.name as string),
        role: m.role as string,
        image: photoUrl || "",
      };
    });

    const releases = releasesRes.docs.map((r) => {
      const cover = r.coverImage as { url?: string } | number | null;
      const coverUrl = (cover && typeof cover === "object") ? getMediaUrl(cover) : null;
      return {
        title: r.title as string,
        type: ((r.type as string) || "single").charAt(0).toUpperCase() + ((r.type as string) || "single").slice(1),
        image: coverUrl || null,
        spotify: (r.streamingLinks as { spotify?: string })?.spotify || null,
        apple: (r.streamingLinks as { appleMusic?: string })?.appleMusic || null,
        youtube: (r.streamingLinks as { youtube?: string })?.youtube || null,
      };
    });

    const news = newsRes.docs.map((n) => {
      const featuredImage = n.featuredImage as { url?: string } | number | null;
      const featuredUrl = (featuredImage && typeof featuredImage === "object") ? getMediaUrl(featuredImage) : "";
      return {
        title: n.title as string,
        slug: (n.slug as string) || "",
        excerpt: (n.excerpt as string) || "",
        date: formatNewsDate(n.publishedDate as string),
        image: featuredUrl || "",
      };
    });

    const galleryPhotos: string[] = [];
    const galleryVideos: { title: string; id: string }[] = [];
    for (const item of galleryRes.docs) {
      if (item.type === "image") {
        const media = item.media as { filename?: string; url?: string } | number | null;
        if (media && typeof media === "object") {
          const url = getMediaUrl(media);
          if (url) galleryPhotos.push(url);
        }
      } else if (item.type === "video" && item.videoUrl) {
        const ytId = extractYouTubeId(item.videoUrl as string);
        if (ytId) galleryVideos.push({ title: item.title as string, id: ytId });
      }
    }

    const settings = {
      artistName: (siteSettings.artistName as string) || FALLBACK_SITE_SETTINGS.artistName,
      tagline: (siteSettings.tagline as string) || FALLBACK_SITE_SETTINGS.tagline,
      bio: (siteSettings.bio as string) || "",
      socialLinks: {
        facebook: (siteSettings.socialLinks as { facebook?: string })?.facebook || FALLBACK_SITE_SETTINGS.socialLinks.facebook,
        instagram: (siteSettings.socialLinks as { instagram?: string })?.instagram || FALLBACK_SITE_SETTINGS.socialLinks.instagram,
        youtube: (siteSettings.socialLinks as { youtube?: string })?.youtube || FALLBACK_SITE_SETTINGS.socialLinks.youtube,
        spotify: (siteSettings.socialLinks as { spotify?: string })?.spotify || FALLBACK_SITE_SETTINGS.socialLinks.spotify,
        twitter: (siteSettings.socialLinks as { twitter?: string })?.twitter || FALLBACK_SITE_SETTINGS.socialLinks.twitter,
        tiktok: (siteSettings.socialLinks as { tiktok?: string })?.tiktok || FALLBACK_SITE_SETTINGS.socialLinks.tiktok,
        linkedin: (siteSettings.socialLinks as { linkedin?: string })?.linkedin || FALLBACK_SITE_SETTINGS.socialLinks.linkedin,
      },
    };

    return {
      tourDates: tourDates.length > 0 ? tourDates : FALLBACK_TOUR_DATES,
      members: members.length > 0 ? members : FALLBACK_MEMBERS,
      releases: releases.length > 0 ? releases : FALLBACK_RELEASES,
      news: news.length > 0 ? news : FALLBACK_NEWS,
      galleryPhotos,
      galleryVideos: galleryVideos.length > 0 ? galleryVideos : FALLBACK_GALLERY_VIDEOS,
      settings,
    };
  } catch (error) {
    console.error("Failed to fetch from Payload CMS, using fallback data:", error instanceof Error ? error.message : error);
    return {
      tourDates: FALLBACK_TOUR_DATES,
      members: FALLBACK_MEMBERS,
      releases: FALLBACK_RELEASES,
      news: FALLBACK_NEWS,
      galleryPhotos: [] as string[],
      galleryVideos: FALLBACK_GALLERY_VIDEOS,
      settings: FALLBACK_SITE_SETTINGS,
    };
  }
}

// ── Page component ────────────────────────────────────────────────────

export const revalidate = 60;

export default async function Home() {
  const { tourDates, members, news, galleryPhotos, galleryVideos, releases, settings } = await fetchCMSData();

  const sortedTourDates = [...tourDates]
    .filter((show) => !isPast(show.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const bio = (settings as { bio?: string }).bio || FALLBACK_BIO.join(" ");

  return (
    <div className="min-h-screen bg-background text-white">
      <ActiveNav />
      <ScrollToTop />

      {/* NAV */}
      <nav id="main-nav" className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b transition-colors duration-300" style={{ backgroundColor: "transparent", borderBottomColor: "transparent" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <a href="#home" className="flex-shrink-0 font-heading text-xl font-black uppercase tracking-wider text-white">
            {settings.artistName}
          </a>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-nav-link
                className="text-sm uppercase tracking-wider text-gray-300 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <MobileMenuButton />
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-wider mb-6 text-white">
            {settings.artistName}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 tracking-[0.25em] uppercase font-light mb-10">
            {settings.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#tour"
              className="inline-block px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-wider transition-colors"
            >
              See Tour Dates
            </a>
            <a
              href="#streaming"
              className="inline-block px-8 py-3 border-2 border-white/60 hover:border-white text-white font-bold uppercase tracking-wider transition-colors"
            >
              Listen Now
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-28 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-primary text-[11px] font-bold uppercase tracking-[0.35em] mb-5">{settings.artistName}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 uppercase leading-[1.15] tracking-tight">
              About <span className="text-primary">Us</span>
            </h2>
            <p className="text-[#b0b0b0] text-[15px] md:text-[16px] leading-[1.75]">
              {bio}
            </p>
          </div>
        </div>
      </section>

      {/* TOUR DATES */}
      <section id="tour" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/70" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-12 text-center uppercase tracking-wider">
            Tour <span className="text-primary">Dates</span>
          </h2>
          <div className="divide-y divide-white/10">
            {sortedTourDates.map((show, i) => {
              const d = formatDate(show.date);
              return (
                <div
                  key={i}
                  className="flex flex-wrap md:flex-nowrap items-center py-6 px-2 md:px-4 hover:bg-white/[0.03] transition-colors gap-4 md:gap-10"
                >
                  <div className="min-w-[70px] md:min-w-[110px] flex-shrink-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl md:text-5xl font-black text-primary leading-none">{d.day}</span>
                      <span className="text-xs md:text-sm font-bold text-gray-300 uppercase">{d.dayOfWeek}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">
                        {d.month} {d.year}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm md:text-xl uppercase text-white leading-snug">{show.venue}</h3>
                    <p className="text-gray-400 text-xs md:text-sm mt-0.5">
                      {show.city}
                      {show.showTime && <span className="ml-2 text-gray-500">&bull; {show.showTime}</span>}
                    </p>
                  </div>
                  {show.ticketLink && (
                    <a
                      href={show.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-xs md:text-sm font-bold uppercase tracking-wider text-white bg-primary hover:bg-primary-dark w-[110px] md:w-[130px] py-2 md:py-3 transition-colors text-center"
                    >
                      {show.linkType === 'tickets' ? 'Tickets' : 'More Info'}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STREAMING / MUSIC */}
      <section id="streaming" className="py-24 md:py-32 bg-[#0c0c0c]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4">Listen Now</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-2 uppercase tracking-wider">
            Now <span className="text-primary">Streaming</span>
          </h2>
          <p className="text-gray-400 mb-16 text-lg uppercase tracking-wider">On All Platforms</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {releases.map((release) => (
              <div key={release.title} className="bg-card rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="w-full aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                    {release.image ? (
                      <Image src={release.image} alt={release.title} width={400} height={400} loading="lazy" className="w-full aspect-square object-cover rounded-lg" />
                    ) : (
                      <svg className="w-16 h-16 text-primary/30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                    )}
                  </div>
                  <h3 className="font-bold text-xl text-white mb-1">{release.title}</h3>
                  <p className="text-gray-500 text-sm">{release.type}</p>
                </div>
                <div className="px-6 pb-5 pt-3 flex justify-center gap-6">
                  {release.spotify && (
                    <a href={release.spotify} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1DB954] transition-colors text-xs uppercase tracking-wider">Spotify</a>
                  )}
                  {release.apple && (
                    <a href={release.apple} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-wider">Apple</a>
                  )}
                  {release.youtube && (
                    <a href={release.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#FF0000] transition-colors text-xs uppercase tracking-wider">YouTube</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERS */}
      <section id="members" className="py-24 md:py-32 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            <div className="w-full lg:w-[40%] lg:sticky lg:top-24">
              <ScrollReveal>
                <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4">
                  Members
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-wider leading-none mb-8">
                  Meet<br /><span className="text-primary">The</span> Band
                </h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  Each member of {settings.artistName} brings a unique voice and energy to the stage.
                  Together, we create something bigger than any of us could alone.
                </p>
              </ScrollReveal>
            </div>

            <div className="w-full lg:w-[60%]">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {members.map((member, i) => (
                  <ScrollReveal key={member.name} delay={i * 120}>
                    <div className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-card">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          loading="lazy"
                          sizes="(max-width: 1024px) 45vw, 28vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-card">
                          <svg className="w-20 h-20 text-primary/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                        <h3 className="text-lg md:text-2xl font-extrabold uppercase tracking-wider text-white drop-shadow-lg">
                          {member.name.split(" ")[0]}
                        </h3>
                        <p className="text-primary text-xs md:text-sm uppercase tracking-wider mt-1">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEOS */}
      <section id="videos" className="py-24 md:py-32 bg-[#0c0c0c]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4 text-center">Watch</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center uppercase tracking-wider">
            <span className="text-primary">Videos</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryVideos.map((video) => (
              <div key={video.id + video.title}>
                <YouTubeThumbnail videoId={video.id} title={video.title} />
                <p className="text-center text-gray-400 mt-3 text-sm font-medium">{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {galleryPhotos.length > 0 && (
        <section id="gallery" className="py-24 md:py-32 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4 text-center">The Gallery</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center uppercase tracking-wider">
              Captured Moments <span className="text-primary">On Stage</span>
            </h2>
            <GalleryLightbox photos={galleryPhotos} />
          </div>
        </section>
      )}

      {/* NEWS */}
      <section id="news" className="py-24 md:py-32 bg-black">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4 text-center">News</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 text-center uppercase tracking-wider">
            Latest News & <span className="text-primary">Articles</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 text-lg">Stay up to date with what&apos;s happening</p>
          <div className="grid md:grid-cols-3 gap-6">
            {news.slice(0, 3).map((post) => (
              <a key={post.title} href={`/news/${post.slug}`} className="bg-card rounded-lg overflow-hidden border border-white/5 hover:border-primary/30 transition-colors group block">
                {post.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-white/5 flex items-center justify-center">
                    <svg className="w-12 h-12 text-primary/20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                  </div>
                )}
                <div className="p-6">
                  <p className="text-primary text-xs uppercase tracking-wider mb-3">{post.date}</p>
                  <h3 className="text-lg font-bold mb-3 uppercase">{post.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{truncateExcerpt(post.excerpt)}</p>
                </div>
              </a>
            ))}
          </div>
          {news.length > 3 && (
            <div className="text-center mt-10">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors uppercase tracking-wider text-sm font-bold"
              >
                View All News
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 bg-[#050505] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-white mb-6">
            {settings.artistName}
          </h3>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gray-300 mb-6">Official Social Media</p>
          <div className="flex justify-center gap-8 mb-10">
            {settings.socialLinks.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="Facebook">
                <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
            {settings.socialLinks.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="Instagram">
                <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            )}
            {settings.socialLinks.youtube && (
              <a href={settings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="YouTube">
                <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            )}
            {settings.socialLinks.twitter && (
              <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="Twitter/X">
                <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
            {settings.socialLinks.spotify && (
              <a href={settings.socialLinks.spotify} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" aria-label="Spotify">
                <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              </a>
            )}
          </div>
          <p className="text-gray-600 text-xs mb-2">
            &copy; {new Date().getFullYear()} {settings.artistName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function MobileMenuButton() {
  return (
    <div className="md:hidden">
      <input type="checkbox" id="mobile-menu-toggle" className="sr-only peer" />
      <label htmlFor="mobile-menu-toggle" className="cursor-pointer block" aria-label="Toggle menu">
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>
      <label htmlFor="mobile-menu-toggle" className="fixed inset-0 bg-black/80 hidden peer-checked:block z-40 cursor-default" />
      <div className="fixed top-16 right-0 w-64 bg-dark border-l border-white/10 h-[calc(100vh-4rem)] hidden peer-checked:flex flex-col gap-1 p-4 z-50 overflow-y-auto">
        {NAV_LINKS.map((link) => (
          <label key={link.href} htmlFor="mobile-menu-toggle" className="cursor-pointer">
            <a
              href={link.href}
              data-nav-link
              className="block text-sm uppercase tracking-wider text-gray-300 hover:text-primary py-3 px-4 transition-colors"
            >
              {link.label}
            </a>
          </label>
        ))}
      </div>
    </div>
  );
}
