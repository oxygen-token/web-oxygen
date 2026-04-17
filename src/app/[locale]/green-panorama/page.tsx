"use client";

import Script from "next/script";
import { useTranslations } from "next-intl";
import { PiGraph, PiShieldCheck, PiClock, PiArrowSquareOut } from "react-icons/pi";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { LinkButton } from "../components/ui/Button2";

const EMBED_ORIGIN = "https://green-panorama-ar.vercel.app";
const EVENT_SLUG = "blockchainrio-2026";

export default function GreenPanoramaPage() {
  const t = useTranslations("GreenPanorama");

  return (
    <>
      <Navbar />

      <main className="bg-white text-[var(--dark-blue)] pt-[100px] lg:pt-[120px]">
        <section className="px-5 lg:px-20 pb-12 lg:pb-16 max-w-6xl mx-auto">
          <p className="text-teal-accent text-xs tracking-[0.2em] font-semibold mb-4">
            {t("hero-eyebrow")}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-medium mb-4">
            {t("hero-title")}
          </h1>
          <p className="text-xl md:text-2xl text-teal-dark/80 mb-6 max-w-3xl">
            {t("hero-subtitle")}
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
            {t("hero-description")}
          </p>
        </section>

        <section className="px-5 lg:px-20 pb-16 lg:pb-20 max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-[#0a0f1a]">
            <div
              data-green-panorama-event={EVENT_SLUG}
              data-height="820"
              data-theme="dark"
              aria-label={t("widget-aria")}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
            <p className="text-sm text-gray-600">{t("cta-text")}</p>
            <LinkButton
              href={`${EMBED_ORIGIN}/event/${EVENT_SLUG}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="large"
              rounded="full"
              className="inline-flex items-center gap-2"
            >
              {t("cta-button")}
              <PiArrowSquareOut />
            </LinkButton>
          </div>
        </section>

        <section className="bg-[var(--grey)] px-5 lg:px-20 py-16 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-teal-medium mb-10 text-center">
              {t("info-heading")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                icon={<PiGraph />}
                title={t("info-1-title")}
                text={t("info-1-text")}
              />
              <InfoCard
                icon={<PiShieldCheck />}
                title={t("info-2-title")}
                text={t("info-2-text")}
              />
              <InfoCard
                icon={<PiClock />}
                title={t("info-3-title")}
                text={t("info-3-text")}
              />
            </div>
          </div>
        </section>

        <section className="px-5 lg:px-20 py-16 lg:py-20 max-w-6xl mx-auto">
          <div className="bg-teal-medium text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                {t("partner-title")}
              </h3>
              <p className="text-white/85 leading-relaxed">
                {t("partner-text")}
              </p>
            </div>
            <LinkButton
              href="https://industriesverified.com"
              target="_blank"
              rel="noopener noreferrer"
              variant="large"
              rounded="full"
              className="bg-white !text-teal-dark hover:!bg-white/90 hover:!text-teal-dark shrink-0"
            >
              {t("partner-button")}
            </LinkButton>
          </div>
        </section>
      </main>

      <Script
        src={`${EMBED_ORIGIN}/embed/v1.js`}
        strategy="afterInteractive"
      />

      <Footer />
    </>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col gap-3">
      <div className="text-3xl text-teal-accent">{icon}</div>
      <h3 className="text-lg font-semibold text-teal-medium">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}
