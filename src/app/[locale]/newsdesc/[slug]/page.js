import { notFound } from 'next/navigation';
import { generateArticleSEO, generateArticleStructuredData } from '@/lib/seo';
import { getArticle } from '@/lib/api';
import NewsDescClient from '../../../../components/pagesComponent/NewsDescClient';

export async function generateMetadata({ params }) {
  try {
    const { slug, locale } = await params;
    const article = await getArticle(slug, locale);
    
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
    const article = await getArticle(slug, locale);
    
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
