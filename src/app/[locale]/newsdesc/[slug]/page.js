import { notFound } from 'next/navigation';
import { generateArticleSEO, generateArticleStructuredData } from '@/lib/seo';
import { STRAPI_URL } from '@/config/strapi';
import NewsDescClient from './NewsDescClient';

// Shared function to fetch article data with fallback
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
  
  // If article found in requested locale, return it
  if (data.data && data.data.length > 0) {
    return data.data[0];
  }
  
  // If no article found and locale is not 'en', try fallback to English
  if (locale !== 'en') {
    console.log(`Article not found in ${locale}, trying fallback to English...`);
    const fallbackParams = new URLSearchParams();
    fallbackParams.append('filters[slug][$eq]', slug);
    fallbackParams.append('populate', '*');
    fallbackParams.append('locale', 'en');
    
    const fallbackResponse = await fetch(`${STRAPI_URL}/api/articles?${fallbackParams}`, {
      cache: 'no-store'
    });
    
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData.data && fallbackData.data.length > 0) {
        console.log(`Found article in English fallback for slug: ${slug}`);
        return fallbackData.data[0];
      }
    }
  }
  
  return null;
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
