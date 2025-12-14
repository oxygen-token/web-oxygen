const IS_DEV = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

const getBackendUrl = () => {
  if (IS_DEV) {
    return "http://localhost:10001";
  }
  
  const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (envUrl) {
    return envUrl;
  }
  
  return "https://backend-render-7vh2.onrender.com";
};

const BASE_URL = getBackendUrl();

// Removed client-side cookie handling functions
// Cookies are now handled server-side through Next.js API routes

export async function apiRequest(
  url: string,
  method: "GET" | "POST" | "PUT",
  body?: any,
  headers?: Record<string, string>
) {
  const fullUrl = `${BASE_URL}${url}`;

  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  // Note: set-cookie headers are not accessible from client-side JavaScript
  // Cookie handling is done server-side through Next.js API routes

  if (res.ok) return await res.json();
  throw res;
}

export async function get(
  url: string,
  body?: any,
  headers?: Record<string, string>
) {
  const fullUrl = `${BASE_URL}${url}`;

  const res = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...headers,
    },
    credentials: "include",
  });

  // Note: set-cookie headers are not accessible from client-side JavaScript
  // Cookie handling is done server-side through Next.js API routes

  if (res.ok) return await res.json();
  throw res;
}

export async function post(
  url: string,
  body?: any,
  headers?: Record<string, string>
) {
  const fullUrl = `${BASE_URL}${url}`;

  const res = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  // Note: set-cookie headers are not accessible from client-side JavaScript
  // Cookie handling is done server-side through Next.js API routes

  if (res.ok) return await res.json();
  throw res;
}
