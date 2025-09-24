// Strapi configuration
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
export const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// Check if CMS is available
export async function isCMSAvailable() {
  try {
    if (!STRAPI_URL) {
      return false;
    }
    
    const response = await fetch(`${STRAPI_URL}/api/articles?pagination[pageSize]=1`, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` })
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function api(path, init = {}) {
  const headers = { 
    "Content-Type": "application/json", 
    ...(init.headers || {}) 
  };

  // Add API token if available
  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  try {
    const res = await fetch(`${STRAPI_URL}${path}`, {
      ...init,
      headers,
      signal: AbortSignal.timeout(10000), // 10 second timeout
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}