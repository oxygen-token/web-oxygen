import { useTranslations } from "next-intl";
import Image from "next/image";

import { LogoBDB } from "./logos";

import chronosPayLogo from "../../../../../public/assets/logos/chronosPayLogo.png";
import finguruLogo from "../../../../../public/assets/logos/finguruLogo.png";

function Partnerships() {
  const partnerships = useTranslations("partnerships");

  return (
    <section className="bg-teal text-white flex flex-col text-center px-5 lg:px-20 py-12">
      <h3 className="text-2xl uppercase font-bold mb-12">
        {partnerships("title")}
      </h3>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:justify-center">
        <LogoBDB height={40} className="text-[#202020]" />
        <Image height={40} src={chronosPayLogo} alt="Chronos Pay" />
        <Image height={40} src={finguruLogo} alt="Finguru" />
      </div>
    </section>
  );
}

export default Partnerships;
