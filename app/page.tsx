"use client";
import { useState } from "react";
import { supabaseClient } from "../utils/supabaseClient";

export default function Home() {
  const [email, setEmail] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !niche) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabaseClient
        .from('users')
        .insert([
          { 
            email: email,
            niche: niche,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Success! You're on the waitlist 🎉");
        setEmail("");
        setNiche("");
        
        // Optional: Save email to localStorage and redirect to dashboard
        if (typeof window !== 'undefined') {
          localStorage.setItem('userEmail', email);
        }
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-6xl font-bold mb-4">GrowDaily</h1>
        <p className="text-2xl mb-8">Your daily dose of growth</p>
        <p className="text-xl opacity-90 mb-12">
          Get 5 personalized content ideas every morning ☀️
        </p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Join the Waitlist</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            >
              <option value="">Select your niche</option>
              <option value="fitness">Fitness</option>
              <option value="beauty">Beauty</option>
              <option value="food">Food & Cooking</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="tech">Tech</option>
              <option value="travel">Travel</option>
              <option value="fashion">Fashion</option>
              <option value="health">Health & Wellness</option>
              <option value="other">Other</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.includes("Success") 
                ? "bg-green-500/20 text-green-100" 
                : "bg-red-500/20 text-red-100"
            }`}>
              {message}
            </div>
          )}
        </div>

        <p className="mt-8 text-sm opacity-75">
          Launching February 2025 🚀
        </p>
      </div>
    </div>
  );
}