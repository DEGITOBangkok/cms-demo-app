import { STRAPI_URL, api, isCMSAvailable } from "../config/strapi";
import {
  mockArticles,
  mockCategories,
  mockHomeData,
  mockLatestArticles,
  createMockResponse,
} from "../mockdata/mockData";

// Helper function to get full image URL
export const getStrapiURL = (path = "") => {
  return `${STRAPI_URL}${path}`;
};

// Helper function to get image URL
export const getStrapiMediaURL = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) {
    return url;
  }
  return getStrapiURL(url);
};

// Generic fetch function for Strapi API
async function fetchAPI(endpoint, options = {}) {
  try {
    console.log('STRAPI_URL:', STRAPI_URL);
    console.log('Full API URL:', `${STRAPI_URL}${endpoint}`);
    return await api(endpoint, options);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Fetch articles with populated relations
export async function getArticles(params = {}) {
  const {
    sort = "publishedAt:desc",
    populate = "*", // ใช้ populate=* แทน
    pagination = { page: 1, pageSize: 10 },
    filters = {},
    locale = "en", // Default locale
  } = params;

  // Check if CMS is available first
  const cmsAvailable = await isCMSAvailable();
  if (!cmsAvailable) {
    return createMockResponse(mockArticles.slice(0, pagination.pageSize), {
      page: pagination.page,
      pageSize: pagination.pageSize,
      pageCount: 1,
      total: mockArticles.length,
    });
  }

  // Build query parameters for Strapi v5
  const queryParams = new URLSearchParams();

  // Add sort
  if (sort) {
    queryParams.append("sort", sort);
  }

  // Add locale
  if (locale) {
    queryParams.append("locale", locale);
  }

  // Add populate - ใช้ populate=* สำหรับทุกฟิลด์
  if (populate === "*") {
    queryParams.append("populate", "*");
  } else if (populate === "specific") {
    // ใช้รูปแบบ populate[field]=* สำหรับฟิลด์เฉพาะ
    queryParams.append("populate[cover]", "*");
    queryParams.append("populate[author]", "*");
    queryParams.append("populate[category]", "*");
    queryParams.append("populate[tags]", "*");
  } else if (populate) {
    queryParams.append("populate", populate);
  }

  // Add pagination
  queryParams.append("pagination[page]", pagination.page);
  queryParams.append("pagination[pageSize]", pagination.pageSize);

  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(`filters[${key}]`, value);
    }
  });

  try {
    console.log('getArticles', `${STRAPI_URL}/api/articles?${queryParams}`);
    const result = await fetchAPI(`/api/articles?${queryParams}`);

    // If articles found in requested locale, return them
    if (result.data && result.data.length > 0) {
      return result;
    }

    // If no articles found and locale is not 'en', try fallback to English
    if (locale !== "en") {
      console.log(
        `No articles found in ${locale}, trying fallback to English...`
      );
      const fallbackParams = new URLSearchParams();

      // Add sort
      if (sort) {
        fallbackParams.append("sort", sort);
      }

      // Add English locale
      fallbackParams.append("locale", "en");

      // Add populate
      if (populate === "*") {
        fallbackParams.append("populate", "*");
      } else if (populate === "specific") {
        fallbackParams.append("populate[cover]", "*");
        fallbackParams.append("populate[author]", "*");
        fallbackParams.append("populate[category]", "*");
        fallbackParams.append("populate[tags]", "*");
      } else if (populate) {
        fallbackParams.append("populate", populate);
      }

      // Add pagination
      fallbackParams.append("pagination[page]", pagination.page);
      fallbackParams.append("pagination[pageSize]", pagination.pageSize);

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
    console.error("Error fetching articles, using mock data:", error);
    return createMockResponse(mockArticles.slice(0, pagination.pageSize), {
      page: pagination.page,
      pageSize: pagination.pageSize,
      pageCount: 1,
      total: mockArticles.length,
    });
  }
}

// Fetch single article by slug with fallback
export async function getArticle(slug, locale = "en") {
  // Check if CMS is available first
  const cmsAvailable = await isCMSAvailable();
  if (!cmsAvailable) {
    const mockArticle = mockArticles.find(
      (article) => article.attributes.slug === slug
    );
    return mockArticle || mockArticles[0]; // Return first mock article if slug not found
  }

  const queryParams = new URLSearchParams();
  queryParams.append("filters[slug][$eq]", slug);
  queryParams.append("populate", "*"); // Use simple populate=* instead of complex blocks
  queryParams.append("locale", locale);

  try {
    const response = await fetchAPI(`/api/articles?${queryParams}`);
    const article = response.data?.[0];

    // If article found in requested locale, return it
    if (article) {
      return article;
    }

    // If no article found and locale is not 'en', try fallback to English
    if (locale !== "en") {
      console.log(
        `Article not found in ${locale}, trying fallback to English...`
      );
      const fallbackParams = new URLSearchParams();
      fallbackParams.append("filters[slug][$eq]", slug);
      fallbackParams.append("populate", "*");
      fallbackParams.append("locale", "en");

      const fallbackResponse = await fetchAPI(
        `/api/articles?${fallbackParams}`
      );
      const fallbackArticle = fallbackResponse.data?.[0];

      if (fallbackArticle) {
        console.log(`Found article in English fallback for slug: ${slug}`);
        return fallbackArticle;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching article, using mock data:", error);
    const mockArticle = mockArticles.find(
      (article) => article.attributes.slug === slug
    );
    return mockArticle || mockArticles[0]; // Return first mock article if slug not found
  }
}

// Fetch featured articles (latest articles for homepage)
export async function getFeaturedArticles(limit = 3, locale = "en") {
  return getArticles({
    pagination: { page: 1, pageSize: limit },
    // Remove featured filter since the field doesn't exist
    // Just get the latest articles instead
    sort: "publishedAt:desc",
    populate: "*", // Ensure all fields are populated including cover, category, author, etc.
    locale: locale,
  });
}

// Search articles
export async function searchArticles(query, params = {}) {
  // Check if CMS is available first
  const cmsAvailable = await isCMSAvailable();
  if (!cmsAvailable) {
    const filteredArticles = mockArticles.filter(
      (article) =>
        article.attributes.title.toLowerCase().includes(query.toLowerCase()) ||
        article.attributes.description
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        article.attributes.tags.some((tag) =>
          tag.name.toLowerCase().includes(query.toLowerCase())
        )
    );
    return createMockResponse(filteredArticles);
  }

  const queryParams = new URLSearchParams();

  // Add basic parameters
  queryParams.append("populate", "*"); // ใช้ populate=* แทน
  queryParams.append("pagination[page]", params.pagination?.page || 1);
  queryParams.append("pagination[pageSize]", params.pagination?.pageSize || 10);
  queryParams.append("locale", params.locale || "en"); // Default locale

  if (params.sort) {
    queryParams.append("sort", params.sort);
  }

  // Add search filters - simple and effective search
  queryParams.append("filters[title][$containsi]", query);
  
  console.log('Search URL:', `${STRAPI_URL}/api/articles?${queryParams}`);

  try {
    const result = await fetchAPI(`/api/articles?${queryParams}`);
    return result;
  } catch (error) {
    console.error("Error searching articles, using mock data:", error);
    const filteredArticles = mockArticles.filter(
      (article) =>
        article.attributes.title.toLowerCase().includes(query.toLowerCase()) ||
        article.attributes.description
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        article.attributes.tags.some((tag) =>
          tag.name.toLowerCase().includes(query.toLowerCase())
        )
    );
    return createMockResponse(filteredArticles);
  }
}

// ฟังก์ชันใหม่ที่ใช้ populate[field]=* สำหรับฟิลด์เฉพาะ
export async function getArticlesWithSpecificPopulate(params = {}) {
  const {
    sort = "publishedAt:desc",
    pagination = { page: 1, pageSize: 10 },
    filters = {},
  } = params;

  const queryParams = new URLSearchParams();

  // Add sort
  if (sort) {
    queryParams.append("sort", sort);
  }

  // ใช้ populate[field]=* สำหรับฟิลด์เฉพาะ
  queryParams.append("populate[cover]", "*");
  queryParams.append("populate[author]", "*");
  queryParams.append("populate[category]", "*");
  queryParams.append("populate[tags]", "*");

  // Add pagination
  queryParams.append("pagination[page]", pagination.page);
  queryParams.append("pagination[pageSize]", pagination.pageSize);

  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(`filters[${key}]`, value);
    }
  });

  try {
    return await fetchAPI(`/api/articles?${queryParams}`);
  } catch (error) {
    console.error("Error fetching articles with specific populate:", error);
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } },
    };
  }
}

// Fetch categories from Strapi
export async function getCategories(locale = "en") {
  // Check if CMS is available first
  const cmsAvailable = await isCMSAvailable();
  if (!cmsAvailable) {
    return createMockResponse(mockCategories);
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams.append("populate", "*");
    queryParams.append("locale", locale);

    const result = await fetchAPI(`/api/categories?${queryParams}`);
    return result;
  } catch (error) {
    console.error("Error fetching categories, using mock data:", error);
    return createMockResponse(mockCategories);
  }
}

// Fetch all social media data
export async function getSocial() {
  // Check if CMS is available first
  const cmsAvailable = await isCMSAvailable();
  if (!cmsAvailable) {
    return {
      facebook: {
        id: 1,
        attributes: {
          name: "Facebook Page",
          url: "https://facebook.com/demo",
          icon: "facebook",
          locale: "en",
        },
      },
      instagram: {
        id: 1,
        attributes: {
          name: "Instagram Page",
          url: "https://instagram.com/demo",
          icon: "instagram",
          locale: "en",
        },
      },
    };
  }

        try {
          const socialResponse = await fetchAPI("/api/social?populate=*");
          
          return {
            facebook: {
              id: 1,
              attributes: {
                name: "Facebook Page",
                url: socialResponse?.data?.Facebook || "https://facebook.com/demo",
                icon: "facebook",
                locale: "en",
              },
            },
            instagram: {
              id: 1,
              attributes: {
                name: "Instagram Page",
                url: socialResponse?.data?.Instagram || "https://instagram.com/demo",
                icon: "instagram",
                locale: "en",
              },
            },
          };
  } catch (error) {
    return {
      facebook: {
        id: 1,
        attributes: {
          name: "Facebook Page",
          url: "https://facebook.com/demo",
          icon: "facebook",
          locale: "en",
        },
      },
      instagram: {
        id: 1,
        attributes: {
          name: "Instagram Page",
          url: "https://instagram.com/demo",
          icon: "instagram",
          locale: "en",
        },
      },
    };
  }
}
export async function getContactConfig(locale = 'en') {
  const cmsAvailable = await isCMSAvailable();
  if (!cmsAvailable) {
    return null;
  }
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('populate[ContactDetail]', '*');
    queryParams.append('populate[ContactFill][populate][firstName][populate]', '*');
    queryParams.append('populate[ContactFill][populate][lastName][populate]', '*');
    queryParams.append('populate[ContactFill][populate][email][populate]', '*');
    queryParams.append('populate[ContactFill][populate][phoneNumber][populate]', '*');
    queryParams.append('populate[ContactFill][populate][message][populate]', '*');
    queryParams.append('populate[ContactFill][populate][attachment][populate]', '*');
    queryParams.append('populate[SEO][populate]', '*');
    queryParams.append('locale', locale);
    const response = await fetchAPI(`/api/contact?${queryParams}`);
    return response?.data || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
// Fetch Home single type
export async function getHome(locale = "en") {
  // Check if CMS is available first
  const cmsAvailable = await isCMSAvailable();
  if (!cmsAvailable) {
    return mockHomeData;
  }

  try {
    // Build query parameters for home data
    const homeQueryParams = new URLSearchParams();
    homeQueryParams.append('populate[banners][populate][media][populate]', '*');
    homeQueryParams.append('populate[articles][populate]', '*');
    homeQueryParams.append('populate[homeDetails][populate]', '*');
    homeQueryParams.append('populate[SEO][populate]', '*');
    homeQueryParams.append('populate[homeImg][populate]', '*');
    homeQueryParams.append('locale', locale);

    // Build query parameters for articles
    const articlesQueryParams = new URLSearchParams();
    articlesQueryParams.append('populate', '*');
    articlesQueryParams.append('sort', 'publishedAt:desc');
    articlesQueryParams.append('pagination[limit]', '3');
    articlesQueryParams.append('locale', locale);

    // Fetch home data and latest articles separately
    const [homeResponse, latestArticlesResponse] = await Promise.allSettled([
      fetchAPI(`/api/home?${homeQueryParams}`),
      fetchAPI(`/api/articles?${articlesQueryParams}`)
    ]);

    const homeData = homeResponse.status === 'fulfilled' && homeResponse.value ? homeResponse.value.data : mockHomeData;
    const latestArticles = latestArticlesResponse.status === 'fulfilled' && latestArticlesResponse.value ? latestArticlesResponse.value.data : mockLatestArticles;

    // Use relation articles if available, otherwise use latest articles
    const articles = homeData?.articles && homeData.articles.length > 0 
      ? homeData.articles 
      : latestArticles;

    return {
      ...homeData,
      articles: articles
    };
  } catch (error) {
    // Silently handle 404 errors and return mock data
    if (error.message.includes('404')) {
      return mockHomeData;
    }
    console.error("Error fetching Home data, using mock data:", error);
    return mockHomeData;
  }
}



export async function createContactForm(
  formData,
  filePath,
  fileName,
  mimeType
) {
  try {
    // ถ้ามีไฟล์แนบ
    if (filePath) {
      if (!fs.existsSync(filePath)) {
        throw new Error("File not found");
      }

      const fileBuffer = fs.readFileSync(filePath);

      // แปลงไฟล์เป็น base64
      const base64File = fileBuffer.toString("base64");

      // เพิ่มไฟล์เข้า formData
      formData.attachment = {
        name: fileName || "attachment",
        type: mimeType || "application/octet-stream",
        data: base64File,
      };

      // ลบไฟล์ชั่วคราวหลังอ่าน
      fs.unlinkSync(filePath);
    }

    // ส่งข้อมูลไป Strapi
    const response = await fetch(`${STRAPI_URL}/api/contact-forms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: formData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || "Failed to submit form");
    }

    return await response.json();
  } catch (error) {
    console.error("Strapi API error:", error);
    throw error;
  }
}

