'use client';

import React, { useState } from "react";
import { generateQuiz } from "../../utils/generateQuiz";
import QuizBox from "../../components/QuizBox";

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const quiz = await generateQuiz();
      setQuestions(quiz);
    } catch (err) {
      console.error("Quiz generation failed", err);
      alert("Quiz generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
      <div className="w-full max-w-3xl text-center backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-8">
          🧠 Currency Quiz
        </h1>

        <button
          onClick={handleGenerate}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 
                     hover:from-emerald-500 hover:to-green-500 
                     transition-all duration-300 shadow-lg 
                     hover:shadow-emerald-500/50 font-semibold text-white text-lg"
          disabled={loading}
        >
          {loading ? "Generating..." : "🚀 Generate Quiz"}
        </button>

        {questions.length > 0 && (
          <div className="mt-10">
            <QuizBox questions={questions} />
          </div>
        )}
      </div>
    </main>
  );
}
