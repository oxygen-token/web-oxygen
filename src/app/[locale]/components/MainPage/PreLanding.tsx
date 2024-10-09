"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

// Assets
import logoGeneral from "../../../../../public/assets/images/logo_slogan.png";
import { Button } from "../ui/Button2";

const ANIM_TIMEOUT = 1000;

export function PreLanding() {
  const layout = useTranslations("Layout");

  const hasEnteredBefore = sessionStorage.getItem("hasEnteredBefore") !== null;
  const [hidden, setHidden] = useState(hasEnteredBefore);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleHidePrevHome = () => {
    setShowAnimation(true);
    sessionStorage.setItem("hasEnteredBefore", "true");

    setTimeout(() => {
      setHidden(true);
    }, ANIM_TIMEOUT);
  };

  if (hidden) return null;

  return showAnimation ? (
    <div
      className="fixed inset-0 z-[100] grid place-items-center prelanding-anim-root"
      style={{ "--anim-length": `${ANIM_TIMEOUT}ms` } as any}
    >
      <div className="absolute inset-0 prelanding-bg" />
      <div className="w-[100px] h-[100px] grid place-items-center relative">
        <TreesIcon />
        <div className="absolute inset-0 rounded-full border-[6px] border-white border-t-green-dark prelanding-spinner" />
      </div>
    </div>
  ) : (
    <section className="fixed inset-0 z-[100] grid place-items-center p-20 bg-[url('/assets/images/imgPrevia4.png')] bg-cover bg-neutral-800">
      <Image
        className="absolute top-4 left-4 w-60"
        src={logoGeneral}
        alt="logo Oxygen"
      />

      <div className="text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight mb-12">
          {layout("prevTitle")}
        </h1>
        <Button
          variant="large"
          rounded="full"
          className="px-10"
          onClick={handleHidePrevHome}
        >
          {layout("prevButton")}
        </Button>
      </div>
    </section>
  );
}

function TreesIcon() {
  return (
    <svg
      viewBox="0 0 81 87"
      width={60}
      height={60}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M49.84 64.443V86h8.098V64.747c0-.168.136-.304.304-.304h21.683c.059 0 .095-.061.063-.108l-10.915-16.44c-.03-.047.005-.108.064-.108h7.779c.058 0 .094-.06.063-.108l-10.78-16.26c-.03-.048.005-.109.064-.109h7.45c.059 0 .095-.06.064-.108L53.95 1.033a.077.077 0 0 0-.127 0L40.5 21.31M23.066 86V64.747a.303.303 0 0 0-.303-.304H1.075c-.059 0-.095-.061-.063-.108l10.919-16.44c.031-.047-.005-.108-.063-.108h-7.78c-.058 0-.094-.06-.063-.108l10.78-16.26c.03-.048-.005-.109-.064-.109h-7.45c-.059 0-.094-.06-.063-.108L27.049 1.033a.077.077 0 0 1 .127 0l19.826 30.169c.031.047-.005.108-.063.108h-7.45c-.06 0-.095.061-.064.108l10.78 16.261c.03.047-.005.108-.064.108h-7.779c-.059 0-.095.062-.063.108l10.92 16.44c.03.047-.005.108-.064.108H31.467a.303.303 0 0 0-.303.304V86h-8.098Z"
        className="stroke-white"
        strokeWidth="1.733"
        strokeMiterlimit="10"
      />
    </svg>
  );
}
