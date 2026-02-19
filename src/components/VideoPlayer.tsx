"use client";

import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  title: string;
}

function getYouTubeId(input: string): string | null {
  try {
    const u = new URL(input);
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      // https://www.youtube.com/watch?v=VIDEO_ID
      const v = u.searchParams.get('v');
      if (v) return v;

      // https://www.youtube.com/embed/VIDEO_ID
      const parts = u.pathname.split('/').filter(Boolean);
      const embedIdx = parts.indexOf('embed');
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    }

    return null;
  } catch {
    return null;
  }
}

const VideoPlayer = ({ url, title }: VideoPlayerProps) => {
  const normalizedUrl = (url || '').trim();

  if (!normalizedUrl) {
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-white/10 flex items-center justify-center">
        <p className="text-slate-400">No video URL provided</p>
      </div>
    );
  }

  const youtubeId = getYouTubeId(normalizedUrl);

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-white/10 relative">
      <div className="absolute top-3 right-3 z-10">
        <a
          href={normalizedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-black/60 hover:bg-black/75 text-white text-xs font-semibold px-3 py-2 backdrop-blur border border-white/10"
        >
          Open video
        </a>
      </div>

      {youtubeId ? (
        <iframe
          title={title || 'YouTube video'}
          src={`https://www.youtube.com/embed/${youtubeId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <ReactPlayer
          key={normalizedUrl}
          url={normalizedUrl}
          width="100%"
          height="100%"
          controls
          playing={false}
          pip={false}
          style={{ position: 'absolute', inset: 0 }}
          className="react-player"
        />
      )}
    </div>
  );
};

export default VideoPlayer;