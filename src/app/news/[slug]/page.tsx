import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { getMediaUrl } from "@/lib/media";
import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function extractTextFromRichText(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const root = (content as { root?: { children?: unknown[] } }).root;
  if (!root?.children) return "";

  const texts: string[] = [];
  function walk(nodes: unknown[]) {
    for (const node of nodes) {
      if (node && typeof node === "object") {
        const n = node as { text?: string; children?: unknown[] };
        if (typeof n.text === "string") texts.push(n.text);
        if (Array.isArray(n.children)) walk(n.children);
      }
    }
  }
  walk(root.children);
  return texts.join("");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<import("next").Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  const description = post.excerpt || post.content.slice(0, 160);
  return {
    title: `${post.title} | The Voltage`,
    description,
    openGraph: {
      title: `${post.title} | The Voltage`,
      description,
      ...(post.image && { images: [{ url: post.image }] }),
      type: "article",
    },
  };
}

async function getPost(slug: string) {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "news-posts",
      where: { slug: { equals: slug } },
      limit: 1,
    });

    if (result.docs.length > 0) {
      const doc = result.docs[0];
      const title = doc.title as string;
      const richTextContent = extractTextFromRichText(doc.content);
      const featuredImage = doc.featuredImage as { url?: string } | number | null;
      const featuredUrl = (featuredImage && typeof featuredImage === "object") ? getMediaUrl(featuredImage) : "";
      return {
        title,
        slug: doc.slug as string,
        excerpt: (doc.excerpt as string) || "",
        content: richTextContent || (doc.excerpt as string) || "",
        richContent: doc.content as SerializedEditorState | null,
        publishedDate: doc.publishedDate as string,
        image: featuredUrl || "",
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch post from CMS:", error);
    return null;
  }
}

export const revalidate = 60;

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

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
            Back to News
          </Link>
        </div>
      </nav>

      {post.image && (
        <div className="relative w-full h-[40vh] md:h-[50vh] mt-16">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      <article className={`max-w-3xl mx-auto px-4 ${post.image ? '-mt-20' : 'mt-24'} relative z-10 pb-20`}>
        <p className="text-primary text-sm uppercase tracking-wider mb-4">
          {formatFullDate(post.publishedDate)}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-tight">
          {post.title}
        </h1>
        <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-headings:uppercase prose-headings:tracking-tight prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-gray-300 prose-blockquote:border-primary prose-blockquote:text-gray-400">
          {post.excerpt && (
            <p className="text-xl text-gray-300 leading-relaxed mb-6 font-medium">
              {post.excerpt}
            </p>
          )}
          {post.richContent ? (
            <PayloadRichText data={post.richContent} disableContainer />
          ) : post.content !== post.excerpt ? (
            <p className="text-gray-400 leading-relaxed text-lg">
              {post.content}
            </p>
          ) : null}
        </div>
        <div className="mt-12 pt-8 border-t border-white/10">
          <Link
            href="/#news"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors uppercase tracking-wider text-sm font-bold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News
          </Link>
        </div>
      </article>
    </div>
  );
}
