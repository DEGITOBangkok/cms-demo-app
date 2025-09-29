import { generateNewsListSEO } from '../../../lib/seo';
import NewsListClient from '@/components/NewsListClient';
import { Suspense } from 'react';

export async function generateMetadata({ params }) {
  try {
    const { locale } = await params;
    
    return generateNewsListSEO({
      siteName: 'News Portal',
      siteUrl: process.env.NEXT_PUBLIC_FRONTEND_PATH || 'http://localhost:3000',
      locale: locale
    });
  } catch (error) {
    console.error('Error generating newslist metadata:', error);
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_PATH),
      title: 'Latest News',
      description: 'Stay updated with the latest news, articles, and insights from our news portal.',
    };
  }
}

export default function NewsList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsListClient />
    </Suspense>
  );
}