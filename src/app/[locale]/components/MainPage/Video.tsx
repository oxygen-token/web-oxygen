"use client";
import { useTranslations } from "next-intl";
import ReactPlayer from "react-player";
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

      <div className="aspect-video grow max-w-3xl overflow-hidden rounded-xl">
        <ClientOnly>
          <ReactPlayer
            url="https://www.youtube.com/watch?v=ZLd7lNXcinI"
            width="100%"
            height="100%"
            controls
          />
        </ClientOnly>
      </div>
    </section>
  );
}
