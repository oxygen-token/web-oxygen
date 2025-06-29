import { useTranslations } from "next-intl";

import { TokenCard } from "../TokenCard/TokenCard";
import { OCTokenIcon, OMTokenIcon, TokenIcon } from "../TokenCard/icons";

export function Tokens() {
  const issuedtokens = useTranslations("issuedTokens");

  const tokens = [
    {
      logo: <TokenIcon />,
      title: issuedtokens("issued-token-1-title"),
      text: issuedtokens("issued-token-1-text"),
      link: "",
    },
    {
      logo: <OMTokenIcon />,
      title: issuedtokens("issued-token-2-title"),
      text: issuedtokens("issued-token-2-text"),
      link: "",
    },
    {
      logo: <OCTokenIcon />,
      title: issuedtokens("issued-token-3-title"),
      text: issuedtokens("issued-token-3-text"),
      link: "",
    },
  ] as const;

  return (
    <section className="bg-white flex flex-col items-center px-5 lg:px-20 pb-16 lg:pb-32">
      <p className="text-base/5 uppercase font-bold">{issuedtokens("title")}</p>
      <h2 className="text-2xl md:text-3xl/10 uppercase text-center font-bold text-teal-medium my-6 lg:mt-10 lg:mb-20">
        {issuedtokens("subtitle-1")} <br /> {issuedtokens("subtitle-2")}
      </h2>

      <div className="flex flex-col lg:flex-row gap-10">
        {tokens.map((token, index) => (
          <TokenCard
            key={index}
            logo={token.logo}
            title={token.title}
            text={token.text}
            link={token.link}
          />
        ))}
      </div>
    </section>
  );
}
