import { generateNotFoundSEO } from '../../../lib/seo';
import NotFoundClient from '@/components/pagesComponent/NotFoundClient';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
  return {
    ...generateNotFoundSEO({
      siteName: 'News Portal',
      siteUrl: process.env.NEXT_PUBLIC_FRONTEND_PATH,
      locale: locale
    }),
    icons: {
      icon: [
        { url: '/favicon.png', type: 'image/png' },
        { url: '/favicon.ico', type: 'image/x-icon' }
      ],
    },
  };
}

export default function NotFoundPage() {
  return <NotFoundClient />;
}
