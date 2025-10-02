import { getArticles } from '../lib/api';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_PATH;
  
  try {
    // Fetch all articles
    const articlesResponse = await getArticles({
      pagination: { page: 1, pageSize: 10 }, // Get all articles
      populate: '*'
    });
    
    const articles = articlesResponse.data || [];
    
    // Generate sitemap entries
    const articleUrls = articles.map((article) => ({
      url: `${baseUrl}/en/newsdesc/${article.attributes?.slug || article.slug}`,
      lastModified: article.attributes?.updatedAt || article.attributes?.publishedAt || article.updatedAt || article.publishedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    
    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/en/newslist`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/en/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/th/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ];
    
    return [...staticPages, ...articleUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/en/newslist`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/en/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/th/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ];
  }
}

