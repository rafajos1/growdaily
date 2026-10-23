import "./globals.css";
import Script from "next/script";
import { DM_Mono, Manrope } from "next/font/google";
import { SyncAgent } from "./components/SyncAgent";

const GA_ID = "G-D3TJDXQZBD";

const manrope = Manrope({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

export const metadata = {
  metadataBase: new URL("https://www.growdaily.ai"),
  // Fallbacks; each page sets its own title, description, canonical and preview (lib/seo.ts).
  title: "GrowDaily · Build your own AI apps, with a guide",
  description: "GrowDaily guides non-technical business owners and nonprofit leaders to build their own AI apps with Claude. See real examples and try them free.",
  applicationName: "GrowDaily",
  openGraph: { siteName: "GrowDaily", type: "website", locale: "en_US", images: ["/og?title=GrowDaily&subtitle=Build+your+own+AI+apps%2C+with+a+guide"] },
  twitter: { card: "summary_large_image" },
};

export const viewport = { themeColor: "#0d1520" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <SyncAgent />
        {/* Google Analytics (GA4) */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
