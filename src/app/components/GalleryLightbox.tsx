"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

export default function GalleryLightbox({ photos }: { photos: string[] }) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const close = useCallback(() => setCurrentIndex(null), []);
  const prev = useCallback(
    () =>
      setCurrentIndex((i) => (i !== null && i > 0 ? i - 1 : photos.length - 1)),
    [photos.length]
  );
  const next = useCallback(
    () =>
      setCurrentIndex((i) =>
        i !== null && i < photos.length - 1 ? i + 1 : 0
      ),
    [photos.length]
  );

  useEffect(() => {
    if (currentIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, close, prev, next]);

  useEffect(() => {
    if (currentIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [currentIndex]);

  return (
    <>
      <div className="columns-1 min-[420px]:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, idx) => (
          <button
            key={photo}
            onClick={() => setCurrentIndex(idx)}
            className="break-inside-avoid overflow-hidden rounded-lg group block cursor-pointer w-full"
          >
            <Image
              src={photo}
              alt="Gallery photo"
              width={800}
              height={600}
              loading={idx < 6 ? "eager" : "lazy"}
              className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
            />
          </button>
        ))}
      </div>

      {currentIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 text-white hover:text-primary transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-primary transition-colors cursor-pointer"
            aria-label="Previous photo"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-primary transition-colors cursor-pointer"
            aria-label="Next photo"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[currentIndex]}
              alt="Gallery photo"
              width={1600}
              height={1200}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              priority
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
