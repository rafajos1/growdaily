"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CircleCheck, Cloud, CloudOff, Loader2, X } from "lucide-react";
import { deleteSavedCopy, getStatus, inAppBrowserName, sendSignInEmail, signOut, startSync, subscribe, syncAvailable, syncNow, verifyCode, type SyncStatus } from "../../lib/sync/engine";

const DISMISS_KEY = "growdaily:save-dismissed";
const DISMISS_DAYS = 14;

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const btnPrimary = `inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-amber px-4 text-sm font-bold text-[#2a1c05] transition hover:brightness-110 disabled:opacity-60 ${focus}`;
const btnSecondary = `inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-line bg-raised px-4 text-sm font-semibold text-fg transition hover:bg-[#24364f] disabled:opacity-60 ${focus}`;
const input = `block min-h-12 w-full rounded-[10px] border border-line bg-sunken px-3.5 text-base text-fg placeholder:text-muted ${focus}`;

/** Live sync status, starting the sync engine on first use. */
export function useSyncStatus(): SyncStatus | null {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  useEffect(() => {
    startSync();
    let live = true;
    let unsubscribe = () => {};
    // Shows nothing until saving is switched on for the site.
    void syncAvailable().then((on) => {
      if (!on || !live) return;
      setStatus(getStatus());
      unsubscribe = subscribe(setStatus);
    });
    return () => {
      live = false;
      unsubscribe();
    };
  }, []);
  return status;
}

function dismissedRecently(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return at > 0 && Date.now() - at < DISMISS_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

const ago = (t: number | null) => {
  if (!t) return "";
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  return m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`;
};

/**
 * "Save my progress": an invitation under each app's header while signed out,
 * and a small saved indicator once signed in.
 */
export function SaveProgress() {
  const status = useSyncStatus();
  // Which sheet is open; fixed when opened so finishing sign-in doesn't swap it for Manage.
  const [sheet, setSheet] = useState<"sign-in" | "manage" | null>(null);
  const [hidden, setHidden] = useState(true);
  const [inApp, setInApp] = useState<string | null>(null);

  useEffect(() => {
    setHidden(dismissedRecently());
    setInApp(inAppBrowserName(navigator.userAgent));
  }, []);

  if (!status) return null;
  const signedIn = status.state !== "signed-out";
  const sheetEl = sheet === "manage" && signedIn ? <ManageSheet status={status} onClose={() => setSheet(null)} /> : sheet === "sign-in" ? <SignInSheet onClose={() => setSheet(null)} /> : null;

  if (signedIn) {
    const Icon = status.state === "offline" || status.state === "error" ? CloudOff : status.state === "syncing" ? Loader2 : CircleCheck;
    return (
      <>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Icon className={`h-4 w-4 shrink-0 ${status.state === "synced" ? "text-down" : ""} ${status.state === "syncing" ? "animate-spin" : ""}`} aria-hidden />
          <span className="min-w-0 truncate" role="status">
            {status.state === "offline" ? "Offline. Changes save when you're back online." : status.state === "error" ? status.message : status.state === "syncing" ? "Saving…" : `Progress saved ${ago(status.lastSynced)}`}
          </span>
          <button type="button" onClick={() => setSheet("manage")} className={`ml-auto shrink-0 rounded-md px-2 py-1 font-semibold text-soft hover:text-fg ${focus}`}>
            Manage
          </button>
        </div>
        {sheetEl}
      </>
    );
  }

  if (hidden && !inApp && !status.message) {
    // Dismissed: keep a quiet way in.
    return (
      <>
        <div className="flex justify-end">
          <button type="button" onClick={() => setSheet("sign-in")} className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold text-muted hover:text-fg ${focus}`}>
            <Cloud className="h-4 w-4" aria-hidden /> Save progress
          </button>
        </div>
        {sheetEl}
      </>
    );
  }
  return (
    <>
      <section aria-label="Save my progress" className="flex flex-col gap-3 rounded-xl border border-amber/40 bg-amber/10 p-4 text-sm text-soft sm:flex-row sm:items-center">
        <Cloud className="h-5 w-5 shrink-0 text-amber" aria-hidden />
        <p className="flex-1">
          {status.message ? (
            <span className="text-fg">{status.message}</span>
          ) : inApp ? (
            <>
              <strong className="text-fg">You&apos;re in {inApp}&apos;s built-in browser,</strong> which can forget your progress. Save it with your email, or open growdaily.ai in Safari or Chrome.
            </>
          ) : (
            <>
              <strong className="text-fg">Keep your progress.</strong> Save it with your email so it&apos;s here next time, on any phone or computer.
            </>
          )}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setSheet("sign-in")} className={btnPrimary}>
            Save my progress
          </button>
          <button
            type="button"
            aria-label="Not now"
            onClick={() => {
              try {
                localStorage.setItem(DISMISS_KEY, String(Date.now()));
              } catch {
                /* ignore */
              }
              setHidden(true);
            }}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] text-muted hover:text-fg ${focus}`}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </section>
      {sheetEl}
    </>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>("input, button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="save-title" className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-line bg-panel p-6 pb-[max(24px,env(safe-area-inset-bottom))] shadow-2xl shadow-black/50 sm:max-w-md sm:rounded-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="save-title" className="text-lg font-bold">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className={`-m-2 rounded-lg p-2 text-muted hover:text-fg ${focus}`}>
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

type Step = { kind: "email" } | { kind: "check"; email: string } | { kind: "done" };

function SignInSheet({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>({ kind: "email" });
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    const clean = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(clean)) return setError("Enter a valid email address.");
    setBusy(true);
    setError(null);
    try {
      await sendSignInEmail(clean, location.origin + location.pathname);
      setStep({ kind: "check", email: clean });
    } catch (err) {
      setError(/rate|seconds/i.test(String(err)) ? "Too many emails just now. Wait a minute and try again." : "Couldn't send the email. Check the address and try again.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    if (step.kind !== "check") return;
    const token = code.replace(/\D/g, "");
    if (token.length < 6) return setError("Enter the code from the email.");
    setBusy(true);
    setError(null);
    try {
      await verifyCode(step.email, token);
      setStep({ kind: "done" });
    } catch {
      setError("That code didn't work. Check it, or send a new email.");
    } finally {
      setBusy(false);
    }
  };

  if (step.kind === "done") {
    return (
      <Sheet title="Your progress is saved" onClose={onClose}>
        <p className="text-sm text-soft">From now on, changes save automatically. On another phone or computer, tap Save my progress and use the same email.</p>
        <button type="button" onClick={onClose} className={`${btnPrimary} mt-5 w-full`}>
          Done
        </button>
      </Sheet>
    );
  }

  if (step.kind === "check") {
    return (
      <Sheet title="Check your email" onClose={onClose}>
        <p className="text-sm text-soft">
          We sent a sign-in link to <strong className="text-fg">{step.email}</strong>. Tap it on this device, or type the code from the email here.
        </p>
        <form onSubmit={verify} className="mt-5 space-y-3">
          <label htmlFor="save-code" className="block text-sm font-semibold">
            Code from the email
          </label>
          <input id="save-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} className={`${input} font-mono tracking-[0.3em]`} />
          {error && (
            <p role="alert" className="text-sm text-up">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Save my progress
          </button>
        </form>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
          <button type="button" onClick={() => send()} disabled={busy} className={`rounded-md py-1 font-semibold text-soft hover:text-fg ${focus}`}>
            Send again
          </button>
          <button type="button" onClick={() => setStep({ kind: "email" })} className={`rounded-md py-1 font-semibold text-soft hover:text-fg ${focus}`}>
            Use a different email
          </button>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet title="Save my progress" onClose={onClose}>
      <p className="text-sm text-soft">Your habits, plans, meals, moods and spending will save to a private copy and come back on any device. No password to remember.</p>
      <form onSubmit={send} className="mt-5 space-y-3">
        <label htmlFor="save-email" className="block text-sm font-semibold">
          Email
        </label>
        <input id="save-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={input} />
        {error && (
          <p role="alert" className="text-sm text-up">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Email me a sign-in link
        </button>
      </form>
      <p className="mt-4 text-xs text-muted">We only use your email to sign you in. Your AI questions are never saved.</p>
    </Sheet>
  );
}

function ManageSheet({ status, onClose }: { status: SyncStatus; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const run = async (fn: () => Promise<void>, close = true) => {
    setBusy(true);
    try {
      await fn();
      if (close) onClose();
    } finally {
      setBusy(false);
    }
  };
  return (
    <Sheet title="Your saved progress" onClose={onClose}>
      <p className="text-sm text-soft">
        Saving to <strong className="text-fg">{status.email}</strong>
        {status.lastSynced ? `, last saved ${ago(status.lastSynced)}` : ""}. Changes save automatically.
      </p>
      <div className="mt-5 grid gap-2">
        <button type="button" disabled={busy} onClick={() => run(syncNow, false)} className={btnSecondary}>
          Sync now
        </button>
        <button type="button" disabled={busy} onClick={() => run(signOut)} className={btnSecondary}>
          Sign out on this device
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">Signing out keeps your progress on this device and in your account.</p>
      <div className="mt-6 border-t border-line pt-4">
        {confirmDelete ? (
          <div className="space-y-3">
            <p className="text-sm text-soft">Delete the saved copy from your account? Progress on this device stays.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setConfirmDelete(false)} className={`${btnSecondary} flex-1`}>
                Keep it
              </button>
              <button type="button" disabled={busy} onClick={() => run(deleteSavedCopy)} className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-[10px] bg-up px-4 text-sm font-bold text-[#2a0d06] ${focus}`}>
                Delete saved copy
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className={`rounded-md py-1 text-sm font-semibold text-muted hover:text-fg ${focus}`}>
            Delete my saved copy
          </button>
        )}
      </div>
    </Sheet>
  );
}
