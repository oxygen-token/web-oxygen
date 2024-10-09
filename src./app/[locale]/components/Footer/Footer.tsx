import Image from "next/image";
import { useTranslations } from "next-intl";

import logo from "../../../../../public/assets/images/logo.png";
import {
  PiArrowUpBold,
  PiInstagramLogo,
  PiTwitterLogo,
  PiYoutubeLogo,
} from "react-icons/pi";
import { FaLinkedinIn } from "react-icons/fa6";
import { Button, LinkButton } from "../ui/Button2";
import { InputWithLabel } from "../ui/InputWithLabel";

const socials = [
  {
    name: "instagram",
    href: "https://instagram.com/oxygen.token",
    icon: <PiInstagramLogo />,
  },
  {
    name: "linkedin",
    href: "https://www.linkedin.com/company/oxygentoken",
    icon: <FaLinkedinIn />,
  },
  {
    name: "youtube",
    href: "https://www.youtube.com/channel/UCKO07x_sPDCw8eXy34uwcgA",
    icon: <PiYoutubeLogo />,
  },
  {
    name: "twitter",
    href: "/",
    icon: <PiTwitterLogo />,
  },
] as const;

const links = [
  {
    key: "us-link",
    href: "/nosotros",
  },
  {
    key: "projects-link",
    href: "/proyectos",
  },
  {
    key: "contact-link",
    href: "/contacto",
  },
  {
    key: "joinus-link",
    href: "/joinus",
  },
] as const;

function Footer() {
  const t = useTranslations("Footer");

  return (
    <section className="flex flex-col lg:flex-row py-12 px-10 lg:px-20 lg:pb-24 gap-12 lg:justify-between items-start bg-white">
      <div className="flex flex-col">
        <Image src={logo} className="w-[250px]" alt="logo Oxygen Footer" />
        <div className="flex flex-row gap-4 justify-between">
          {socials.map((social) => (
            <a
              className="rounded-full h-10 w-10 shadow-md bg-white text-teal-medium grid place-items-center text-2xl/none hover:shadow-lg transition-shadow duration-200"
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-2">
          {t("company")}
        </h3>
        <ul>
          {links.map((link) => (
            <li key={link.key} className="text-base/8">
              <a className="hover:underline" href={link.href}>
                {t(link.key)}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4 self-stretch">
        <h3 className="text-2xl font-bold tracking-tight">{t("news")}</h3>
        <form className="flex flex-row items-start gap-2 mb-4">
          <InputWithLabel
            variant="large"
            rounded="full"
            className="grow"
            label=""
            id="newsletterMail"
            placeholder="Mail"
          />
          <Button variant="large" rounded="full" className="mt-2" type="submit">
            {t("news-button")}
          </Button>
        </form>

        <div className="mt-auto self-end">
          <LinkButton
            variant="large"
            rounded="full"
            className="!px-1 w-8 flex flex-row justify-center"
            href="#home"
          >
            <PiArrowUpBold />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

export default Footer;
