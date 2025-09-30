import { generateNotFoundSEO } from '../../../lib/seo';
import NotFoundClient from '@/app/NotFoundClient';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
  return generateNotFoundSEO({
    siteName: 'News Portal',
    siteUrl: process.env.NEXT_PUBLIC_FRONTEND_PATH,
    locale: locale
  });
}

export default function NotFoundPage() {
  return <NotFoundClient />;
}
