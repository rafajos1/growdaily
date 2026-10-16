// Builds Spendwise as one self-contained HTML page (no server needed) so it can
// be hosted as a static file on GrowDaily at /apps/spendwise.
//   node standalone/build.mjs            -> ../public/apps/spendwise/index.html
//   node standalone/build.mjs --fragment -> standalone/out/spendwise.html (no <html>/<head>, for embedding)
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const outDir = path.join(here, "out");
const fragment = process.argv.includes("--fragment");
mkdirSync(outDir, { recursive: true });

const shims = {
  "next/link": path.join(here, "shims/router.tsx"),
  "next/navigation": path.join(here, "shims/router.tsx"),
  "@/lib/csv": path.join(here, "shims/csv.ts"),
};

await build({
  entryPoints: [path.join(here, "main.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  outfile: path.join(outDir, "app.js"),
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
  plugins: [
    {
      name: "standalone-aliases",
      setup(b) {
        b.onResolve({ filter: /.*/ }, (args) => {
          if (shims[args.path]) return { path: shims[args.path] };
          if (args.path.startsWith("@real/")) return { path: path.join(root, "src", args.path.slice(6)) + ".ts" };
          if (args.path.startsWith("@/")) return b.resolve("./" + args.path.slice(2), { resolveDir: path.join(root, "src"), kind: args.kind });
          return undefined;
        });
      },
    },
  ],
});

execFileSync(path.join(root, "node_modules/.bin/tailwindcss"), ["-c", "tailwind.config.ts", "-i", "input.css", "-o", "out/app.css", "--minify"], { cwd: here, stdio: "ignore" });

const css = readFileSync(path.join(outDir, "app.css"), "utf8");
const js = readFileSync(path.join(outDir, "app.js"), "utf8");
if (/<\/script/i.test(js)) throw new Error("Bundle contains a </script> sequence");

// Search and social metadata, kept in step with the main site's lib/seo.ts.
const SITE = "https://www.growdaily.ai";
const TITLE = "Spendwise: Free Expense Tracker, No Sign-Up · GrowDaily";
const DESCRIPTION = "Free expense tracker that shows your spending pace for the month, which days you spend most, and what repeats every month. No sign-up; your data stays in your browser. Export to CSV any time.";
const OG_IMAGE = `${SITE}/og?${new URLSearchParams({ title: "Spendwise", subtitle: "Free expense tracker. No sign-up.", color: "#f2b54b" })}`;
const FAQS = [
  { q: "Is Spendwise really free?", a: "Yes. There's no account, sign-up or trial. Open it and start adding expenses." },
  { q: "Where is my spending data stored?", a: "In your own browser on this device, not on GrowDaily's servers. You can export everything to CSV at any time." },
  { q: "What does the monthly pace show?", a: "How much you've spent so far this month compared with the same point last month, and where the month is likely to end if you keep going at the same rate." },
  { q: "Does it work on my phone?", a: "Yes. Spendwise works in any modern browser on phones, tablets and computers." },
];
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const head = `<title>${esc(TITLE)}</title>
<meta name="description" content="${esc(DESCRIPTION)}">
<link rel="canonical" href="${SITE}/apps/spendwise">
<meta property="og:type" content="website">
<meta property="og:site_name" content="GrowDaily">
<meta property="og:url" content="${SITE}/apps/spendwise">
<meta property="og:title" content="${esc(TITLE)}">
<meta property="og:description" content="${esc(DESCRIPTION)}">
<meta property="og:image" content="${esc(OG_IMAGE)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(TITLE)}">
<meta name="twitter:description" content="${esc(DESCRIPTION)}">
<meta name="twitter:image" content="${esc(OG_IMAGE)}">
${jsonLd({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Spendwise",
  url: `${SITE}/apps/spendwise`,
  description: DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any (web browser)",
  browserRequirements: "Requires JavaScript",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: "GrowDaily", url: SITE },
})}
${jsonLd({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) })}
<meta name="theme-color" content="#0d1520">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=DM+Mono:wght@400;500&display=swap">
<style>
/* Spendwise "Pace" is a deliberately dark-only design; every color is set explicitly. */
:root { --font-manrope: "Manrope"; --font-dm-mono: "DM Mono"; color-scheme: dark; }
body { background: #0d1520; color: #e8eef5; margin: 0; }
${css}
</style>`;
// A readable explainer below the app, in the page's HTML so search engines see it without running the app.
const about = `<section aria-labelledby="about-heading" style="max-width:72rem;margin:0 auto;padding:16px max(16px,env(safe-area-inset-left)) 96px;font-family:var(--font-manrope),system-ui,sans-serif">
<div style="border-top:1px solid #1a2738;padding-top:40px">
<p style="margin:0;font-family:var(--font-dm-mono),monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#f2b54b">About Spendwise</p>
<h2 id="about-heading" style="margin:8px 0 0;max-width:30ch;font-size:24px;font-weight:800;letter-spacing:-.01em">A free expense tracker that shows your pace for the month</h2>
<p style="margin:12px 0 0;max-width:70ch;color:#c4d0de;line-height:1.6">Spendwise is a simple, private expense tracker. Add what you spend in a few taps and see how this month compares with last month, a daily spending calendar, where your money goes by category, and the charges that repeat every month. Export to CSV whenever you like.</p>
<dl style="margin:24px 0 0;display:grid;gap:20px 32px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
${FAQS.map(({ q, a }) => `<div><dt style="font-weight:600">${esc(q)}</dt><dd style="margin:4px 0 0;font-size:14px;line-height:1.6;color:#8a9bb2">${esc(a)}</dd></div>`).join("\n")}
</dl>
<p style="margin:32px 0 0;font-size:14px"><a href="/" style="color:#f2b54b;font-weight:600">More free apps from GrowDaily</a></p>
</div>
</section>`;
const body = `<div id="root"></div>\n${about}\n<script>\n${js}\n</script>`;

if (fragment) {
  writeFileSync(path.join(outDir, "spendwise.html"), `${head}\n${body}\n`);
  console.log("wrote standalone/out/spendwise.html");
} else {
  const dest = path.resolve(root, "../public/apps/spendwise");
  mkdirSync(dest, { recursive: true });
  writeFileSync(
    path.join(dest, "index.html"),
    `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`,
  );
  console.log("wrote public/apps/spendwise/index.html");
}
