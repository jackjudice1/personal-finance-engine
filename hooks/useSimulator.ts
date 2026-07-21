"use client";

import { useEffect, useState } from "react";

/** Debounces a fast-changing value (e.g. slider drags) before it drives an expensive recompute or persistence call. */
export function useDebouncedValue<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
