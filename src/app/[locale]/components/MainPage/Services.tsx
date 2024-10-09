import { useTranslations } from "next-intl";

import { ServiceCard } from "../ServiceCard/ServiceCard";

import imgService2 from "../../../../../public/assets/images/service2.webp";
import imgService3 from "../../../../../public/assets/images/service3.webp";
import imgService1 from "../../../../../public/assets/images/service1.webp";

export function Services() {
  const services = useTranslations("Services");

  const serviceCards = [
    {
      number: "1.",
      image: imgService1,
      title: services("service-card-1-title"),
      text: services("service-card-1-text"),
      link: "https://www.mihuelladecarbono.app/quiz",
    },
    {
      number: "2.",
      image: imgService2,
      title: services("service-card-2-title"),
      text: services("service-card-2-text"),
      link: services("service-card-2-link"),
    },
    {
      number: "3.",
      image: imgService3,
      title: services("service-card-3-title"),
      text: services("service-card-3-text"),
      link: services("service-card-3-link"),
    },
  ];

  return (
    <section
      className="bg-white min-h-screen flex flex-col lg:flex-row gap-10 lg:gap-20 items-center px-5 lg:px-20 py-16 lg:py-28"
      id="servicios"
    >
      <div className="shrink">
        <p className="text-base/5 uppercase font-bold">{services("title")}</p>
        <h2 className="text-2xl md:text-3xl/10 uppercase font-bold text-teal-medium my-6 lg:mt-10 lg:mb-9">
          {services("subtitle-1")}
          <br />
          {services("subtitle-2")}
        </h2>
        <p className="text-base font-medium text-balance">{services("text")}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 min-w-fit">
        {serviceCards.map((card, index) => (
          <ServiceCard
            key={index}
            number={card.number}
            image={card.image}
            title={card.title}
            text={card.text}
            link={card.link}
          />
        ))}
      </div>
    </section>
  );
}
