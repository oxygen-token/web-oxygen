import { useTranslations } from "next-intl";
import { LinkButton } from "../ui/Button2";

export function Quote() {
  const phrase = useTranslations("phrase");

  return (
    <section className="bg-[url('/assets/images/imgTrees.jpg')] bg-cover bg-no-repeat text-white">
      {/* Black overlay for contrast */}
      <div className="px-5 py-12 lg:p-20 bg-black/20">
        <blockquote className="text-lg lg:text-2xl font-semibold max-w-4xl text-balance mb-6">
          “{phrase("text")}”
        </blockquote>
        <p className="mb-6 lg:mb-12">{phrase("comment")}</p>

        <LinkButton
          href="#servicios"
          variant="large"
          rounded="full"
          className="w-fit"
        >
          {phrase("button")}
        </LinkButton>
      </div>
    </section>
  );
}
