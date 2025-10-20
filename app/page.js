"use client";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [email, setEmail] = useState("");
  const [niche, setNiche] = useState("");
  const [website, setWebsite] = useState(""); // HONEYPOT
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 0) Honeypot check — if filled, treat as success but do nothing
    if (website && website.trim().length > 0) {
      setSubmitted(true);
      setEmail("");
      setNiche("");
      return;
    }

    // 1) Client-side validation
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (niche.trim().length < 2) {
      setError("Please tell us your niche (e.g., fitness, tech, beauty).");
      return;
    }

    setSubmitting(true);
    try {
      // 2) Save to Supabase
      const { error: insertError } = await supabase
        .from("waitlist")
        .insert([{ email: email.trim(), niche: niche.trim() }]);

      if (insertError) {
        // 23505 = unique_violation
        if ((insertError as any).code === "23505") {
          setError("You're already on the list!");
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

      // 3) Fire welcome email (server route)
      try {
        await fetch("/api/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), niche: niche.trim() }),
        });
      } catch {
        // fail silently in MVP
      }

      setSubmitted(true);
      setEmail("");
      setNiche("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center px-6">
      <div className="max-w-3xl text-center text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Stop Spending 2 Hours Brainstorming Content
        </h1>
        <p className="text-xl md:text-2xl mb-6 font-light">
          Get 5 AI-Powered Ideas Tailored to{" "}
          <span className="font-semibold">Your Voice</span> — Every Morning.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-left text-white/90 shadow-xl"
            autoComplete="off"
          >
            {/* Honeypot field (hidden from users, visible to bots) */}
            <div className="absolute left-[-10000px]" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <label className="block mb-2 font-semibold">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg text-black mb-4"
              placeholder="you@example.com"
              autoComplete="email"
            />

            <label className="block mb-2 font-semibold">Your Niche</label>
            <input
              type="text"
              required
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full p-3 rounded-lg text-black mb-4"
              placeholder="fitness, tech, lifestyle..."
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-white text-purple-700 font-bold py-3 rounded-full shadow-lg transition ${
                submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
              }`}
            >
              {submitting ? "Joining..." : "Join the Free Waitlist 🚀"}
            </button>

            {error && <p className="text-red-200 mt-3">{error}</p>}
            <p className="text-sm mt-3 opacity-90">No spam. Just smart ideas.</p>
          </form>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-xl">
            <h2 className="text-2xl font-semibold mb-2">You're in! 🎉</h2>
            <p>We’ll email you once the beta opens.</p>
          </div>
        )}

        <footer className="mt-12 text-sm opacity-80">
          © {new Date().getFullYear()} GrowDaily.ai — Built with ❤️ in Colorado Springs
        </footer>
      </div>
    </main>
  );
}
