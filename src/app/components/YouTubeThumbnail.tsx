"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function YouTubeThumbnail({
  videoId,
  title,
  start,
  end,
  thumbnailUrl,
}: {
  videoId: string;
  title: string;
  start?: number;
  end?: number;
  thumbnailUrl?: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const localThumb = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const [thumbSrc, setThumbSrc] = useState(localThumb);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox]);

  let embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`;
  if (start) embedSrc += `&start=${start}`;
  if (end) embedSrc += `&end=${end}`;

  return (
    <>
      <button
        onClick={() => setLightboxOpen(true)}
        className="relative w-full aspect-video rounded-lg overflow-hidden group cursor-pointer block"
        aria-label={`Play ${title}`}
      >
        <Image
          src={thumbSrc}
          alt={title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className="object-cover"
          onError={() => setThumbSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-white/80 rounded-full flex items-center justify-center group-hover:border-white group-hover:scale-110 transition-all backdrop-blur-[2px]">
            <svg
              className="w-7 h-7 md:w-9 md:h-9 text-white/90 group-hover:text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 md:p-8"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close video"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <p className="absolute top-4 left-4 md:top-6 md:left-6 text-white/70 text-sm md:text-base font-bold uppercase tracking-wider">
            {title}
          </p>

          <div
            className="w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={embedSrc}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
