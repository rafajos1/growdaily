/** How people reach GrowDaily. Safe to import from server and client components. */
export const CONTACT_EMAIL = "hello@growdaily.ai";

/** Optional scheduling link (Calendly, Cal.com…), set in Vercel as NEXT_PUBLIC_BOOKING_URL. Hidden when unset. */
const booking = process.env.NEXT_PUBLIC_BOOKING_URL;
export const BOOKING_URL = booking?.startsWith("https://") ? booking : undefined;
