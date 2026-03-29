"use client";

import { useState, useEffect, useCallback } from "react";

export default function YouTubeThumbnailButton({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
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

  return (
    <>
      <button
        onClick={() => setLightboxOpen(true)}
        className="w-20 h-20 md:w-24 md:h-24 border-2 border-white/70 rounded-full flex items-center justify-center hover:border-white hover:scale-110 transition-all cursor-pointer backdrop-blur-[2px]"
        aria-label={`Play ${title}`}
      >
        <svg className="w-8 h-8 md:w-10 md:h-10 text-white/90 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
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
          <div className="w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`}
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
