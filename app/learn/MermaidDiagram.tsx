"use client";

import { useEffect, useId, useState } from "react";
import { CopyButton } from "./CopyButton";

// Loaded from the CDN only when a page has a diagram, so it adds nothing to other pages.
const MERMAID_URL = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

/**
 * Draws a Mermaid diagram in the site's colors. Until it loads (or if it
 * can't), readers see the source, which they can copy into their own docs.
 */
export function MermaidDiagram({ title, code, caption }: { title: string; code: string; caption?: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const renderId = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import(/* webpackIgnore: true */ MERMAID_URL);
        const mermaid = mod.default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: "inherit",
          flowchart: { curve: "basis", padding: 14 },
          themeVariables: {
            darkMode: true,
            background: "#131e2c",
            primaryColor: "#1e2d42",
            primaryBorderColor: "#3b5677",
            primaryTextColor: "#e8eef5",
            lineColor: "#8a9bb2",
            textColor: "#cdd8e5",
            fontSize: "15px",
          },
        });
        const out = await mermaid.render(renderId, code);
        if (!cancelled) setSvg(out.svg);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, renderId]);

  return (
    <figure className="overflow-hidden rounded-2xl border border-line">
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-raised px-4 py-3">
        <span className="font-semibold text-fg">{title}</span>
        <CopyButton text={code} label="Copy Mermaid" />
      </figcaption>
      {svg ? (
        <div role="img" aria-label={title} className="flex justify-center overflow-x-auto bg-panel p-4 sm:p-6 [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="bg-sunken p-4">
          {!failed && <p className="mb-3 text-sm text-muted">Drawing the diagram…</p>}
          <pre className="max-h-[28rem] overflow-auto font-mono text-[13px] leading-relaxed text-soft">
            <code>{code}</code>
          </pre>
        </div>
      )}
      {caption && <p className="border-t border-line bg-panel px-4 py-3 text-sm text-muted">{caption}</p>}
    </figure>
  );
}
