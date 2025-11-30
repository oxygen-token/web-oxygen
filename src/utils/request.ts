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
};

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
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: "include", 
  });

  const setCookieHeader = res.headers.get('set-cookie');
  if (setCookieHeader) {
    const cookies = setCookieHeader.split(',').map(cookie => cookie.trim());
    cookies.forEach(cookie => {
      const [nameValue] = cookie.split(';');
      const [name, value] = nameValue.split('=');
      if (name && value) {
        setCookie(name, value, { path: '/', sameSite: 'Lax' });
      }
    });
  }

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
      ...headers,
    },
    credentials: "include",
  });
  
  const setCookieHeader = res.headers.get('set-cookie');
  if (setCookieHeader) {
    const cookies = setCookieHeader.split(',').map(cookie => cookie.trim());
    cookies.forEach(cookie => {
      const [nameValue] = cookie.split(';');
      const [name, value] = nameValue.split('=');
      if (name && value) {
        setCookie(name, value, { path: '/', sameSite: 'Lax' });
      }
    });
  }

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
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  
  const setCookieHeader = res.headers.get('set-cookie');
  if (setCookieHeader) {
    const cookies = setCookieHeader.split(',').map(cookie => cookie.trim());
    cookies.forEach(cookie => {
      const [nameValue] = cookie.split(';');
      const [name, value] = nameValue.split('=');
      if (name && value) {
        setCookie(name, value, { path: '/', sameSite: 'Lax' });
      }
    });
  }

  if (res.ok) return await res.json();
  throw res;
}
