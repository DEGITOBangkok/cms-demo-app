import { getStrapiMediaURL } from './api';

/**
 * Generate SEO metadata for articles
 * @param {Object} article - Article data from Strapi
 * @param {Object} options - Additional SEO options
 * @returns {Object} SEO metadata object
 */
export function generateArticleSEO(article, options = {}) {
  const {
    siteName = 'News Portal',
    siteUrl = 'http://localhost:3000',
    defaultImage = '/default-og-image.jpg'
  } = options;

  // Get SEO data from article
  const seo = article?.SEO?.[0] || {};
  
  // Fallback values
  const title = seo.metaTitle || article?.title || 'Article';
  const description = seo.metaDescription || article?.description || '';
  const image = seo.shareImage?.url 
    ? getStrapiMediaURL(seo.shareImage.url)
    : article?.cover?.url 
      ? getStrapiMediaURL(article.cover.url)
      : defaultImage;

  const url = `${siteUrl}/newsdesc/${article?.slug}`;

  return {
    title: `${title} | ${siteName}`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      siteName: siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: article?.locale || 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    other: {
      'article:published_time': article?.publishedAt,
      'article:modified_time': article?.updatedAt,
      'article:author': article?.author?.name || 'Unknown Author',
      'article:section': article?.category?.name || 'News',
      'article:tag': article?.tags || '',
    },
  };
}

/**
 * Generate SEO metadata for the news list page
 * @param {Object} options - SEO options
 * @returns {Object} SEO metadata object
 */
export function generateHomeSEO(homeData, options = {}) {
  // SEO is an array, get the first item
  const seo = Array.isArray(homeData?.SEO) ? homeData.SEO[0] : homeData?.SEO;
  
  return {
    title: seo?.metaTitle || homeData?.homeTitle || 'Home',
    description: seo?.metaDescription || homeData?.homeDesc || 'Welcome to our website',
    keywords: seo?.keywords || '',
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || homeData?.homeTitle || 'Home',
      description: seo?.ogDescription || seo?.metaDescription || homeData?.homeDesc || 'Welcome to our website',
      images: seo?.ogImage ? [{ url: seo.ogImage.url }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle || seo?.metaTitle || homeData?.homeTitle || 'Home',
      description: seo?.twitterDescription || seo?.metaDescription || homeData?.homeDesc || 'Welcome to our website',
      images: seo?.twitterImage ? [seo.twitterImage.url] : [],
    },
    ...options,
  };
}

export function generateNewsListSEO(options = {}) {
  const {
    siteName = 'News Portal',
    siteUrl = 'http://localhost:3000',
    defaultImage = '/default-og-image.jpg'
  } = options;

  return {
    title: `Latest News | ${siteName}`,
    description: 'Stay updated with the latest news, articles, and insights from our news portal.',
    openGraph: {
      title: `Latest News | ${siteName}`,
      description: 'Stay updated with the latest news, articles, and insights from our news portal.',
      url: `${siteUrl}/newslist`,
      siteName: siteName,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: 'Latest News',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Latest News | ${siteName}`,
      description: 'Stay updated with the latest news, articles, and insights from our news portal.',
      images: [defaultImage],
    },
    alternates: {
      canonical: `${siteUrl}/newslist`,
    },
  };
}

/**
 * Generate structured data (JSON-LD) for articles
 * @param {Object} article - Article data from Strapi
 * @returns {Object} Structured data object
 */
export function generateArticleStructuredData(article) {
  const image = article?.cover?.url 
    ? getStrapiMediaURL(article.cover.url)
    : '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article?.title,
    description: article?.description,
    image: image,
    datePublished: article?.publishedAt,
    dateModified: article?.updatedAt,
    author: {
      '@type': 'Person',
      name: article?.author?.name || 'Unknown Author',
    },
    publisher: {
      '@type': 'Organization',
      name: 'News Portal',
      logo: {
        '@type': 'ImageObject',
        url: 'http://localhost:3000/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `http://localhost:3000/newsdesc/${article?.slug}`,
    },
  };
}

