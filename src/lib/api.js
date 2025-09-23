import { STRAPI_URL, api } from '../config/strapi';

// Helper function to get full image URL
export const getStrapiURL = (path = '') => {
  return `${STRAPI_URL}${path}`;
};

// Helper function to get image URL
export const getStrapiMediaURL = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) {
    return url;
  }
  return getStrapiURL(url);
};

// Generic fetch function for Strapi API
async function fetchAPI(endpoint, options = {}) {
  try {
    return await api(endpoint, options);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Fetch articles with populated relations
export async function getArticles(params = {}) {
  const {
    sort = 'publishedAt:desc',
    populate = '*', // ใช้ populate=* แทน
    pagination = { page: 1, pageSize: 10 },
    filters = {},
    locale = 'en', // Default locale
  } = params;

  // Build query parameters for Strapi v5
  const queryParams = new URLSearchParams();
  
  // Add sort
  if (sort) {
    queryParams.append('sort', sort);
  }
  
  // Add locale
  if (locale) {
    queryParams.append('locale', locale);
  }
  
  // Add populate - ใช้ populate=* สำหรับทุกฟิลด์
  if (populate === '*') {
    queryParams.append('populate', '*');
  } else if (populate === 'specific') {
    // ใช้รูปแบบ populate[field]=* สำหรับฟิลด์เฉพาะ
    queryParams.append('populate[cover]', '*');
    queryParams.append('populate[author]', '*');
    queryParams.append('populate[category]', '*');
    queryParams.append('populate[tags]', '*');
  } else if (populate) {
    queryParams.append('populate', populate);
  }
  
  // Add pagination
  queryParams.append('pagination[page]', pagination.page);
  queryParams.append('pagination[pageSize]', pagination.pageSize);
  
  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(`filters[${key}]`, value);
    }
  });

  try {
    const result = await fetchAPI(`/api/articles?${queryParams}`);
    
    // If articles found in requested locale, return them
    if (result.data && result.data.length > 0) {
      return result;
    }
    
    // If no articles found and locale is not 'en', try fallback to English
    if (locale !== 'en') {
      console.log(`No articles found in ${locale}, trying fallback to English...`);
      const fallbackParams = new URLSearchParams();
      
      // Add sort
      if (sort) {
        fallbackParams.append('sort', sort);
      }
      
      // Add English locale
      fallbackParams.append('locale', 'en');
      
      // Add populate
      if (populate === '*') {
        fallbackParams.append('populate', '*');
      } else if (populate === 'specific') {
        fallbackParams.append('populate[cover]', '*');
        fallbackParams.append('populate[author]', '*');
        fallbackParams.append('populate[category]', '*');
        fallbackParams.append('populate[tags]', '*');
      } else if (populate) {
        fallbackParams.append('populate', populate);
      }
      
      // Add pagination
      fallbackParams.append('pagination[page]', pagination.page);
      fallbackParams.append('pagination[pageSize]', pagination.pageSize);
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fallbackParams.append(`filters[${key}]`, value);
        }
      });
      
      const fallbackResult = await fetchAPI(`/api/articles?${fallbackParams}`);
      
      if (fallbackResult.data && fallbackResult.data.length > 0) {
        return fallbackResult;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

// Fetch single article by slug with fallback
export async function getArticle(slug, locale = 'en') {
  const queryParams = new URLSearchParams();
  queryParams.append('filters[slug][$eq]', slug);
  queryParams.append('populate', '*'); // ใช้ populate=* แทน
  queryParams.append('populate[blocks][populate]', '*');
  queryParams.append('populate[blocks][on][shared.slider][populate][files]', '*');
  queryParams.append('populate[blocks][on][shared.slider][populate][images]', '*');
  queryParams.append('locale', locale);

  try {
    const response = await fetchAPI(`/api/articles?${queryParams}`);
    const article = response.data?.[0];
    
    // If article found in requested locale, return it
    if (article) {
      return article;
    }
    
    // If no article found and locale is not 'en', try fallback to English
    if (locale !== 'en') {
      console.log(`Article not found in ${locale}, trying fallback to English...`);
      const fallbackParams = new URLSearchParams();
      fallbackParams.append('filters[slug][$eq]', slug);
      fallbackParams.append('populate', '*');
      fallbackParams.append('populate[blocks][populate]', '*');
      fallbackParams.append('populate[blocks][on][shared.slider][populate][files]', '*');
      fallbackParams.append('populate[blocks][on][shared.slider][populate][images]', '*');
      fallbackParams.append('locale', 'en');
      
      const fallbackResponse = await fetchAPI(`/api/articles?${fallbackParams}`);
      const fallbackArticle = fallbackResponse.data?.[0];
      
      if (fallbackArticle) {
        console.log(`Found article in English fallback for slug: ${slug}`);
        return fallbackArticle;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Fetch featured articles (latest articles for homepage)
export async function getFeaturedArticles(limit = 3, locale = 'en') {
  return getArticles({
    pagination: { page: 1, pageSize: limit },
    // Remove featured filter since the field doesn't exist
    // Just get the latest articles instead
    sort: 'publishedAt:desc',
    populate: '*', // Ensure all fields are populated including cover, category, author, etc.
    locale: locale,
  });
}



// Search articles
export async function searchArticles(query, params = {}) {
  const queryParams = new URLSearchParams();
  
  // Add basic parameters
  queryParams.append('populate', '*'); // ใช้ populate=* แทน
  queryParams.append('pagination[page]', params.pagination?.page || 1);
  queryParams.append('pagination[pageSize]', params.pagination?.pageSize || 10);
  queryParams.append('locale', params.locale || 'en'); // Default locale
  
  if (params.sort) {
    queryParams.append('sort', params.sort);
  }
  
  // Add search filters
  queryParams.append('filters[$or][0][title][$containsi]', query);
  queryParams.append('filters[$or][1][description][$containsi]', query);
  queryParams.append('filters[$or][2][tags][$containsi]', query);

  try {
    return await fetchAPI(`/api/articles?${queryParams}`);
  } catch (error) {
    console.error('Error searching articles:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

// ฟังก์ชันใหม่ที่ใช้ populate[field]=* สำหรับฟิลด์เฉพาะ
export async function getArticlesWithSpecificPopulate(params = {}) {
  const {
    sort = 'publishedAt:desc',
    pagination = { page: 1, pageSize: 10 },
    filters = {},
  } = params;

  const queryParams = new URLSearchParams();
  
  // Add sort
  if (sort) {
    queryParams.append('sort', sort);
  }
  
  // ใช้ populate[field]=* สำหรับฟิลด์เฉพาะ
  queryParams.append('populate[cover]', '*');
  queryParams.append('populate[author]', '*');
  queryParams.append('populate[category]', '*');
  queryParams.append('populate[tags]', '*');
  
  // Add pagination
  queryParams.append('pagination[page]', pagination.page);
  queryParams.append('pagination[pageSize]', pagination.pageSize);
  
  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(`filters[${key}]`, value);
    }
  });

  try {
    return await fetchAPI(`/api/articles?${queryParams}`);
  } catch (error) {
    console.error('Error fetching articles with specific populate:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

// Fetch categories from Strapi
export async function getCategories(locale = 'en') {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('populate', '*');
    queryParams.append('locale', locale);
    
    const result = await fetchAPI(`/api/categories?${queryParams}`);
    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

// Fetch Facebook single type (stored as 'social' in Strapi)
export async function getFacebook() {
  try {
    const response = await fetchAPI('/api/social?populate=*');
    return response.data || null;
  } catch (error) {
    console.warn('Facebook data not available:', error.message);
    return null;
  }
}

// Fetch Instagram single type
export async function getInstagram() {
  try {
    const response = await fetchAPI('/api/instagram?populate=*');
    return response.data || null;
  } catch (error) {
    console.warn('Instagram data not available:', error.message);
    return null;
  }
}

// Fetch Home single type
export async function getHome(locale = 'en') {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('populate[banners][populate]', '*');
    queryParams.append('populate[homeDetails][populate]', '*');
    queryParams.append('populate[SEO][populate]', '*');
    queryParams.append('populate', 'homeImg');
    queryParams.append('locale', locale);
    
    const response = await fetchAPI(`/api/home?${queryParams}`);
    return response.data || null;
  } catch (error) {
    console.error('Error fetching Home data:', error);
    return null;
  }
}
