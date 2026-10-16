"use client";

import { useCallback, useEffect, useState } from "react";
import { FAITH_EVENT, FAITH_KEY, readFaith, writeFaith } from "../../lib/faith";

/** The site-wide Faith switch, kept in sync across components and tabs. */
export function useFaith(): [boolean, (on: boolean) => void] {
  const [faith, setFaithState] = useState(false);

  useEffect(() => {
    setFaithState(readFaith());
    const onChange = (e: Event) => setFaithState(Boolean((e as CustomEvent<boolean>).detail));
    const onStorage = (e: StorageEvent) => {
      if (e.key === FAITH_KEY) setFaithState(e.newValue === "1");
    };
    window.addEventListener(FAITH_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(FAITH_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setFaith = useCallback((on: boolean) => {
    setFaithState(on);
    writeFaith(on);
  }, []);

  return [faith, setFaith];
}
