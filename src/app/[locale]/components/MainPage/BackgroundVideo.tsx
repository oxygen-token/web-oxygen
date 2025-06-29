"use client";
import ReactPlayer from "react-player";
import { ClientOnly } from "../ClientOnly/ClientOnly";
import { useRef } from "react";

export function BackgroundVideo() {
  const playerRef = useRef<HTMLDivElement>(null);

  const showVideo = () => {
    setTimeout(() => playerRef.current?.style.removeProperty("opacity"), 500);
  };

  return (
    <div className="fixed -z-50 inset-0 pointer-events-none bg-[url('/assets/images/DronLaFlorencia.webp')] bg-cover bg-no-repeat]">
      <ClientOnly>
        <div
          ref={playerRef}
          className="absolute top-0 left-0 min-h-full min-w-full aspect-video transition-opacity duration-500"
          style={{ opacity: 0 }}
        >
          <ReactPlayer
            url="https://www.youtube.com/watch?v=rmxCvK6rMYU"
            width="100%"
            height="100%"
            playing={true}
            loop={true}
            onReady={showVideo}
            muted
          />
        </div>
      </ClientOnly>
    </div>
  );
}
