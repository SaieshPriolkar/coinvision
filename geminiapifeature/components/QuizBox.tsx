import React, { useEffect, useState } from "react";
import { QuizQuestion } from "../utils/generateQuiz";

type Props = {
  questions: QuizQuestion[];
};

export default function QuizBox({ questions }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    if (submitted) return;
    if (timer === 0) goToNextQuestion();

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, submitted]);

  const handleOptionClick = (option: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = option;
    setSelectedAnswers(updatedAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimer(15);
    } else {
      setSubmitted(true);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const q = questions[currentQuestion];
  const selected = selectedAnswers[currentQuestion];

  return (
    <div className="space-y-6">
      {!submitted ? (
        <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white drop-shadow">
              Q{currentQuestion + 1}. {q.question}
            </h2>
            <span className="px-4 py-1 bg-red-500/80 text-white font-bold rounded-full shadow-lg animate-pulse">
              {timer}s
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {q.options.map((option, optIndex) => {
              const isSelected = selected === option;
              return (
                <button
                  key={optIndex}
                  onClick={() => handleOptionClick(option)}
                  className={`px-4 py-3 rounded-lg border transition-all duration-300 text-left font-medium 
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400 shadow-lg"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <button
            onClick={goToNextQuestion}
            className="mt-5 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 
                       hover:from-emerald-500 hover:to-green-500 
                       transition-all duration-300 shadow-lg text-white font-semibold"
          >
            Next ➡️
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === q.answer;
            return (
              <div
                key={index}
                className={`p-5 rounded-2xl backdrop-blur-xl border shadow-lg ${
                  isCorrect
                    ? "bg-green-500/20 border-green-400"
                    : "bg-red-500/20 border-red-400"
                }`}
              >
                <h2 className="text-lg font-semibold text-white mb-2">
                  Q{index + 1}. {q.question}
                </h2>
                <p className="text-white">
                  Your Answer:{" "}
                  <span
                    className={`font-semibold ${
                      isCorrect
                        ? "text-green-300"
                        : "text-red-300 line-through"
                    }`}
                  >
                    {userAnswer || "Not answered"}
                  </span>
                </p>
                <p className="text-white">
                  Correct Answer:{" "}
                  <span className="font-bold text-green-300">{q.answer}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3 rounded-lg 
                     text-white font-semibold mt-4 hover:from-orange-500 hover:to-yellow-500 
                     transition-all duration-300 shadow-lg"
        >
          ✅ Submit Quiz
        </button>
      )}
    </div>
  );
}
