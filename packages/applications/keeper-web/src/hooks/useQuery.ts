import { useCallback, useMemo } from "react";
import * as Router from "react-router-dom";

export function useQuery() {
  const [searchParams, setSearchParams] = Router.useSearchParams();

  const set = useCallback((key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(key, value);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const get = useCallback((key: string): string | undefined => {
    const value = searchParams.get(key);
    return value === null ? undefined : value;
  }, [searchParams]);

  const reset = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return useMemo(() => {
    return { set, get, reset }
  }, [set, get, reset]);
}
