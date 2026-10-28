"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/**
 * A YouTube Short that loads only when someone presses play, in YouTube's
 * privacy-enhanced mode, with the creator credited beside it.
 */
export function ShortEmbed({ id, title, creator, channelUrl }: { id: string; title: string; creator: string; channelUrl: string }) {
  const [playing, setPlaying] = useState(false);
  const creditLink = "font-semibold text-amber underline-offset-2 hover:underline";
  return (
    <figure className="mt-8 flex flex-col items-center gap-5 rounded-2xl border border-line bg-panel p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="relative aspect-[9/16] w-full max-w-[240px] shrink-0 overflow-hidden rounded-xl bg-sunken sm:w-[200px]">
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
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play short: ${title}, by ${creator}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" loading="lazy" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber text-amber-ink shadow-xl shadow-black/40 transition group-hover:scale-105">
                <Play className="ml-1 h-6 w-6" aria-hidden />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="w-full text-sm text-muted">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-amber">In under a minute</span>
        <span className="mt-2 block text-lg font-bold leading-snug text-fg">{title}</span>
        <span className="mt-1 block">
          Short by{" "}
          <a href={channelUrl} target="_blank" rel="noopener noreferrer" className={creditLink}>
            {creator}
          </a>{" "}
          ·{" "}
          <a href={`https://www.youtube.com/shorts/${id}`} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-fg hover:underline">
            Watch on YouTube
          </a>
        </span>
        <span className="mt-3 block">Thank you to {creator} for this Short. All credit for it goes to them, so please visit their channel.</span>
      </figcaption>
    </figure>
  );
}
