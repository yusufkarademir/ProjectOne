'use client';

import { useEffect, useRef } from 'react';

interface CinemaViewProps {
  config: any;
}

export default function CinemaView({ config }: CinemaViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay failed:', e));
    }
  }, []);

  if (!config.videoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <p className="text-2xl">Video URL tanımlanmamış</p>
      </div>
    );
  }

  // Helper to extract YouTube ID and List ID
  const getYoutubeDetails = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    const listMatch = url.match(/[?&]list=([^#&?]+)/);
    const listId = listMatch ? listMatch[1] : null;

    return { videoId, listId };
  };

  const { videoId, listId } = getYoutubeDetails(config.videoUrl);

  if (videoId) {
    const playlistParam = listId ? `&list=${listId}` : `&playlist=${videoId}`;
    return (
      <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&loop=1${playlistParam}&mute=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full pointer-events-none scale-110" // Scale to hide controls/borders if any
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={config.videoUrl}
        className="w-full h-full object-contain"
        loop
        controls={false}
        playsInline
      />
    </div>
  );
}
