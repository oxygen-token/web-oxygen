import "./globals.css";

import RootLayout from "./layout-ga";
import { Transition_Provider } from "./context/Transition_Context";

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
          <Transition_Provider>
            {children}
          </Transition_Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default LocaleLayout;
