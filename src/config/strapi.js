// Strapi configuration
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
export const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

export async function api(path, init = {}) {
  const headers = { 
    "Content-Type": "application/json", 
    ...(init.headers || {}) 
  };

  // Add API token if available
  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const res = await fetch(`${STRAPI_URL}${path}`, {
    ...init,
    headers,
    next: { revalidate: 60 } // จะใช้ ISR ก็ได้
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}