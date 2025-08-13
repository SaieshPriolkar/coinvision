"use client";
import { useState } from "react";
import { generateImage } from "@/utils/generateImage";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const url = await generateImage(prompt);
      if (url) setImageUrl(url);
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 p-6">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-lg text-white">
        <h1 className="text-3xl font-bold text-center mb-6 drop-shadow-lg">
          🎨 AI Image Generator
        </h1>

        {/* Input */}
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image idea..."
          className="w-full px-4 py-3 mb-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        {/* Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 shadow-lg hover:shadow-blue-500/50 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>

        {/* Image Display */}
        {imageUrl && (
          <div className="mt-6 animate-fadeIn">
            <img
              src={imageUrl}
              alt="Generated"
              className="rounded-xl shadow-lg border border-white/30 hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
