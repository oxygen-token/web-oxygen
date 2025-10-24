"use client";
import { useTranslations } from "next-intl";
import { ClientOnly } from "../ClientOnly/ClientOnly";

export function Video() {
  const videointro = useTranslations("videoIntro");

  return (
    <section className="bg-teal text-white flex flex-col lg:flex-row-reverse px-5 lg:px-20 py-12 lg:pt-28 gap-6 lg:items-end">
      <div>
        <p className="text-base/5 uppercase font-bold text-teal-dark">
          {videointro("title")}
        </p>
        <h2 className="text-2xl md:text-3xl/10 uppercase font-bold my-6 lg:my-10">
          {videointro("subtitle-1")} <br /> {videointro("subtitle-2")}{" "}
          <span className="text-teal-accent">{videointro("subtitle-3")}</span>
        </h2>
        <p className="max-w-md">{videointro("text")}</p>
      </div>

      <div className="aspect-video grow max-w-3xl overflow-hidden rounded-xl relative">
        <ClientOnly>
          <video
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            poster="/assets/images/forest.jpg"
            playsInline
            muted
            loop
            autoPlay
          >
            <source src="/assets/videos/forestHD.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none"></div>
        </ClientOnly>
      </div>
    </section>
  );
}
