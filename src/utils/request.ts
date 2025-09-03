//const BASE_URL = "https://backend-render-main.onrender.com";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-render-main.onrender.com";

const getCookieValue = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

const setCookie = (name: string, value: string, options: any = {}) => {
  const { expires, path = '/', domain, secure = true, sameSite = 'Lax' } = options;
  
  let cookieString = `${name}=${value}`;
  if (expires) cookieString += `; expires=${expires}`;
  if (path) cookieString += `; path=${path}`;
  if (domain) cookieString += `; domain=${domain}`;
  if (secure) cookieString += '; secure';
  if (sameSite) cookieString += `; samesite=${sameSite}`;
  
  document.cookie = cookieString;
  console.log(`🍪 Cookie set: ${name}=${value}`);
};

export async function apiRequest(
  url: string,
  method: "GET" | "POST" | "PUT",
  body?: any,
  headers?: Record<string, string>
) {
  const fullUrl = `${BASE_URL}${url}`;
  console.log(`Making ${method} request to:`, fullUrl);
  console.log("Request headers:", {
    "Content-Type": "application/json",
    ...headers,
  });
  if (body) {
    console.log("Request body:", body);
  }
  
  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: "include", 
  });

  console.log(`Response status: ${res.status} for ${method} ${url}`);
  console.log("Response headers:", Object.fromEntries(res.headers.entries()));

  const setCookieHeader = res.headers.get('set-cookie');
  if (setCookieHeader) {
    console.log("🍪 Set-Cookie header received:", setCookieHeader);
    const cookies = setCookieHeader.split(',').map(cookie => cookie.trim());
    cookies.forEach(cookie => {
      const [nameValue] = cookie.split(';');
      const [name, value] = nameValue.split('=');
      if (name && value) {
        setCookie(name, value, { path: '/', sameSite: 'Lax' });
      }
    });
  }

  if (res.ok) return res;
  throw res;
}

export async function get(
  url: string,
  body?: any,
  headers?: Record<string, string>
) {
  const fullUrl = `${BASE_URL}${url}`;
  console.log(`Making GET request to:`, fullUrl);
  console.log("Request headers:", {
    "Content-Type": "application/json",
    ...headers,
  });
  
  console.log("🍪 Cookies antes de GET:", document.cookie);
  console.log("🍪 JWT cookie value:", getCookieValue('jwt'));
  
  const res = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
  });

  console.log(`Response status: ${res.status} for GET ${url}`);
  console.log("Response headers:", Object.fromEntries(res.headers.entries()));
  
  const setCookieHeader = res.headers.get('set-cookie');
  if (setCookieHeader) {
    console.log("🍪 Set-Cookie header received:", setCookieHeader);
    const cookies = setCookieHeader.split(',').map(cookie => cookie.trim());
    cookies.forEach(cookie => {
      const [nameValue] = cookie.split(';');
      const [name, value] = nameValue.split('=');
      if (name && value) {
        setCookie(name, value, { path: '/', sameSite: 'Lax' });
      }
    });
  }
  
  console.log("🍪 Cookies después de GET:", document.cookie);
  console.log("🍪 JWT cookie value después:", getCookieValue('jwt'));

  if (res.ok) return res;
  throw res;
}

export async function post(
  url: string,
  body?: any,
  headers?: Record<string, string>
) {
  const fullUrl = `${BASE_URL}${url}`;
  console.log(`Making POST request to:`, fullUrl);
  console.log("Request headers:", {
    "Content-Type": "application/json",
    ...headers,
  });
  if (body) {
    console.log("Request body:", body);
  }
  
  console.log("🍪 Cookies antes de POST:", document.cookie);
  console.log("🍪 JWT cookie value:", getCookieValue('jwt'));
  
  const res = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  console.log(`Response status: ${res.status} for POST ${url}`);
  console.log("Response headers:", Object.fromEntries(res.headers.entries()));
  
  const setCookieHeader = res.headers.get('set-cookie');
  if (setCookieHeader) {
    console.log("🍪 Set-Cookie header received:", setCookieHeader);
    const cookies = setCookieHeader.split(',').map(cookie => cookie.trim());
    cookies.forEach(cookie => {
      const [nameValue] = cookie.split(';');
      const [name, value] = nameValue.split('=');
      if (name && value) {
        setCookie(name, value, { path: '/', sameSite: 'Lax' });
      }
    });
  }
  
  console.log("🍪 Cookies después de POST:", document.cookie);
  console.log("🍪 JWT cookie value después:", getCookieValue('jwt'));

  if (res.ok) return res;
  throw res;
}
