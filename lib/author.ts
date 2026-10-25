import { SITE_URL } from "./seo";

/** The person behind GrowDaily, credited on the About page and as the author of the Learn guides. */
export const AUTHOR = {
  name: "Rafael",
  path: "/about",
  schema: {
    "@type": "Person",
    name: "Rafael",
    url: `${SITE_URL}/about`,
    jobTitle: "Founder, GrowDaily",
    description: "Former pastor of 14 years, with 25+ years leading enterprise data, analytics and AI transformation.",
    knowsAbout: ["Artificial intelligence", "Generative AI", "Data platforms", "Analytics", "Agile delivery", "Technology and faith"],
  },
} as const;
