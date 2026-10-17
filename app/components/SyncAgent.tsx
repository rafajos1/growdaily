"use client";

import { useEffect } from "react";
import { startSync } from "../../lib/sync/engine";

/** Runs "Save my progress" on every page: finishes email sign-ins and keeps saving changes. */
export function SyncAgent() {
  useEffect(() => startSync(), []);
  return null;
}
