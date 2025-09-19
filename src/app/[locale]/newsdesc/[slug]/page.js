import { notFound } from 'next/navigation';
import { generateArticleSEO, generateArticleStructuredData } from '@/lib/seo';
import { STRAPI_URL } from '@/config/strapi';
import NewsDescClient from './NewsDescClient';

// Shared function to fetch article data
async function fetchArticleBySlug(slug, locale = 'en') {
  const queryParams = new URLSearchParams();
  queryParams.append('filters[slug][$eq]', slug);
  queryParams.append('populate', '*');
  queryParams.append('locale', locale);
  
  const response = await fetch(`${STRAPI_URL}/api/articles?${queryParams}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  
  if (!data.data || data.data.length === 0) {
    return null;
  }
  
  return data.data[0];
}

export async function generateMetadata({ params }) {
  try {
    const { slug, locale } = await params;
    const article = await fetchArticleBySlug(slug, locale);
    
    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
      };
    }
    
    return generateArticleSEO(article);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }
}

export default async function NewsDesc({ params }) {
  try {
    const { slug, locale } = await params;
    const article = await fetchArticleBySlug(slug, locale);
    
    if (!article) {
      notFound();
    }
    
    const structuredData = generateArticleStructuredData(article);
    
    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <NewsDescClient article={article} />
      </>
    );
  } catch (error) {
    console.error('Error fetching article:', error);
    notFound();
  }
}
