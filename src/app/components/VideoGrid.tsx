"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface VideoItem {
  id?: string;
  title: string;
  youtubeUrl?: string | null;
  thumbnailSrc?: string;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function VideoGrid({ videos }: { videos: VideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const closeModal = useCallback(() => setActiveVideo(null), []);

  useEffect(() => {
    if (!activeVideo) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [activeVideo, closeModal]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, i) => {
          const ytId = video.youtubeUrl ? extractYouTubeId(video.youtubeUrl) : null;
          const thumbSrc =
            video.thumbnailSrc ||
            (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "/images/video-thumb.jpg");

          return (
            <button
              key={video.id || i}
              onClick={() => {
                if (ytId) setActiveVideo(ytId);
              }}
              className="group relative aspect-video overflow-hidden bg-card cursor-pointer block w-full"
              aria-label={`Play ${video.title}`}
            >
              <Image
                src={thumbSrc}
                alt={video.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                loading={i < 3 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-background/30 group-hover:bg-background/50 transition-colors duration-200" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-primary rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-200">
                  <svg
                    className="w-6 h-6 text-primary ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
                <p className="text-foreground text-sm font-medium">{video.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[9999] bg-background/95 flex items-center justify-center p-4 md:p-8"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-foreground/70 hover:text-foreground transition-colors z-10 cursor-pointer"
            aria-label="Close video"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo}?rel=0&autoplay=1`}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
