import { generateNewsListSEO } from '../../../lib/seo';
import NewsListClient from './NewsListClient';

// Generate metadata for the news list page
export const metadata = generateNewsListSEO();

export default function NewsList() {
  return <NewsListClient />;
}