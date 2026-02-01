import * as React from "react";

export function useLocalStorage<T>(key: string, initialValue?: T) {
  const parse = React.useCallback((raw: string | null): T | undefined => {
    return raw == null ? undefined : (JSON.parse(raw) as T);
  }, []);

  const stringify = React.useCallback((value: T): string => {
    return JSON.stringify(value);
  }, []);

  const getLocalStorageValue = React.useCallback((): T | undefined => {
    const raw = localStorage.getItem(key);
    return parse(raw);
  }, [key, parse]);

  const [value, setValue] = React.useState<T | undefined>(() => {
    if (initialValue !== undefined) return initialValue;
    return getLocalStorageValue();
  });

  React.useEffect(() => {
    const storageListenerHandler = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(parse(event.newValue));
      }
    };

    window.addEventListener("storage", storageListenerHandler);

    return () => {
      return window.removeEventListener("storage", storageListenerHandler);
    }
  }, [key, parse]);

  const set = React.useCallback((newValue: T) => {
    const raw = stringify(newValue);
    localStorage.setItem(key, raw);
    setValue(newValue);
  }, [key, stringify]);

  const unset = React.useCallback(() => {
    localStorage.removeItem(key);
    setValue(undefined);
  }, [key]);

  const copy = React.useCallback(() => {
    if (value !== undefined) {
      navigator.clipboard.writeText(String(value));
    }
  }, [value]);

  return React.useMemo(() => ({
    value, unset, copy, set 
  }), [value, unset, copy, set]);
}
