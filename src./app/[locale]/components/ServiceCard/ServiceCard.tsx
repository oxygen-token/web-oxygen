import Image, { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { LinkButton } from "../ui/Button2";

type Props = {
  image: StaticImageData;
  title: string;
  text: string;
  number: string;
  link: string;
};

export function ServiceCard({ image, title, text, number, link }: Props) {
  const services = useTranslations("Services");

  return (
    <div className="[perspective:1000px] transform-gpu group drop-shadow-md">
      <div className="relative w-60 h-96 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden">
          <Image
            alt=""
            src={image}
            layout="fill"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent to-50%" />
          <p className="absolute bottom-5 right-5 text-white text-base/5 font-medium">
            {title}
          </p>
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden [transform:rotateY(180deg)] bg-teal-medium text-white p-4 flex flex-col">
          <p className="text-teal-lighter text-5xl font-bold">{number}</p>
          <h2 className="text-2xl">{title}</h2>
          <p className="text-sm mt-6 text-balance">{text}</p>

          <LinkButton
            href={link}
            target="_blank"
            rel="noreferrer"
            rounded="full"
            variant="large"
            className="mt-auto mb-8 border border-current bg-transparent hover:bg-white/30 text-center bg-gradient-to-r from-white/30 to-transparent"
          >
            {services("see-more-btn")}
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
