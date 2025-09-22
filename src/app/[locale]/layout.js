import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import { Footer} from "../../components";
import  Navbar  from "@/components/NavBar/Navbar";
import "../../app/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "HomePage",
  });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_PATH),
    title: t("categorisebt"),
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <Navbar></Navbar>
      <div className="font-fciconic min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
