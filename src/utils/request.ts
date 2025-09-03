//const BASE_URL = "https://backend-render-main.onrender.com";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-render-main.onrender.com";

// Simple thin wrapper around fetch()
// TODO: use something like axios if/when API use grows more complex
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

  if (res.ok) return res;
  throw res;
}

export async function get(
  url: string,
  body?: any,
  headers?: Record<string, string>
) {
  return apiRequest(url, "GET", body, headers);
}

export async function post(
  url: string,
  body?: any,
  headers?: Record<string, string>
) {
  return apiRequest(url, "POST", body, headers);
}
