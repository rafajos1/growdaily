"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../utils/supabaseClient";
// If you’ve added OneSignal, it’s optional to import & init here:
// import OneSignal from "react-onesignal";

export default function ChatUI({ userId = "demo-user" }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hey there! I’m GrowDaily — your personal AI growth coach." },
    { from: "bot", text: "Let’s set you up so I can send ideas tuned to your vibe." },
    { from: "bot", text: "Which platform do you focus on — Instagram, YouTube, TikTok, or something else?" },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    platform: "",
    tone: "",
    profile: "",
    goal: "",
  });

  // Optional: OneSignal push (enable later if you like)
  // useEffect(() => {
  //   OneSignal.init({ appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID });
  //   OneSignal.showSlidedownPrompt();
  // }, []);

  const ask = (text, delay = 500) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text }]);
    }, delay);
  };

  const handleResponse = async (value) => {
    // Echo user message
    setMessages((prev) => [...prev, { from: "user", text: value }]);

    // Flow
    if (step === 0) {
      setUserData((p) => ({ ...p, platform: value }));
      setStep(1);
      ask("How would you describe your content style — motivational, funny, educational, or something else?");
      return;
    }

    if (step === 1) {
      setUserData((p) => ({ ...p, tone: value }));
      setStep(2);
      ask("Can you drop your main social or website link? I’ll peek at your vibe.");
      return;
    }

    if (step === 2) {
      setUserData((p) => ({ ...p, profile: value }));
      setStep(3);
      ask("What’s your main goal — grow followers, build community, or earn income?");
      return;
    }

    if (step === 3) {
      const final = { ...userData, goal: value };

      // Save to Supabase (best-effort)
      try {
        await supabase.from("users").insert([final]);
      } catch (e) {
        console.warn("Supabase insert warning:", e?.message);
      }

      setUserData(final);
      setStep(4);
      ask("🌱 Perfect! You’re all set. I’ll start sending you daily ideas soon.", 400);

      // Pull ideas
      setLoading(true);
      setTimeout(async () => {
        try {
          const res = await fetch("/api/trend-ideas", {
            method: "POST",
            body: JSON.stringify({ userId }),
          });
          const data = await res.json();

          // data.ideas is a JSON string from the model; try to parse
          let textOut = "Here are today’s ideas.";
          try {
            const parsed = JSON.parse(data.ideas);
            textOut =
              `💡 Here are today’s ideas:\n\n` +
              parsed.ideas.map((i, idx) => `${idx + 1}. ${i}`).join("\n") +
              `\n\n🔥 Trending Topic: ${parsed.trendingTopic}\n✍️ Caption: ${parsed.caption}`;
          } catch {
            // fallback: show raw content
            textOut = `💡 ${data.ideas}`;
          }

          setMessages((prev) => [...prev, { from: "bot", text: textOut }]);
        } catch (err) {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "⚠️ Couldn’t fetch ideas right now. Try again in a moment." },
          ]);
        } finally {
          setLoading(false);
        }
      }, 1600);

      return;
    }

    // After onboarding: trigger ideas when they ask
    const v = value.toLowerCase();
    if (v.includes("idea") || v.includes("post")) {
      setLoading(true);
      try {
        const res = await fetch("/api/trend-ideas", {
          method: "POST",
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();

        let textOut = "Here are today’s ideas.";
        try {
          const parsed = JSON.parse(data.ideas);
          textOut =
            `💡 Here are today’s ideas:\n\n` +
            parsed.ideas.map((i, idx) => `${idx + 1}. ${i}`).join("\n") +
            `\n\n🔥 Trending Topic: ${parsed.trendingTopic}\n✍️ Caption: ${parsed.caption}`;
        } catch {
          textOut = `💡 ${data.ideas}`;
        }

        setMessages((prev) => [...prev, { from: "bot", text: textOut }]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "⚠️ Couldn’t fetch ideas. Try again." },
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      ask("Type ‘ideas’ or ask ‘what should I post today?’ to get suggestions.");
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleResponse(input.trim());
    setInput("");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 flex flex-col space-y-4">
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`p-3 rounded-lg max-w-[80%] whitespace-pre-line ${
                  msg.from === "bot"
                    ? "bg-blue-100 text-gray-800 self-start"
                    : "bg-blue-600 text-white self-end"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center space-x-1 text-gray-400 self-start ml-2 animate-pulse">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
