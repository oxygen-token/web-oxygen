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
  { key: "us-link", href: "/nosotros" },
  { key: "projects-link", href: "/proyectos" },
  { key: "contact-link", href: "/contacto" },
  { key: "joinus-link", href: "/joinus" },
] as const;

const resources = [
  { label: "Community", href: "/seobot-blog" },
  { label: "Calculator", href: "/calculadora" },
  { label: "Whitepaper", href: "/whitepaper" },
] as const;

const legal = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

function Footer() {
  const t = useTranslations("Footer");

  return (
    <section className="bg-black text-white">
      <div className="max-w-7xl mx-auto py-14 px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-6">
            <Image src={logo} className="w-[200px]" alt="logo Oxygen Footer" />
            <div className="flex flex-row gap-3">
          {socials.map((social) => (
            <a
                  className="rounded-full h-10 w-10 bg-white/10 text-white grid place-items-center text-2xl/none hover:bg-white/20 transition-colors"
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
            <h3 className="text-lg font-semibold tracking-tight mb-3">{t("company")}</h3>
            <ul className="space-y-2 text-white/80">
          {links.map((link) => (
                <li key={link.key}>
                  <a className="hover:text-white" href={link.href}>
                {t(link.key)}
              </a>
            </li>
          ))}
        </ul>
      </div>

          <div>
            <h3 className="text-lg font-semibold tracking-tight mb-3">Resources</h3>
            <ul className="space-y-2 text-white/80">
              {resources.map((r) => (
                <li key={r.label}>
                  <a className="hover:text-white" href={r.href}>{r.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold tracking-tight">{t("news")}</h3>
            <form className="flex items-center gap-3">
          <InputWithLabel
            variant="large"
            rounded="full"
            className="grow"
                inputClassName="bg-white/10 backdrop-blur-md border-white/15 hover:bg-white/15 focus:bg-white/15 shadow-inner"
            label=""
            id="newsletterMail"
            placeholder="Mail"
          />
              <Button variant="large" rounded="full" type="submit">
            {t("news-button")}
          </Button>
        </form>
            <div>
              <h4 className="text-lg font-semibold tracking-tight mb-3">Legal</h4>
              <ul className="flex gap-6 text-white/80">
                {legal.map((l) => (
                  <li key={l.label}><a className="hover:text-white" href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-sm text-white/70 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Oxygen. All rights reserved.</span>
          <span>Built for a greener future</span>
        </div>
      </div>
    </section>
  );
}

export default Footer;
