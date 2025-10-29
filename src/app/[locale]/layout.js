import "./globals.css";

import RootLayout from "./layout-ga";
import { Transition_Provider } from "./context/Transition_Context";
import { AuthProvider } from "./context/Auth_Context";
import { DevProvider } from "./context/Dev_Context";
import Navbar from "./components/Navbar/Navbar";
import Vercel_Analytics from "./components/Vercel_Analytics/Vercel_Analytics";

const { NextIntlClientProvider } = require("next-intl");
const { notFound } = require("next/navigation");

export const metadata = {
  title: "Oxygen Token",
  description: "Landing page Oxygen",
  icon: "../favicon.ico",
};

function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

async function LocaleLayout({ children, params: { locale } }) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <RootLayout />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <DevProvider>
            <AuthProvider>
              <Transition_Provider>
                <Navbar />
                {children}
              </Transition_Provider>
            </AuthProvider>
          </DevProvider>
        </NextIntlClientProvider>
        <Vercel_Analytics />
      </body>
    </html>
  );
}

export default LocaleLayout;
