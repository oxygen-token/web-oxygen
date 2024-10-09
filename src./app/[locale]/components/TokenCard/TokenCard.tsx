import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PiArrowRightBold } from "react-icons/pi";

type Props = {
  title: string;
  text: string;
  logo: ReactNode;
  link: string;
};

export function TokenCard({ title, text, logo, link }: Props) {
  const services = useTranslations("Services");

  return (
    <div className="w-72 h-[410px] rounded-2xl p-5 flex flex-col items-center text-center bg-gradient-to-b from-neutral-100 to-white border border-neutral-100">
      <div className="w-20 h-20 grid place-items-center">{logo}</div>

      <h3 className="text-xl font-bold mt-6 mb-4">{title}</h3>
      <p className="text-sm">{text}</p>

      <div className="mt-auto">
        <Link
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-teal-medium hover:underline font-bold decoration-2"
        >
          <div className="flex flex-row items-center gap-2">
            {services("see-more-btn")} <PiArrowRightBold />
          </div>
        </Link>
      </div>
    </div>
  );
}
