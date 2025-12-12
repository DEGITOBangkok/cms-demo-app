import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "../../../i18n/routing";
import { Footer} from "../../components";
import  Navbar  from "@/components/NavBar/Navbar";
import { getHome } from "../../lib/api";
import { generateHomeSEO } from "../../lib/seo";
import "../../app/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;

  try {
    // Fetch home page data for SEO
    const homeData = await getHome(locale);
    
    if (homeData) {
      return generateHomeSEO(homeData, {
        siteName: 'Prom Serve',
        siteUrl: 'http://localhost:3000'
      });
    }
  } catch (error) {
    console.error('Error fetching home data for metadata:', error);
  }

  // Fallback metadata
  const t = await getTranslations({
    locale,
    namespace: "Navigation",
  });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_PATH),
    title: t("home"),
    description: 'Welcome to our Prom Serve',
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
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
