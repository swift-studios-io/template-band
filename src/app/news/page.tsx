import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import { getMediaUrl } from "@/lib/media";

function formatNewsDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function truncate(text: string, max: number): string {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

export const revalidate = 60;

export const metadata = {
  title: "News | The Voltage",
  description: "Latest news, updates, and announcements from The Voltage.",
  openGraph: {
    title: "News | The Voltage",
    description: "Latest news, updates, and announcements from The Voltage.",
    type: "website" as const,
  },
};

export default async function NewsPage() {
  const payload = await getPayload({ config });

  const isStaging = process.env.NEXT_PUBLIC_SITE_ENV === "staging";
  const statusFilter = isStaging ? undefined : { _status: { equals: "published" as const } };

  const newsRes = await payload
    .find({
      collection: "news-posts",
      sort: "-publishedDate",
      limit: 50,
      ...(statusFilter && { where: statusFilter }),
      draft: isStaging,
    })
    .catch(() => ({ docs: [] }));

  const posts = newsRes.docs.map((post) => {
    const featuredImage = post.featuredImage as { url?: string } | number | null;
    const featuredUrl =
      featuredImage && typeof featuredImage === "object" ? getMediaUrl(featuredImage) : "";
    return {
      title: post.title as string,
      slug: (post.slug as string) || "",
      excerpt: (post.excerpt as string) || "",
      date: formatNewsDate(post.publishedDate as string),
      image: featuredUrl || "",
      status: (post._status as string) || "published",
    };
  });

  return (
    <div className="min-h-screen bg-background text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/#home" className="flex-shrink-0 font-heading text-xl font-black uppercase tracking-wider text-white">
            The Voltage
          </Link>
          <Link
            href="/#news"
            className="text-sm uppercase tracking-wider text-gray-300 hover:text-primary transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight mb-4">News</h1>
          <p className="text-gray-400 text-lg">Latest updates</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-20">No news posts yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="bg-card rounded-lg overflow-hidden border border-white/5 hover:border-primary/30 transition-colors group block"
              >
                {post.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    {post.status === "draft" && (
                      <span className="absolute top-3 right-3 bg-yellow-600 text-white text-xs font-bold uppercase px-2 py-1 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-white/5 flex items-center justify-center">
                    <svg className="w-12 h-12 text-primary/20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                  </div>
                )}
                <div className="p-6">
                  <p className="text-primary text-xs uppercase tracking-wider mb-3">{post.date}</p>
                  <h3 className="text-lg font-bold mb-3 uppercase">{post.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {truncate(post.excerpt, 150)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="py-12 bg-[#050505] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} The Voltage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
