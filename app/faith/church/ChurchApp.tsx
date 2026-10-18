"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ChevronDown, ExternalLink, LocateFixed, MapPin, MessageCircleQuestion, Navigation, Search } from "lucide-react";
import { SearchError, searchChurches, type Attempt } from "../../../lib/faith/churchSearch";
import { directionsUrl, RADII_MILES, type Church } from "../../../lib/faith/churches";
import { FIRST_VISIT } from "../../../lib/faith/firstVisit";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
const btnPrimary = `inline-flex items-center justify-center gap-2 rounded-[10px] bg-amber px-4 py-2.5 text-sm font-bold text-amber-ink transition hover:bg-amber-hover disabled:opacity-60 ${focus}`;
const btnSecondary = `inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-raised px-4 py-2.5 text-sm font-semibold text-fg transition hover:bg-[#24364f] disabled:opacity-60 ${focus}`;

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "results"; churches: Church[]; where: string; miles: number }
  | { kind: "error"; message: string; details?: Attempt[] };


export function ChurchApp() {
  const [place, setPlace] = useState("");
  const [miles, setMiles] = useState<number>(10);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [filter, setFilter] = useState("Any");
  const resultsRef = useRef<HTMLDivElement>(null);

  const search = async (where: { place: string } | { lat: number; lon: number }) => {
    setState({ kind: "loading" });
    setFilter("Any");
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    try {
      const { churches, label } = await searchChurches(where, miles);
      setState({ kind: "results", churches, where: label, miles });
    } catch (err) {
      setState(
        err instanceof SearchError
          ? { kind: "error", message: err.message, details: err.details }
          : { kind: "error", message: "The church map isn't answering right now. Please try again in a minute.", details: [{ service: "page", reason: String(err).slice(0, 80) }] },
      );
    }
  };

  const useLocation = () => {
    if (!("geolocation" in navigator)) return setState({ kind: "error", message: "Your browser can't share its location. Type a city or ZIP code instead." });
    setState({ kind: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => void search({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setState({ kind: "error", message: "We couldn't get your location. Type a city or ZIP code instead." }),
      { timeout: 10_000, maximumAge: 600_000 },
    );
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (place.trim().length < 2) return setState({ kind: "error", message: "Type a city or ZIP code first." });
    void search({ place: place.trim() });
  };

  const denominations = useMemo(() => {
    if (state.kind !== "results") return [];
    const counts = new Map<string, number>();
    for (const c of state.churches) counts.set(c.denomination || "Other", (counts.get(c.denomination || "Other") ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [state]);
  const shown = state.kind === "results" ? state.churches.filter((c) => filter === "Any" || (c.denomination || "Other") === filter) : [];

  return (
    <div className="px-[max(16px,env(safe-area-inset-left))]">
      <header className="mx-auto flex h-20 max-w-3xl items-center">
        <Link href="/faith" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <ArrowLeft className="h-5 w-5 text-muted" aria-hidden />
          <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_0_4px_rgba(242,181,75,0.15)]" aria-hidden />
          Faith
        </Link>
      </header>

      <main className="mx-auto max-w-3xl pb-24">
        <section className="pt-4 sm:pt-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 font-mono text-xs text-amber">
            <MapPin className="h-3.5 w-3.5" aria-hidden /> Find a church
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] [text-wrap:balance] sm:text-5xl">
            Find a church <span className="text-amber">near you</span>.
          </h1>
          <p className="mt-4 max-w-[56ch] text-lg text-soft">Every church is different. Here&apos;s a simple way to find some nearby, and what to expect when you walk in.</p>

          <div className="mt-7 rounded-2xl border border-line bg-panel p-4 sm:p-5">
            <button type="button" onClick={useLocation} disabled={state.kind === "loading"} className={`${btnPrimary} w-full sm:w-auto`}>
              <LocateFixed className="h-4 w-4" aria-hidden /> Use my location
            </button>
            <form onSubmit={submit} className="mt-4 flex flex-col gap-2 border-t border-hairline pt-4 sm:flex-row">
              <label htmlFor="place" className="sr-only">
                City or ZIP code
              </label>
              <input
                id="place"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                maxLength={100}
                placeholder="Or type a city or ZIP code"
                autoComplete="postal-code"
                className="min-w-0 flex-1 rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg placeholder:text-dim focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30"
              />
              <div className="flex gap-2">
                <label htmlFor="miles" className="sr-only">
                  Distance
                </label>
                <select id="miles" value={miles} onChange={(e) => setMiles(Number(e.target.value))} className="flex-1 rounded-[10px] border border-line bg-sunken px-3 py-2.5 text-sm text-fg sm:flex-none">
                  {RADII_MILES.map((m) => (
                    <option key={m} value={m}>
                      Within {m} miles
                    </option>
                  ))}
                </select>
                <button type="submit" disabled={state.kind === "loading"} className={btnSecondary}>
                  <Search className="h-4 w-4" aria-hidden /> Search
                </button>
              </div>
            </form>
            <p className="mt-3 font-mono text-[11px] text-dim">Your location is only used for this search and is never saved.</p>
          </div>
        </section>

        <div ref={resultsRef} className="scroll-mt-6 pt-8" aria-live="polite">
          {state.kind === "loading" && (
            <div className="space-y-3" aria-busy="true" aria-label="Searching">
              {[0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl border border-line bg-panel" />)}
            </div>
          )}
          {state.kind === "error" && (
            <div role="alert" className="rounded-xl border border-up/40 bg-up/10 p-4 text-sm">
              <p className="font-semibold text-up">{state.message}</p>
              {state.details && state.details.length > 0 && (
                <details className="mt-2 text-xs text-muted">
                  <summary className="cursor-pointer select-none">Details</summary>
                  <ul className="mt-1 space-y-0.5 font-mono">
                    {state.details.map((d, i) => (
                      <li key={i}>
                        {d.service}: {d.reason}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}
          {state.kind === "results" && (
            <section aria-labelledby="results-heading">
              <h2 id="results-heading" className="text-lg font-bold">
                {state.churches.length === 0
                  ? `No churches found within ${state.miles} miles`
                  : `${state.churches.length} ${state.churches.length === 1 ? "church" : "churches"} within ${state.miles} miles of ${state.where}`}
              </h2>
              {state.churches.length === 0 ? (
                <p className="mt-2 text-sm text-muted">Try a wider distance, or a nearby town. Map listings can be patchy in some areas.</p>
              ) : (
                <>
                  {denominations.length > 1 && (
                    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by tradition">
                      {[["Any", state.churches.length] as const, ...denominations].map(([d, n]) => (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={filter === d}
                          onClick={() => setFilter(d)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${filter === d ? "border-amber bg-amber/15 text-fg" : "border-line text-soft hover:border-amber/50"}`}
                        >
                          {d} <span className="font-mono text-dim">{n}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <ul className="mt-4 space-y-3">
                    {shown.map((c) => (
                      <li key={c.id} className="rounded-2xl border border-line bg-panel p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-bold">{c.name}</h3>
                            <p className="mt-0.5 text-sm text-muted">
                              {[c.denomination, c.address].filter(Boolean).join(" · ") || "Church"}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-sm text-amber">{c.miles < 0.1 ? "<0.1" : c.miles} mi</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a href={directionsUrl(c)} target="_blank" rel="noopener noreferrer" className={`${btnSecondary} px-3 py-2`}>
                            <Navigation className="h-4 w-4" aria-hidden /> Directions
                          </a>
                          {c.website && (
                            <a href={c.website} target="_blank" rel="noopener noreferrer nofollow" className={`${btnSecondary} px-3 py-2`}>
                              <ExternalLink className="h-4 w-4" aria-hidden /> Website
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-muted">Check a church&apos;s website or call ahead for service times. Distances are straight-line.</p>
                </>
              )}
            </section>
          )}
        </div>

        <section className="mt-10 rounded-2xl border border-line bg-panel p-5 sm:p-7" aria-labelledby="visit-heading">
          <h2 id="visit-heading" className="text-xl font-extrabold tracking-tight">
            Before your first visit
          </h2>
          <p className="mt-1 text-sm text-muted">Walking into a church for the first time can feel like a lot. Here&apos;s what usually happens.</p>
          <div className="mt-4 divide-y divide-hairline">
            {FIRST_VISIT.map(({ q, a }) => (
              <details key={q} className="group py-3">
                <summary className={`flex cursor-pointer list-none items-center justify-between gap-3 font-semibold ${focus}`}>
                  {q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-soft">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <Link href="/faith/ask" className="mt-5 flex items-center gap-3 rounded-2xl border border-amber/30 bg-amber/[0.06] p-5 transition hover:border-amber/60">
          <MessageCircleQuestion className="h-5 w-5 shrink-0 text-amber" aria-hidden />
          <span className="flex-1 text-sm">
            <strong className="text-fg">Not ready for church yet?</strong> <span className="text-soft">That&apos;s okay. Ask your questions first.</span>
          </span>
        </Link>

        <p className="mt-10 font-mono text-xs text-dim">
          Church locations ©{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">
            OpenStreetMap contributors
          </a>
          . Listings can be incomplete or out of date. GrowDaily isn&apos;t affiliated with any church.
        </p>
      </main>
    </div>
  );
}
