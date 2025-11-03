"use client";
import { useTranslations } from "next-intl";
import { ClientOnly } from "../ClientOnly/ClientOnly";

export function Video() {
  const videointro = useTranslations("videoIntro");

  return (
    <section className="bg-teal text-white">
      
      <div className="flex flex-col lg:flex-row-reverse px-5 lg:px-20 py-16 lg:py-28 gap-8 lg:gap-12 lg:items-center">
        <div className="flex-1 lg:max-w-lg">
          <p className="text-sm lg:text-base uppercase font-bold text-teal-accent tracking-wider mb-4">
          {videointro("title")}
        </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl uppercase font-bold my-6 lg:my-10 leading-tight">
          {videointro("subtitle-1")} <br /> {videointro("subtitle-2")}{" "}
          <span className="text-teal-accent">{videointro("subtitle-3")}</span>
        </h2>
          <p className="text-base lg:text-lg text-white/90 max-w-md leading-relaxed">
            {videointro("text")}
          </p>
      </div>

        <div className="flex-1 max-w-4xl">
          <div className="relative">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
        <ClientOnly>
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/ZLd7lNXcinI?controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0"
                  title="Oxygen Manifesto"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
        </ClientOnly>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}
