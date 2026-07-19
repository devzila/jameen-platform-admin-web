"use client";

import { useCallback, useMemo, useState } from "react";
import { apiRequest } from "lib/api";

/**
 * Drop-in style replacement for use-http's useFetch() used across views.
 * Mutates a stable `response` object so `if (response.ok)` works right after await.
 */
export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const response = useMemo(
    () => ({
      ok: false,
      status: 0,
      data: null,
    }),
    []
  );

  const run = useCallback(
    async (method, path, body) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiRequest(path, { method, body });
        response.ok = result.ok;
        response.status = result.status;
        response.data = result.data;
        if (!result.ok) {
          setError(result.message || "Request failed");
        }
        return result.data;
      } catch (err) {
        response.ok = false;
        response.status = 0;
        response.data = null;
        setError(err?.message || "Network error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [response]
  );

  return {
    get: (path) => run("GET", path),
    post: (path, body) => run("POST", path, body),
    put: (path, body) => run("PUT", path, body),
    del: (path) => run("DELETE", path),
    response,
    loading,
    error,
  };
}
