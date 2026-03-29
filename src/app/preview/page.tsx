import ScrollReveal from "../components/ScrollReveal";
import YouTubeThumbnail from "../components/YouTubeThumbnail";
import ScrollToTop from "../components/ScrollToTop";
import ActiveNav from "../components/ActiveNav";
import Footer from "../components/Footer";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#tour", label: "Tour" },
  { href: "#streaming", label: "Music" },
  { href: "#members", label: "Band" },
  { href: "#videos", label: "Videos" },
  { href: "#news", label: "News" },
];

const ARTIST_NAME = "The Voltage";
const TAGLINE = "Turn It Up";

const BIO = "The Voltage is an electrifying four-piece band that blends raw energy with polished songwriting. Formed in a cramped garage in Austin, TX, the band quickly built a reputation for explosive live shows and hooks that stick with you for days. Drawing inspiration from classic rock legends and modern indie pioneers, The Voltage creates a sound that feels both timeless and fresh. Their debut EP 'Afterglow' earned critical acclaim and a loyal following across the touring circuit. With a debut album on the horizon and a packed summer tour schedule, The Voltage is ready to bring their signature sound to stages everywhere.";

const TOUR_DATES = [
  { date: "2026-04-12", venue: "The Electric Room", city: "Austin, TX", ticketLink: "#", linkType: "tickets", showTime: "Doors 7pm, Show 8pm" },
  { date: "2026-04-25", venue: "Sunset Strip Music Festival", city: "Los Angeles, CA", ticketLink: "#", linkType: "tickets" as const },
  { date: "2026-05-03", venue: "The Blue Note", city: "Nashville, TN", ticketLink: null, showTime: "9:00 PM" },
  { date: "2026-05-17", venue: "Mercury Lounge", city: "New York, NY", ticketLink: "#", linkType: "tickets" as const },
  { date: "2026-06-07", venue: "Summer Sounds Festival", city: "Denver, CO", ticketLink: null },
  { date: "2026-06-21", venue: "The Fillmore", city: "San Francisco, CA", ticketLink: "#", linkType: "tickets" as const },
  { date: "2026-07-04", venue: "Freedom Fest Main Stage", city: "Chicago, IL", ticketLink: null },
  { date: "2026-07-19", venue: "The Roxy Theatre", city: "Atlanta, GA", ticketLink: "#", linkType: "tickets" as const },
];

const MEMBERS = [
  { name: "Mika Torres", role: "Lead Vocals / Guitar" },
  { name: "Jax Rivera", role: "Lead Guitar" },
  { name: "Sasha Kim", role: "Bass / Backing Vocals" },
  { name: "Remy Okafor", role: "Drums" },
];

const RELEASES = [
  { title: "Neon Highways", type: "Album" },
  { title: "Static Heart", type: "Single" },
  { title: "Afterglow", type: "EP" },
];

const VIDEOS = [
  { title: "Live at The Electric Room", id: "dQw4w9WgXcQ" },
  { title: "Static Heart — Official Video", id: "dQw4w9WgXcQ" },
  { title: "Backstage Diary Ep. 1", id: "dQw4w9WgXcQ" },
];

const NEWS = [
  {
    title: "NEW ALBUM ANNOUNCEMENT",
    excerpt: "The Voltage is thrilled to announce our debut album 'Neon Highways' dropping this summer. Pre-save now on all platforms.",
    date: "March 2026",
  },
  {
    title: "SUMMER TOUR ANNOUNCED",
    excerpt: "We're hitting the road this summer with stops across the US. Tickets on sale now for select dates.",
    date: "February 2026",
  },
  {
    title: "BEHIND THE SCENES",
    excerpt: "Take a look inside our recording sessions for the upcoming album. New sounds, new energy, same voltage.",
    date: "January 2026",
  },
];

const SOCIAL_LINKS = {
  instagram: "#",
  facebook: "#",
  youtube: "#",
  spotify: "#",
  twitter: "#",
  tiktok: "#",
  linkedin: null,
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return {
    day: d.getDate(),
    dayOfWeek: d.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
}

function truncateExcerpt(text: string, max = 120): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

export const metadata = {
  title: "Template Preview | template-band",
  description: "Preview all sections of the band/artist site template with placeholder content.",
};

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-background text-white">
      <ActiveNav />
      <ScrollToTop />

      {/* Preview Banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-white text-center py-1.5 text-xs font-bold uppercase tracking-wider">
        Template Preview — All sections with placeholder content
      </div>

      {/* NAV */}
      <nav id="main-nav" className="fixed top-7 left-0 right-0 z-50 backdrop-blur-sm border-b transition-colors duration-300" style={{ backgroundColor: "transparent", borderBottomColor: "transparent" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <a href="#home" className="flex-shrink-0 font-heading text-xl font-black uppercase tracking-wider text-white">
            {ARTIST_NAME}
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
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-wider mb-6 text-white">
            {ARTIST_NAME}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 tracking-[0.25em] uppercase font-light mb-10">
            {TAGLINE}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#tour" className="inline-block px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-wider transition-colors">
              See Tour Dates
            </a>
            <a href="#streaming" className="inline-block px-8 py-3 border-2 border-white/60 hover:border-white text-white font-bold uppercase tracking-wider transition-colors">
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
            <p className="text-primary text-[11px] font-bold uppercase tracking-[0.35em] mb-5">{ARTIST_NAME}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 uppercase leading-[1.15] tracking-tight">
              About <span className="text-primary">Us</span>
            </h2>
            <p className="text-[#b0b0b0] text-[15px] md:text-[16px] leading-[1.75]">{BIO}</p>
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
            {TOUR_DATES.map((show, i) => {
              const d = formatDate(show.date);
              return (
                <div key={i} className="flex flex-wrap md:flex-nowrap items-center py-6 px-2 md:px-4 hover:bg-white/[0.03] transition-colors gap-4 md:gap-10">
                  <div className="min-w-[70px] md:min-w-[110px] flex-shrink-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl md:text-5xl font-black text-primary leading-none">{d.day}</span>
                      <span className="text-xs md:text-sm font-bold text-gray-300 uppercase">{d.dayOfWeek}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">{d.month} {d.year}</span>
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
                    <span className="flex-shrink-0 text-xs md:text-sm font-bold uppercase tracking-wider text-white bg-primary w-[110px] md:w-[130px] py-2 md:py-3 text-center">
                      {show.linkType === 'tickets' ? 'Tickets' : 'More Info'}
                    </span>
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
            {RELEASES.map((release) => (
              <div key={release.title} className="bg-card rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="w-full aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-primary/30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                  </div>
                  <h3 className="font-bold text-xl text-white mb-1">{release.title}</h3>
                  <p className="text-gray-500 text-sm">{release.type}</p>
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
                <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4">Members</p>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-wider leading-none mb-8">
                  Meet<br /><span className="text-primary">The</span> Band
                </h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  Each member of {ARTIST_NAME} brings a unique voice and energy to the stage.
                  Together, we create something bigger than any of us could alone.
                </p>
              </ScrollReveal>
            </div>

            <div className="w-full lg:w-[60%]">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {MEMBERS.map((member, i) => (
                  <ScrollReveal key={member.name} delay={i * 120}>
                    <div className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-card">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-20 h-20 text-primary/20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                        <h3 className="text-lg md:text-2xl font-extrabold uppercase tracking-wider text-white drop-shadow-lg">
                          {member.name.split(" ")[0]}
                        </h3>
                        <p className="text-primary text-xs md:text-sm uppercase tracking-wider mt-1">{member.role}</p>
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
            {VIDEOS.map((video) => (
              <div key={video.title}>
                <YouTubeThumbnail videoId={video.id} title={video.title} />
                <p className="text-center text-gray-400 mt-3 text-sm font-medium">{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="py-24 md:py-32 bg-black">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4 text-center">News</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 text-center uppercase tracking-wider">
            Latest News & <span className="text-primary">Articles</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 text-lg">Stay up to date with what&apos;s happening</p>
          <div className="grid md:grid-cols-3 gap-6">
            {NEWS.map((post) => (
              <div key={post.title} className="bg-card rounded-lg overflow-hidden border border-white/5 group">
                <div className="aspect-[16/9] bg-white/5 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary/20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                </div>
                <div className="p-6">
                  <p className="text-primary text-xs uppercase tracking-wider mb-3">{post.date}</p>
                  <h3 className="text-lg font-bold mb-3 uppercase">{post.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{truncateExcerpt(post.excerpt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer artistName={ARTIST_NAME} socialLinks={SOCIAL_LINKS} />
    </div>
  );
}
