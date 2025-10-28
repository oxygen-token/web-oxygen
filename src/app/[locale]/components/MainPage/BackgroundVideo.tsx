"use client";
import { ClientOnly } from "../ClientOnly/ClientOnly";
import { useRef, useEffect, useState } from "react";

let globalVideoLoaded = false;
let globalVideoElement: HTMLVideoElement | null = null;

export function BackgroundVideo() {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(globalVideoLoaded);

  useEffect(() => {
    if (globalVideoLoaded && globalVideoElement) {
      if (playerRef.current) {
        playerRef.current.style.opacity = "1";
      }
      setIsLoaded(true);
      return;
    }

    const video = videoRef.current;
    if (video && !globalVideoLoaded) {
      video.load();
      globalVideoElement = video;
      globalVideoLoaded = true;
      setIsLoaded(true);
    }
  }, []);

  const showVideo = () => {
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.style.removeProperty("opacity");
      }
    }, 100);
  };

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        width: '100vw', 
        height: '100vh',
        zIndex: -50,
        pointerEvents: 'none',
        backgroundColor: 'black'
      }}
    >
      <ClientOnly>
        <div
          ref={playerRef}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        >
          <video
            ref={videoRef}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%',
              objectFit: 'cover'
            }}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={showVideo}
            onCanPlayThrough={() => setIsLoaded(true)}
          >
            <source src="/assets/videos/forestHD.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none"></div>
        </div>
      </ClientOnly>
    </div>
  );
}
