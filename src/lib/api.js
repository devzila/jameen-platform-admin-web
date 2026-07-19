"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("platform_token");
}

async function parseBody(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Low-level request helper.
 * @returns {{ data: any, ok: boolean, status: number, message?: string }}
 */
export async function apiRequest(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders = {
    Accept: "application/json",
    ...(token ? { Authorization: token } : {}),
    ...headers,
  };

  if (body != null && !isFormData && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body:
      body == null
        ? undefined
        : isFormData
          ? body
          : typeof body === "string"
            ? body
            : JSON.stringify(body),
    cache: "no-store",
  });

  const data = await parseBody(res);

  return {
    data,
    ok: res.ok,
    status: res.status,
    message:
      (data && typeof data === "object" && data.message) ||
      (!res.ok ? res.statusText : undefined),
  };
}

export const api = {
  get: (path) => apiRequest(path, { method: "GET" }),
  post: (path, body) => apiRequest(path, { method: "POST", body }),
  put: (path, body) => apiRequest(path, { method: "PUT", body }),
  del: (path) => apiRequest(path, { method: "DELETE" }),
};

export default api;
