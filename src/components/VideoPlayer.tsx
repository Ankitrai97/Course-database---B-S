"use client";

import React from 'react';
import ReactPlayer from 'react-player/youtube';

interface VideoPlayerProps {
  url: string;
  title: string;
}

const VideoPlayer = ({ url, title }: VideoPlayerProps) => {
  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-white/10">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        config={{
          youtube: {
            playerVars: { showinfo: 1 }
          }
        }}
      />
    </div>
  );
};

export default VideoPlayer;