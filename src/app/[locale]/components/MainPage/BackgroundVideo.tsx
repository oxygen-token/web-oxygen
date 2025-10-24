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
    <div className="fixed -z-50 inset-0 pointer-events-none bg-black">
      <ClientOnly>
        <div
          ref={playerRef}
          className="absolute top-0 left-0 min-h-full min-w-full aspect-video transition-opacity duration-300"
          style={{ opacity: isLoaded ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
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
