"use client";
import { useState } from "react";
import supabase from "../utils/supabaseClient";

export default function Home() {
  const [email, setEmail] = useState("");
  const [niche, setNiche] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Validate email
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      setSubmitting(false);
      return;
    }

    // Save to Supabase
    const { data, error: insertError } = await supabase
      .from("users")
      .insert([{ email, niche }]);

    if (insertError) {
      console.error(insertError);
      setError("Something went wrong. Try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
    setEmail("");
    setNiche("");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">GrowDaily.ai</h1>
        <p className="text-gray-600 text-center mb-6">
          Get daily AI ideas and influencer growth prompts.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Your niche (e.g. fitness, tech, travel)"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Subscribe"}
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
        ) : (
          <p className="text-green-600 text-center font-semibold">
            🎉 You’re in! Check your inbox for new ideas soon.
          </p>
        )}
      </div>
    </main>
  );
}