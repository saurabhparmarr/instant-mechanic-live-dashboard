import { useCallback, useEffect, useRef, useState } from "react";

export const useApi = (apiFunction, options = {}) => {
  const {
    immediate = true,
    initialData = null,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      if (!mountedRef.current) return;

      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);

        if (mountedRef.current) {
          setData(result);
        }

        return result;
      } catch (err) {
        if (mountedRef.current) {
          setError(err);
        }

        throw err;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [apiFunction]
  );

  useEffect(() => {
    if (!immediate) return;

    execute().catch(() => {
      // Error is already stored in hook state.
    });
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
    setData,
    setError,
  };
};