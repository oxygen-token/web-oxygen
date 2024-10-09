import { useTranslations } from "next-intl";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import LoginForm from "../components/Login/LoginForm";

const Login = () => {
  const t = useTranslations("Login");
  return (
    <>
      <Navbar />
      <section className="grid lg:grid-cols-2 items-center min-h-screen px-12 py-32 gap-12 bg-[url('/assets/images/imgLogin.png')] bg-cover bg-no-repeat bg-fixed">
        <h1 className="text-white text-4xl font-medium max-w-lg mx-auto lg:mx-0 text-balance text-center lg:text-start">
          {t("login-title")}
        </h1>

        <div className="w-full bg-white flex flex-col p-12 max-w-xl mx-auto rounded">
          <LoginForm />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
