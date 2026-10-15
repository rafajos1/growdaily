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

const head = `<title>Spendwise · GrowDaily</title>
<meta name="description" content="Free expense tracker: see your pace for the month, spot trends, and export to CSV. Your data stays in your browser.">
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
const body = `<div id="root"></div>\n<script>\n${js}\n</script>`;

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
