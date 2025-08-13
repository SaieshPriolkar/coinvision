"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unknown error");
      }

      setImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-sky-900 p-6">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-2xl text-white">
        <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-lg">
          💰 Currency Redesign Generator
        </h1>

        <textarea
          className="w-full px-4 py-3 mb-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
          rows={4}
          placeholder="Describe your futuristic currency idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-600 hover:to-blue-600 shadow-lg hover:shadow-blue-500/50 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

        {imageUrl && (
          <div className="mt-6 animate-fadeIn">
            <img
              src={imageUrl}
              alt="Generated currency"
              className="rounded-xl shadow-lg border border-white/30 hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
      </div>
    </main>
  );
}
