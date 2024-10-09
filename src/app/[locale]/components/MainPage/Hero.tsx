import { ReactNode, Fragment, useMemo } from "react";
import { useFormatter, useTranslations } from "next-intl";

import { LinkButton } from "../ui/Button2";

type DataItemProps = {
  number: number;
  content: ReactNode;
};

function DataItem({ number, content }: DataItemProps) {
  const format = useFormatter();
  return (
    <div className="flex flex-row items-center gap-3">
      <strong className="font-bold text-4xl/10">{format.number(number)}</strong>
      <p className="text-base/5">{content}</p>
    </div>
  );
}

export function Hero() {
  const layout = useTranslations("Layout");

  const dataItems = useMemo(
    () => [
      {
        number: 133_150,
        content: (
          <>
            {layout("data-content-1")} <br />
            {layout("data-content-11")}
          </>
        ),
      },
      {
        number: 190_214,
        content: (
          <>
            {layout("data-content-2")} <br />
            {layout("data-content-21")}
          </>
        ),
      },
      {
        number: 27_548,
        content: (
          <>
            {layout("data-content-3")} <br />
            {layout("data-content-31")}
          </>
        ),
      },
    ],
    [layout]
  );

  return (
    <section
      className="px-5 lg:px-20 pt-32 lg:pt-48 pb-24 text-white"
      id="home"
    >
      <h1 className="text-4xl/10 lg:text-6xl/snug font-semibold">
        {layout("title")}
      </h1>

      <h3 className="mt-6 lg:mt-12 text-lg lg:text-2xl font-medium text-balance max-w-3xl">
        {layout("subtitle-1")}
        {layout("subtitle-2")}
      </h3>

      <LinkButton
        variant="large"
        rounded="full"
        className="mt-8 lg:mt-16 w-fit"
        href="#servicios"
      >
        {layout("button")}
      </LinkButton>

      <div className="mt-14 lg:mt-28 flex flex-col lg:flex-row items-center gap-8 justify-between rounded-xl bg-white/30 backdrop-blur p-9">
        {dataItems.map((item, i) => (
          <Fragment key={i}>
            {i > 0 ? (
              <hr className="w-full h-1 lg:h-10 lg:w-1 rounded-full bg-white border-none" />
            ) : null}
            <DataItem {...item} />
          </Fragment>
        ))}
      </div>
    </section>
  );
}
