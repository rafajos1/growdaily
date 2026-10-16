import "./globals.css";
import { DM_Mono, Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

export const metadata = {
  metadataBase: new URL("https://www.growdaily.ai"),
  // Fallbacks; each page sets its own title, description, canonical and preview (lib/seo.ts).
  title: "GrowDaily · Free AI apps to run your life better",
  description: "Small, free apps for your money, habits, time, food and mood. No account needed, and your data stays on your device.",
  applicationName: "GrowDaily",
  openGraph: { siteName: "GrowDaily", type: "website", locale: "en_US", images: ["/og?title=GrowDaily&subtitle=Free+AI+apps+to+run+your+life+better"] },
  twitter: { card: "summary_large_image" },
};

export const viewport = { themeColor: "#0d1520" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
