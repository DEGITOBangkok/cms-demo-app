// Strapi configuration
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://192.168.1.137:1337";

export async function api(path, init = {}) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    next: { revalidate: 60 } // จะใช้ ISR ก็ได้
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}