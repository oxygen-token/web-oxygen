import { useTranslations } from "next-intl";
import { LinkButton } from "../components/ui/Button2";

export default function PostRegister() {
  const t = useTranslations("PostRegister");

  return (
    <main className="w-screen h-screen grid place-items-center bg-[url('/assets/images/imgTrees.jpg')] bg-cover">
      <div className="bg-white/60 backdrop-blur-lg rounded-xl flex flex-col text-center p-12 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-teal mb-4 tracking-tight text-balance">
          {t("title")}
        </h1>
        <p className="text-base text-balance">{t("message")}</p>

        <LinkButton
          variant="large"
          rounded="full"
          className="w-fit mx-auto mt-12"
          href="/"
        >
          {t("back-link")}
        </LinkButton>
      </div>
    </main>
  );
}
