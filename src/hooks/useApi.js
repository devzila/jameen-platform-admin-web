"use client";

import { useCallback, useMemo, useState } from "react";
import { apiRequest } from "lib/api";

/**
 * Drop-in style replacement for use-http's useFetch() used across views.
 * Mutates a stable `response` object so `if (response.ok)` works right after await.
 * `get` / `post` / `put` / `del` are referentially stable (safe for useEffect deps).
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

  // Keep setters stable without putting loading in run's identity churn beyond setState
  const run = useCallback(async (method, path, body) => {
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
  }, [response]);

  const get = useCallback((path) => run("GET", path), [run]);
  const post = useCallback((path, body) => run("POST", path, body), [run]);
  const put = useCallback((path, body) => run("PUT", path, body), [run]);
  const del = useCallback((path) => run("DELETE", path), [run]);

  return {
    get,
    post,
    put,
    del,
    response,
    loading,
    error,
  };
}
