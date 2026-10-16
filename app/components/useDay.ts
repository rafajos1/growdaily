"use client";

import { useEffect, useState } from "react";
import { DAY_EVENT, DAY_KEY, readDone, type AppSlug } from "../../lib/journey";

/** Apps finished today, kept in sync when another app (or tab) records one. */
export function useDay(): AppSlug[] {
  const [done, setDone] = useState<AppSlug[]>([]);
  useEffect(() => {
    const refresh = () => setDone(readDone());
    refresh();
    const onStorage = (e: StorageEvent) => e.key === DAY_KEY && refresh();
    window.addEventListener(DAY_EVENT, refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(DAY_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return done;
}
