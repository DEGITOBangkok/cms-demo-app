import { generateContactSEO } from "../../../lib/seo";
import { getContactConfig } from "../../../lib/api";
import ContactPageClient from "../../../components/pagesComponent/ContactPageClient";
import { routing } from "../../../../i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
  try {
    // Fetch contact SEO data from Strapi
    const contactData = await getContactConfig(locale);
    
    if (contactData?.SEO) {
      return generateContactSEO({
        siteName: 'News Portal',
        siteUrl: process.env.NEXT_PUBLIC_FRONTEND_PATH || 'http://localhost:3000',
        locale: locale,
        seoData: contactData.SEO
      });
    }
  } catch (error) {
    console.error('Error fetching contact SEO data:', error);
  }
  
  // Fallback to default SEO
  return generateContactSEO({
    siteName: 'News Portal',
    siteUrl: process.env.NEXT_PUBLIC_FRONTEND_PATH || 'http://localhost:3000',
    locale: locale
  });
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  return <ContactPageClient locale={locale} />;
}