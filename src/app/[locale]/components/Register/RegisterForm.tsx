"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { PiArrowLeftBold } from "react-icons/pi";

import { InputWithLabel } from "../ui/InputWithLabel";
import { Button } from "../ui/Button2";
import { CheckboxWithLabel } from "../ui/CheckboxWithLabel";

import { post } from "../../../../utils/request";

import logoOxygen from "../../../../../public/assets/images/logo.png";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const t = useTranslations("Register");
  const { register, handleSubmit, watch, formState, setError } = useForm();
  const router = useRouter();

  const onSubmit = async (data: Record<string, string>) => {
    try {
      await post("/register", {
        Name: data.firstName,
        Surname: data.lastName,
        Email: data.email,
        Company: data.companyName,
        Country: data.country,
        Pass: data.password,
        Pass2: data.validatePassword,
      });

      router.push("/post-register");
    } catch (err) {
      console.error(JSON.stringify(err));
      if ((err as Response).status === 400) {
        setError("email", {
          type: "400",
          message: t("email-exists"),
        });
      } else {
        setError("root", {
          type: "500",
          message: t("server-error"),
        });
      }
    }
  };

  const password = watch("password");
  const terms = watch("terms");

  function error(fieldName: string) {
    if (!formState.isSubmitted || !formState.errors[fieldName])
      return undefined;

    return formState.errors[fieldName]?.message?.toString();
  }

  return (
    <div className="flex flex-col items-center relative">
      <div className="absolute top-0 left-0 lg:-left-4">
        <Link
          href="/login"
          className="text-sm hover:underline flex flex-row items-center gap-1"
        >
          <PiArrowLeftBold />
          {t("register-back")}
        </Link>
      </div>

      <Image
        src={logoOxygen}
        alt="logo"
        className="w-full max-w-[200px] mt-6 lg:mt-0"
      />

      <h2 className="text-center text-3xl/10 font-bold">
        {t("register-form-title")}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid lg:grid-cols-2 gap-x-8 gap-y-5 mt-10 mb-4 max-w-lg"
      >
        <InputWithLabel
          id="firstName"
          label={t("firstname-field")}
          placeholder={t("firstname-placeholder")}
          error={error("firstName")}
          {...register("firstName", { required: t("required-field") })}
        />

        <InputWithLabel
          id="lastName"
          label={t("lastname-field")}
          placeholder={t("lastname-placeholder")}
          error={error("lastName")}
          {...register("lastName", { required: t("required-field") })}
        />

        <InputWithLabel
          id="companyName"
          label={t("company-field")}
          placeholder={t("company-placeholder")}
          error={error("companyName")}
          {...register("companyName")}
        />

        <InputWithLabel
          id="country"
          label={t("country-field")}
          placeholder={t("country-placeholder")}
          error={error("country")}
          {...register("country", { required: t("required-field") })}
        />

        <InputWithLabel
          className="lg:col-span-2"
          id="email"
          label={t("email-field")}
          placeholder={t("email-placeholder")}
          error={error("email")}
          {...register("email", {
            required: t("required-field"),
            pattern: { value: /.+@.+\.[a-zA-Z]+/, message: t("email-invalid") },
          })}
        />

        <InputWithLabel
          id="password"
          type="password"
          label={t("password-field")}
          placeholder={t("password-placeholder")}
          error={error("password")}
          {...register("password", {
            required: t("required-field"),
            minLength: { value: 8, message: t("password-length") },
          })}
        />

        <InputWithLabel
          id="validatePassword"
          type="password"
          label={t("verify-password-field")}
          placeholder={t("verify-password-placeholder")}
          error={error("validatePassword")}
          {...register("validatePassword", {
            required: t("required-field"),
            validate: (value) => value === password || t("password-no-match"),
          })}
        />

        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="w-full max-w-80 text-red-500 text-xs/4 min-h-4">
            {formState.errors.root?.message}
          </div>
          <Button
            className="w-full max-w-80 mb-5 mt-2"
            type="submit"
            disabled={!terms || formState.isSubmitting}
          >
            {t("register-btn")}
          </Button>

          <CheckboxWithLabel
            id="terms"
            label={t("terms-and-conditions")}
            {...register("terms", { required: t("must-accept-tc") })}
          />
          <div className="mt-1 text-red-500 text-xs/3 min-h-3">
            {error("terms")}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
