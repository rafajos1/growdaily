"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/**
 * A YouTube video that loads only when someone presses play, in YouTube's
 * privacy-enhanced mode, with the creator credited under it.
 */
export function VideoEmbed({ id, title, creator, channelUrl }: { id: string; title: string; creator: string; channelUrl: string }) {
  const [playing, setPlaying] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;
  return (
    <figure className="mt-8">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-sunken">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play video: ${title}, by ${creator}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" loading="lazy" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber text-amber-ink shadow-xl shadow-black/40 transition group-hover:scale-105">
                <Play className="ml-1 h-7 w-7" aria-hidden />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-muted">
        <span className="font-semibold text-soft">{title}</span> · Video by{" "}
        <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-amber underline-offset-2 hover:underline">
          {creator}
        </a>{" "}
        ·{" "}
        <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-fg hover:underline">
          Watch on YouTube
        </a>
      </figcaption>
    </figure>
  );
}
