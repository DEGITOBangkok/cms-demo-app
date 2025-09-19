import { generateNewsListSEO } from '../../../lib/seo';
import NewsListClient from '@/components/NewsListClient';
import { Suspense } from 'react';

// Generate metadata for the news list page
export const metadata = generateNewsListSEO();

export default function NewsList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsListClient />
    </Suspense>
  );
}