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
      link: "https://goes.bue.edu.ar/multimedia/huellaco2/app/",
      buttonText: services("see-more-btn"),
    },
    {
      number: "2.",
      image: imgService2,
      title: services("service-card-2-title"),
      text: (
        <>
          {services("service-card-2-text") + " "}
          <span className="font-bold text-yellow-400 ml-1">
            <br />
            <br />
            {services("service-card-2-highlight")}
          </span>
        </>
      ),
      link: services("service-card-2-link"),
      buttonText: services("buy-OM-btn"),
    },
    {
      number: "3.",
      image: imgService3,
      title: services("service-card-3-title"),
      text: (
        <>
          {services("service-card-3-text") + " "}
          <span className="font-bold text-yellow-400 text-xl ml-1">
            <br />
            <br />
            {services("service-card-3-equivalence")}
          </span>
        </>
      ),      link: services("service-card-3-link"),
      buttonText: services("see-more-btn"),
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
            buttonText={card.buttonText}
          />
        ))}
      </div>
    </section>
  );
}
