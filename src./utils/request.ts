const BASE_URL = "https://backend-render-main.onrender.com/api";

// Simple thin wrapper around fetch()
// TODO: use something like axios if/when API use grows more complex
export async function apiRequest(
  url: string,
  method: "GET" | "POST" | "PUT",
  body?: any,
  headers?: Record<string, string>
) {
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

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
