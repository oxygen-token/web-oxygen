"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { InputWithLabel } from "../ui/InputWithLabel";
import { Button } from "../ui/Button2";

import { post } from "../../../../utils/request";

import logoOxygen from "../../../../../public/assets/images/logo.png";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const t = useTranslations("Login");
  const { register, handleSubmit, formState, setError } = useForm();
  const router = useRouter();

  const onSubmit = async (data: Record<string, string>) => {
    try {
      await post("/login", {
        Email: data.email,
        Pass: data.password,
      });

      router.push("/post-register");
    } catch (err) {
      console.error(JSON.stringify(err));
      if ((err as Response).status === 401) {
        setError("root", {
          type: "400",
          message: t("login-failed"),
        });
      } else {
        setError("root", {
          type: "500",
          message: t("server-error"),
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <Image src={logoOxygen} alt="logo" className="w-full max-w-[200px]" />

      <h2 className="text-center text-3xl/10 font-bold mb-4">
        {t("login-form-title")}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full max-w-sm"
      >
        <InputWithLabel
          variant="large"
          id="email"
          {...register("email", { required: true })}
          label={t("email-field")}
        />

        <div>
          <InputWithLabel
            variant="large"
            type="password"
            id="password"
            {...register("password", { required: true })}
            label={t("password-field")}
          />
          {/* <a className="text-xs mt-2">{t("forgot-password")}</a> */}
        </div>

        <div className="flex flex-col">
          <div className="mb-2 text-red-500 text-xs/4 min-h-4">
            {formState.errors.root?.message}
          </div>
          <Button
            type="submit"
            disabled={!formState.isValid || formState.isSubmitting}
          >
            {t("login-btn")}
          </Button>
        </div>

        <p className="text-sm/5 text-center">
          {t("login-no-account")}{" "}
          <Link
            href="/register"
            className="font-bold hover:underline decoration-2"
          >
            {t("login-cta")}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
